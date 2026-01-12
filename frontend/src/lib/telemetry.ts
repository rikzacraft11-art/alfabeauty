type DeviceType = "mobile" | "desktop" | "unknown";

const INITIAL_URL_KEY = "alfab_page_url_initial";

function getDeviceType(): DeviceType {
  // Prefer UA-CH where available.
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
  return window.location.href;
}

function sendJSONBeacon(url: string, payload: unknown): boolean {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    return navigator.sendBeacon(url, blob);
  }

  // Fallback: fire-and-forget fetch with keepalive.
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Best-effort.
  });

  return true;
}

const queue: Array<{ url: string; payload: unknown }> = [];
let listenersInstalled = false;

// If beacons fail repeatedly (rare), avoid unbounded memory growth.
const MAX_QUEUE = 50;

function installFlushOnHidden() {
  if (listenersInstalled) return;
  listenersInstalled = true;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "hidden") return;
    flushQueue();
  });
}

function flushQueue() {
  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    const ok = sendJSONBeacon(item.url, item.payload);
    if (!ok) {
      // If beacon fails, stop flushing to avoid spinning.
      queue.unshift(item);
      break;
    }
  }
}

export function postTelemetry(path: "/api/rum" | "/api/events", payload: Record<string, unknown>) {
  installFlushOnHidden();

  const url = new URL(path, window.location.origin).toString();
  const enriched = {
    ...payload,
    device_type: getDeviceType(),
    page_url_initial: getInitialPageUrl(),
    page_url_current: getCurrentPageUrl(),
    timestamp: new Date().toISOString(),
  };

  const ok = sendJSONBeacon(url, enriched);
  if (!ok) {
    queue.push({ url, payload: enriched });

    // Drop oldest items if the queue grows too large.
    while (queue.length > MAX_QUEUE) {
      queue.shift();
    }
  }
}
