"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { sendLeadNotification, type LeadRecord } from "@/lib/email";
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

  // Rate Limiter Strategy (In-Memory Token Bucket Lite)
  // Prevents spam while avoiding external dependencies like Redis for this scale.
  const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 Hour
  const RATE_LIMIT_MAX = 5; // 5 submissions per IP per hour

  class RateLimiter {
    private hits = new Map<string, { count: number; expires: number }>();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
      // Auto-cleanup every hour to prevent memory leaks
      this.cleanupInterval = setInterval(() => this.cleanup(), RATE_LIMIT_WINDOW);
    }

    check(ip: string): boolean {
      const now = Date.now();
      const record = this.hits.get(ip);

      if (record) {
        if (now > record.expires) {
          // Expired, reset
          this.hits.set(ip, { count: 1, expires: now + RATE_LIMIT_WINDOW });
          return true;
        }
        if (record.count >= RATE_LIMIT_MAX) {
          return false; // Limit exceeded
        }
        // Increment
        record.count++;
        return true;
      }

      // New IP
      this.hits.set(ip, { count: 1, expires: now + RATE_LIMIT_WINDOW });
      return true;
    }

    private cleanup() {
      const now = Date.now();
      for (const [ip, record] of this.hits.entries()) {
        if (now > record.expires) {
          this.hits.delete(ip);
        }
      }
    }
  }

  // Singleton instance
  const limiter = new RateLimiter();

  // ... inside submitLead function ...
  // check(ip) implementation follows

  // 1. Rate Check
  if (!limiter.check(ip)) {
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

  // 2. Honeypot Check
  if (payload.company) {
    return { success: true }; // Silent success for bots
  }

  // 3. Prepare DB Record
  const dbRecord: Record<string, unknown> = {
    ip_address: ip.substring(0, 45),
    user_agent: userAgent.substring(0, 255),
    raw: payload,
  };

  if (isPartnerPayload(payload)) {
    dbRecord.name = payload.contact_name;
    dbRecord.phone = payload.phone_whatsapp;
    dbRecord.email = payload.email || "";
    dbRecord.message = payload.message || "";
    dbRecord.page_url_initial = payload.page_url_initial || "";
    dbRecord.page_url_current = payload.page_url_current || "";
  } else {
    dbRecord.name = payload.name;
    dbRecord.phone = payload.phone || "";
    dbRecord.email = payload.email || "";
    dbRecord.message = payload.message || "";
    dbRecord.page_url_initial = payload.page_url_initial || "";
    dbRecord.page_url_current = payload.page_url_current || "";
  }

  try {
    // 4. Persistence (Supabase)
    const { error } = await supabaseAdmin().from("leads").insert(dbRecord);

    if (error) {
      logger.error("[Action] Supabase persistence failed", { error });

      // Fallback: Email only
      try {
        await sendLeadNotification(dbRecord as unknown as LeadRecord);
        logger.warn("[Action] Lead recovered via Email Fallback (DB Failed)");
        return { success: true, warning: "persistence_failed" };
      } catch (emailErr) {
        logger.error("[Action] DOUBLE FAILURE: DB and Email both failed.", { error: String(emailErr) });
        return { success: false, error: "persistence_failed_critical" };
      }
    }

    // 5. Notification (Email) - Best Effort
    try {
      await sendLeadNotification(dbRecord as unknown as LeadRecord);
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
