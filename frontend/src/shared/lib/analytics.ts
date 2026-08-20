/* ─────────────────────────────────────────────────────────────────────
 * Analytics — Event Helpers
 *
 * Centralized analytics event tracking for GA4, Facebook Pixel,
 * and Microsoft Clarity (Yucca gap fix).
 *
 * Events:
 *   - cta_whatsapp_click: WhatsApp CTA clicked
 *   - lead_form_submit: Partnership form submitted successfully
 *
 * Usage:
 *   import { trackEvent } from "@/shared/lib/analytics";
 *   trackEvent("cta_whatsapp_click", { location: "hero" });
 * ───────────────────────────────────────────────────────────────────── */

type GtagEvent = {
  cta_whatsapp_click: {
    location: string;    // e.g. "hero", "product_detail", "sticky_fab", "footer"
    product_name?: string;
  };
  lead_form_submit: {
    salon_type: string;
    city: string;
  };
};

/**
 * Send a custom event to GA4, Facebook Pixel, and tag Clarity.
 * No-ops gracefully if any SDK is not loaded.
 */
export function trackEvent<K extends keyof GtagEvent>(
  event: K,
  params: GtagEvent[K]
): void {
  if (typeof window === "undefined") return;

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  };

  // GA4
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
  }

  // Facebook Pixel — forward as custom event
  if (typeof w.fbq === "function") {
    w.fbq("trackCustom", event, params);
  }

  // Microsoft Clarity — tag session with event name for filtering
  if (typeof w.clarity === "function") {
    w.clarity("set", "last_event", event);
  }
}

