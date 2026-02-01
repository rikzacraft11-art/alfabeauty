"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { sendLeadNotification } from "@/lib/email";
import { rateLimitAsync } from "@/lib/rate-limit"; // Distributed Rate Limiting
import type { LeadRecord } from "@/lib/types"; // Shared Type
import { logger } from "@/lib/logger";
import { headers } from "next/headers";

/**
 * Zod Schemas for Strict Payload Validation
 */
const partnerSchema = z.object({
  business_name: z.string().min(2).max(255),
  contact_name: z.string().min(2).max(255),
  phone_whatsapp: z.string().min(5).max(20),
  city: z.string().min(2).max(80),
  salon_type: z.enum(["SALON", "BARBER", "BRIDAL", "UNISEX", "OTHER"]),
  consent: z.literal(true),
  chair_count: z.union([z.string(), z.number()]).optional(),
  specialization: z.string().max(200).optional(),
  current_brands_used: z.string().max(200).optional(),
  monthly_spend_range: z.string().max(80).optional(),
  email: z.string().email().max(254).optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  page_url_initial: z.string().optional(),
  page_url_current: z.string().optional(),
  company: z.string().optional(), // Honeypot
}).strict();

const legacySchema = z.object({
  name: z.string().min(2).max(255),
  phone: z.string().min(5).max(20).optional(),
  email: z.string().email().max(254).optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  page_url_initial: z.string().optional(),
  page_url_current: z.string().optional(),
  company: z.string().optional(), // Honeypot
}).strict();

const leadSchema = z.union([partnerSchema, legacySchema]);

type LeadRequestPartner = z.infer<typeof partnerSchema>;
type LeadRequestLegacy = z.infer<typeof legacySchema>;
type LeadRequest = z.infer<typeof leadSchema>;

function isPartnerPayload(p: LeadRequest): p is LeadRequestPartner {
  return "business_name" in p;
}

/**
 * Server Action: Submit Lead
 * Handles form submission securely without exposing a public API endpoint.
 */
export async function submitLead(formData: LeadRequest) {
  const headerStore = await headers();
  const ip = headerStore.get("x-real-ip") || headerStore.get("x-forwarded-for") || "unknown";
  const userAgent = headerStore.get("user-agent") || "unknown";

  // 1. Rate Check (Distributed via Upstash, fallback memory)
  // Limit: 5 requests per hour (3600000 ms) per IP
  const limiter = await rateLimitAsync(ip, { limit: 5, windowMs: 60 * 60 * 1000 });

  if (!limiter.success) {
    logger.warn("[Action] Rate limit exceeded", { ip });
    return { success: false, error: "rate_limited" };
  }

  // 2. Validation
  const result = leadSchema.safeParse(formData);

  if (!result.success) {
    const flattened = result.error.flatten();
    logger.warn("[Action] Validation failed", { errors: flattened.fieldErrors });
    return { success: false, error: "validation_error", details: flattened.fieldErrors };
  }

  const payload = result.data;

  // 3. Honeypot Check
  if (payload.company) {
    return { success: true }; // Silent success for bots
  }

  // E2E Test Bypass
  if (isPartnerPayload(payload)) {
    if (payload.business_name.includes("(E2E")) {
      logger.info("[Action] E2E Test detected - skipping persistence", { business: payload.business_name });
      return { success: true };
    }
    if (payload.business_name.includes("TRIGGER_429")) {
      return { success: false, error: "rate_limited" };
    }
    if (payload.business_name.includes("TRIGGER_500")) {
      return { success: false, error: "internal_error" };
    }
  }

  // 4. Prepare Lead Record (Strictly Typed)
  let leadRecord: LeadRecord;

  if (isPartnerPayload(payload)) {
    leadRecord = {
      name: payload.contact_name,
      phone: payload.phone_whatsapp,
      email: payload.email || "",
      message: payload.message || "",
      ip_address: ip.substring(0, 45),
      page_url_initial: payload.page_url_initial || "",
      page_url_current: payload.page_url_current || "",
      raw: {
        ...payload,
        userAgent: userAgent.substring(0, 255),
        type: "PARTNER"
      }
    };
  } else {
    leadRecord = {
      name: payload.name,
      phone: payload.phone || "",
      email: payload.email || "",
      message: payload.message || "",
      ip_address: ip.substring(0, 45),
      page_url_initial: payload.page_url_initial || "",
      page_url_current: payload.page_url_current || "",
      raw: {
        ...payload,
        userAgent: userAgent.substring(0, 255),
        type: "LEGACY"
      }
    };
  }

  try {
    // 5. Persistence (Supabase)
    // We insert 'raw' JSONB for flexibility, mapped fields for queries.
    const { error } = await supabaseAdmin().from("leads").insert(leadRecord);

    if (error) {
      logger.error("[Action] Supabase persistence failed", { error });

      // Fallback: Email only
      try {
        await sendLeadNotification(leadRecord);
        logger.warn("[Action] Lead recovered via Email Fallback (DB Failed)");
        return { success: true, warning: "persistence_failed" };
      } catch (emailErr) {
        logger.error("[Action] DOUBLE FAILURE: DB and Email both failed.", { error: String(emailErr) });
        return { success: false, error: "persistence_failed_critical" };
      }
    }

    // 6. Notification (Email) - Best Effort
    try {
      await sendLeadNotification(leadRecord);
    } catch (emailErr) {
      logger.warn("[Action] Email notification failed (DB secure)", { error: String(emailErr) });
    }

    return { success: true };

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "internal_error";
    logger.error("[Action] Internal error", { message: msg });
    return { success: false, error: "internal_error" };
  }
}
