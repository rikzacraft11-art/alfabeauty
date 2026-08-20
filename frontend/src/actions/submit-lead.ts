/* ─────────────────────────────────────────────────────────────────────
 * Server Action — Submit Lead (Become Partner)
 *
 * Pipeline (paket-a.md §4 IDD + §5 + ADR-0001):
 *   1. Server-side Zod validation (allowlist + length limits)
 *   2. Anti-spam: honeypot check + rate-limit (in-memory sliding window)
 *   3. Persist to Supabase (source of truth)
 *   4. Send email notification to internal inbox (Resend)
 *   5. Return success/error to client
 *
 * OWASP ASVS v5.0.0 traceability:
 *   v5.0.0-V2.2.1 — Positive validation (allowlist)
 *   v5.0.0-V2.2.2 — Server-side enforcement
 *   v5.0.0-V2.4.1 — Anti-automation (rate limit + honeypot)
 * ───────────────────────────────────────────────────────────────────── */

"use server";

import { headers } from "next/headers";
import { leadSchema, flattenErrors, type LeadFormData } from "@/shared/lib/validations/lead";
import { getSupabaseAdmin } from "@/shared/lib/supabase";
import { isRateLimited } from "@/shared/lib/rate-limit";
import { sendNotificationEmail, escapeHtml } from "@/shared/lib/email";
import { SITE_NAME } from "@/shared/lib/config";
import { logError } from "@/shared/lib/logger";

// ── Types ──

export type SubmitLeadResult =
  | { success: true }
  | { success: false; errors: Record<string, string> }
  | { success: false; error: string };

// ── Main Action ──

export async function submitLead(
  formData: Record<string, unknown>
): Promise<SubmitLeadResult> {
  try {
    // 1. Rate limit check (use x-forwarded-for or fallback)
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

    // 2. Honeypot check
    if (formData.company && String(formData.company).length > 0) {
      // Silently succeed (don't reveal anti-spam to bots)
      return { success: true };
    }

    // 3. Server-side validation
    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      return { success: false, errors: flattenErrors(result) };
    }

    const data = result.data;

    // 4. Persist to Supabase
    const supabase = getSupabaseAdmin();
    const insertPayload = {
      business_name: data.business_name,
      contact_name: data.contact_name,
      phone_whatsapp: data.phone_whatsapp,
      email: data.email || null,
      city: data.city,
      salon_type: data.salon_type,
      consent: data.consent,
      chair_count:
        typeof data.chair_count === "number" ? data.chair_count : null,
      specialization: data.specialization || null,
      current_brands_used: data.current_brands_used || null,
      monthly_spend_range: data.monthly_spend_range || null,
      message: data.message || null,
      page_url_initial: data.page_url_initial || null,
      page_url_current: data.page_url_current || null,
      ip_address: ip !== "unknown" ? ip : null,
    };

    const { error: dbError } = await supabase
      .from("leads")
      .insert(insertPayload);

    if (dbError) {
      logError("lead-pipeline", "Supabase insert error", dbError);
      return {
        success: false,
        error:
          "We couldn't process your submission right now. Please try again or contact us via WhatsApp.",
      };
    }

    // 5. Email notification (non-blocking — don't fail submission if email fails)
    await sendNotificationEmail({
      label: "Leads",
      subject: `New Partnership Lead: ${data.business_name} (${data.city})`,
      html: buildEmailHtml(data),
    });

    return { success: true };
  } catch (err) {
    logError("lead-pipeline", "Unexpected error", err);
    return {
      success: false,
      error:
        "An unexpected error occurred. Please try again or contact us via WhatsApp.",
    };
  }
}

// ── Email Template ──

function buildEmailHtml(data: LeadFormData): string {
  const rows = [
    ["Business Name", data.business_name],
    ["Contact Name", data.contact_name],
    ["WhatsApp", data.phone_whatsapp],
    ["Email", data.email || "—"],
    ["City", data.city],
    ["Business Type", data.salon_type],
    ["Chairs", data.chair_count || "—"],
    ["Specialization", data.specialization || "—"],
    ["Current Brands", data.current_brands_used || "—"],
    ["Monthly Spend", data.monthly_spend_range || "—"],
    ["Message", data.message || "—"],
    ["Page (initial)", data.page_url_initial || "—"],
    ["Page (current)", data.page_url_current || "—"],
  ] as const;

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #a4161a; margin-bottom: 24px;">
        New Partnership Lead
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr style="border-bottom: 1px solid #e8e4df;">
            <td style="padding: 10px 12px; font-weight: 600; color: #333; width: 160px; vertical-align: top;">
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
        This lead was submitted via the ${SITE_NAME} website.
      </p>
    </div>
  `;
}
