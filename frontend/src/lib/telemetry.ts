/**
 * Telemetry utilities for RUM and analytics events.
 * Client-side only - uses browser APIs.
 */

type DeviceType = "mobile" | "desktop" | "unknown";

const INITIAL_URL_KEY = "alfab_page_url_initial";

/** Check if we're in a browser environment */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof navigator !== "undefined";
}

function getDeviceType(): DeviceType {
  if (!isBrowser()) return "unknown";

  // Prefer UA-CH where available
  const uaData = (navigator as unknown as { userAgentData?: { mobile?: boolean } }).userAgentData;
  if (typeof uaData?.mobile === "boolean") {
    return uaData.mobile ? "mobile" : "desktop";
  }

  const ua = navigator.userAgent.toLowerCase();
  if (/mobi|android|iphone|ipad|ipod/.test(ua)) return "mobile";
  if (ua.length > 0) return "desktop";
  return "unknown";
}

export function getInitialPageUrl(): string {
  if (!isBrowser()) return "";

  try {
    const existing = sessionStorage.getItem(INITIAL_URL_KEY);
    if (existing) return existing;
    const now = window.location.href;
    sessionStorage.setItem(INITIAL_URL_KEY, now);
    return now;
  } catch {
    return window.location.href;
  }
}

export function getCurrentPageUrl(): string {
  if (!isBrowser()) return "";
  return window.location.href;
}

/**
 * Telemetry queue for lifecycle-safe sending.
 * ADR-0002: flush on visibilitychange→hidden (not unload)
 */
const telemetryQueue: Array<{ url: string; payload: unknown }> = [];
let flushListenerRegistered = false;
let flushScheduled = false;

/**
 * Send a JSON beacon to the server.
 * Uses sendBeacon if available, falls back to keepalive fetch.
 */
function sendJSONBeacon(url: string, payload: unknown): void {
  if (!isBrowser()) return;

  const body = JSON.stringify(payload);

  // Playwright/WebDriver audit: prefer fetch so request bodies are observable.
  // Some automation environments don't expose sendBeacon payloads via request.postData().
  const isAutomated = (navigator as unknown as { webdriver?: boolean }).webdriver === true;

  // Prefer sendBeacon for reliability during page unload
  if (!isAutomated && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }

  // Fallback: fire-and-forget fetch with keepalive
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Best-effort telemetry - silently ignore failures
  });
}

/**
 * Flush all queued telemetry immediately.
 * Called on visibilitychange→hidden per ADR-0002.
 */
function flushTelemetryQueue(): void {
  while (telemetryQueue.length > 0) {
    const item = telemetryQueue.shift();
    if (item) {
      sendJSONBeacon(item.url, item.payload);
    }
  }
}

/**
 * Schedule a near-immediate flush.
 *
 * We intentionally enqueue first, then flush in a microtask (or setTimeout fallback)
 * so the visibilitychange handler can flush any remaining items without duplicates.
 */
function scheduleFlush(): void {
  if (flushScheduled || !isBrowser()) return;
  flushScheduled = true;

  const run = () => {
    flushScheduled = false;
    flushTelemetryQueue();
  };

  // queueMicrotask is widely supported and runs before the next frame.
  if (typeof queueMicrotask === "function") {
    queueMicrotask(run);
    return;
  }

  // Fallback for older environments.
  setTimeout(run, 0);
}

/**
 * Register visibility change listener (once).
 * ADR-0002: flush on visibilitychange→hidden, not unload.
 */
function ensureFlushListener(): void {
  if (flushListenerRegistered || !isBrowser()) return;
  flushListenerRegistered = true;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushTelemetryQueue();
    }
  });
}

/**
 * Post telemetry data to the server.
 * 
 * NOTE: Internal telemetry endpoints (/api/rum, /api/events) were removed
 * as they forwarded to a non-existent Go backend.
 * This function is now a no-op. Events are sent to GA4 via trackEvent().
 * 
 * @deprecated Use trackEvent() which sends to GA4 directly.
 */
export function postTelemetry(_path: "/api/rum" | "/api/events", _payload: Record<string, unknown>): void {
  // No-op: Internal telemetry endpoints removed.
  // Events are tracked via GA4 in trackEvent().
}

// Re-export analytics event types for convenience
export type AnalyticsEventName =
  | "cta_whatsapp_click"
  | "cta_whatsapp_blocked" // Distinct from click: config missing, not a real click-out
  | "cta_email_click"
  | "lead_submit_success"
  | "lead_submit_error";

import { sendGAEvent } from "@next/third-parties/google";

/**
 * Track an analytics event.
 * Wrapper around postTelemetry with typed event names.
 * Also sends to Google Analytics 4 via @next/third-parties.
 */
export function trackEvent(name: AnalyticsEventName, data?: Record<string, unknown>): void {
  // 1. Send to internal telemetry API (RUM/Events)
  postTelemetry("/api/events", {
    event_name: name,
    ...(data ?? {}),
  });

  // 2. Send to Google Analytics 4
  // sendGAEvent uses window.gtag internally if initialized
  sendGAEvent("event", name, data ?? {});
}
