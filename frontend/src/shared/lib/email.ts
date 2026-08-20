/* ─────────────────────────────────────────────────────────────────────
 * Email — Shared Notification Sender (Resend)
 *
 * Wraps Resend instantiation and env-var reads so server actions
 * don't duplicate the same boilerplate.
 *
 * Usage:
 *   import { sendNotificationEmail } from "@/shared/lib/email";
 *   await sendNotificationEmail({ label: "Leads", subject, html });
 * ───────────────────────────────────────────────────────────────────── */

import "server-only";

import { Resend } from "resend";
import { SITE_NAME } from "@/shared/lib/config";
import { logWarn, logError } from "@/shared/lib/logger";

// ── HTML escaper — prevents XSS when interpolating user data into email HTML ──

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape HTML-significant characters in untrusted strings. */
export function escapeHtml(unsafe: string): string {
  return unsafe.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch] ?? ch);
}

interface SendEmailOptions {
  /** Display label after the site name, e.g. "Leads" → "PT Alfa Beauty Cosmetica Leads" */
  label: string;
  /** Email subject line */
  subject: string;
  /** HTML body */
  html: string;
}

/**
 * Send an internal notification email via Resend.
 * No-ops gracefully if `RESEND_API_KEY` is not set (dev environment).
 * Never throws — logs errors and returns silently.
 */
// ── Lazy-cached Resend client (one instance per cold start) ──

let _resend: Resend | null = null;
function getResendClient(apiKey: string): Resend {
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

export async function sendNotificationEmail({
  label,
  subject,
  html,
}: SendEmailOptions): Promise<void> {
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail =
      process.env.LEAD_NOTIFICATION_EMAIL ?? "alfabeautycosmeticaa@gmail.com";
    const fromEmail =
      process.env.LEAD_FROM_EMAIL ?? "leads@alfabeauty.co.id";

    if (!resendKey) {
      logWarn("email", `RESEND_API_KEY not set — ${label} email notification skipped`);
      return;
    }

    const resend = getResendClient(resendKey);
    await resend.emails.send({
      from: `${SITE_NAME} ${label} <${fromEmail}>`,
      to: toEmail,
      subject,
      html,
    });
  } catch (err) {
    logError("email", `${label} notification error`, err);
  }
}
