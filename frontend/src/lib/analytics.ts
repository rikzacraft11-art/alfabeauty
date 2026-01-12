import { postTelemetry } from "@/lib/telemetry";

export type AnalyticsEventName =
  | "cta_whatsapp_click"
  | "cta_email_click"
  | "lead_submit_success"
  | "lead_submit_error";

export function trackEvent(name: AnalyticsEventName, data?: Record<string, unknown>) {
  postTelemetry("/api/events", {
    event_name: name,
    ...(data ?? {}),
  });
}
