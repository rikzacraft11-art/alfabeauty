/* ─────────────────────────────────────────────────────────────────────
 * Server Action — Submit Contact (General Inquiry)
 *
 * Pipeline:
 *   1. Rate-limit (in-memory sliding window)
 *   2. Anti-spam: honeypot check
 *   3. Server-side Zod validation
 *   4. Persist to Supabase (`contacts` table)
 *   5. Send email notification to internal inbox (Resend)
 *   6. Return success/error to client
 * ───────────────────────────────────────────────────────────────────── */

"use server";

import { headers } from "next/headers";
import { contactSchema, type ContactFormData } from "@/shared/lib/validations/contact";
import { flattenErrors } from "@/shared/lib/validations/validation-utils";
import { getSupabaseAdmin } from "@/shared/lib/supabase";
import { isRateLimited } from "@/shared/lib/rate-limit";
import { sendNotificationEmail, escapeHtml } from "@/shared/lib/email";
import { SITE_NAME } from "@/shared/lib/config";
import { logError } from "@/shared/lib/logger";

// ── Types ──

export type SubmitContactResult =
  | { success: true }
  | { success: false; errors: Record<string, string> }
  | { success: false; error: string };

// ── Main Action ──

export async function submitContact(
  formData: Record<string, unknown>
): Promise<SubmitContactResult> {
  try {
    // 1. Rate limit
    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return {
        success: false,
        error:
          "Too many submissions. Please wait a moment before trying again.",
      };
    }

    // 2. Honeypot
    if (formData.company && String(formData.company).length > 0) {
      return { success: true };
    }

    // 3. Validation
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      return { success: false, errors: flattenErrors(result) };
    }

    const data = result.data;

    // 4. Persist to Supabase
    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase.from("contacts").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      consent: data.consent,
      ip_address: ip !== "unknown" ? ip : null,
    });

    if (dbError) {
      logError("contact-pipeline", "Supabase insert error", dbError);
      return {
        success: false,
        error:
          "We couldn't process your message right now. Please try again or contact us via WhatsApp.",
      };
    }

    // 5. Email notification (non-blocking)
    await sendNotificationEmail({
      label: "Contact",
      subject: `New Contact Inquiry: ${data.subject} — ${data.name}`,
      html: buildEmailHtml(data),
    });

    return { success: true };
  } catch (err) {
    logError("contact-pipeline", "Unexpected error", err);
    return {
      success: false,
      error:
        "An unexpected error occurred. Please try again or contact us via WhatsApp.",
    };
  }
}

// ── Email Template ──

function buildEmailHtml(data: ContactFormData): string {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Subject", data.subject],
    ["Message", data.message],
  ] as const;

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #a4161a; margin-bottom: 24px;">
        New Contact Inquiry
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr style="border-bottom: 1px solid #e8e4df;">
            <td style="padding: 10px 12px; font-weight: 600; color: #333; width: 120px; vertical-align: top;">
              ${label}
            </td>
            <td style="padding: 10px 12px; color: #333;">
              ${escapeHtml(String(value ?? "—"))}
            </td>
          </tr>`
          )
          .join("")}
      </table>
      <p style="margin-top: 24px; font-size: 12px; color: #9b9b9b;">
        This inquiry was submitted via the ${SITE_NAME} website.
      </p>
    </div>
  `;
}
