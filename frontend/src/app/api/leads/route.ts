import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendLeadNotification, type LeadRecord } from "@/lib/email";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * Simple in-memory rate limiter (fallback)
 * Note: This is not persistent across serverless instances.
 * For production at scale, use Upstash/Vercel KV.
 * Limits: 5 requests per minute per IP
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

/**
 * Idempotency cache (in-memory fallback)
 * Stores processed idempotency keys to prevent duplicate submissions
 */
const idempotencyCache = new Map<string, { processedAt: number; result: unknown }>();
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * CAPTCHA Validation (Stub)
 * Replace with Cloudflare Turnstile or Google reCAPTCHA
 */
async function validateCaptcha(_token: string): Promise<boolean> {
  // TODO: Implement real validation against provider API
  // const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', ...)
  return true; // fail-open for now
}

/**
 * Rate Limit Service (Abstract)
 * Currently uses In-Memory Map.
 * CRITICAL: Swap this for Redis (Upstash) in production to handle distributed scale.
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  // TODO: Insert Redis Logic Here
  // await redis.incr(`rate_limit:${ip}`)

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limited
  }

  record.count++;
  return true;
}

/**
 * Check idempotency - return cached result if key was already processed
 */
function checkIdempotency(key: string | null): { cached: boolean; result?: unknown } {
  if (!key) return { cached: false };

  const now = Date.now();
  const record = idempotencyCache.get(key);

  if (record && now - record.processedAt < IDEMPOTENCY_TTL_MS) {
    return { cached: true, result: record.result };
  }

  return { cached: false };
}

/**
 * Store idempotency result
 */
function storeIdempotency(key: string | null, result: unknown): void {
  if (!key) return;
  idempotencyCache.set(key, { processedAt: Date.now(), result });
}

import { z } from "zod";

/**
 * Zod Schemas for Strict Payload Validation (Phase 23)
 * Replaces manual if/else checks with robust schema parsing.
 */
const partnerSchema = z.object({
  business_name: z.string().min(2).max(255),
  contact_name: z.string().min(2).max(255),
  phone_whatsapp: z.string().min(5).max(20),
  city: z.string().min(2).max(80),
  salon_type: z.enum(["SALON", "BARBER", "BRIDAL", "UNISEX", "OTHER"]),
  consent: z.literal(true), // Must be true
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

export async function POST(req: Request) {
  // Get IP for rate limiting
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  // Rate limit check
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    logger.warn("[leads] Rate limit exceeded", { ip: ip.substring(0, 20) });
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "60" } }
    );
  }

  // Idempotency check
  const idempotencyKey = req.headers.get("idempotency-key");
  const idempotencyResult = checkIdempotency(idempotencyKey);
  if (idempotencyResult.cached) {
    return NextResponse.json(
      idempotencyResult.result,
      { status: 202, headers: { "Cache-Control": "no-store", "X-Idempotent-Replay": "true" } }
    );
  }

  // Content-Type Check
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      { error: "content_type_must_be_application_json" },
      { status: 415, headers: { "Cache-Control": "no-store" } }
    );
  }

  let payload: z.infer<typeof leadSchema>;

  try {
    const json = await req.json();
    const result = leadSchema.safeParse(json);

    if (!result.success) {
      const flattened = result.error.flatten();
      logger.warn("Validation failed", { errors: flattened.fieldErrors });
      return NextResponse.json(
        { error: "validation_error", details: flattened.fieldErrors },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }
    payload = result.data;
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Anti-spam: Honeypot check
  if (payload.company) {
    return NextResponse.json(
      { status: "ok" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Determine payload type safely
  const ua = req.headers.get("user-agent") || "";
  const dbRecord: Record<string, unknown> = {
    ip_address: ip.substring(0, 45),
    user_agent: ua.substring(0, 255),
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
    // Legacy
    dbRecord.name = payload.name;
    dbRecord.phone = payload.phone || "";
    dbRecord.email = payload.email || "";
    dbRecord.message = payload.message || "";
    dbRecord.page_url_initial = payload.page_url_initial || "";
    dbRecord.page_url_current = payload.page_url_current || "";
  }

  try {
    const { error } = await supabaseAdmin().from("leads").insert(dbRecord);

    if (error) {
      logger.error("Supabase persistence failed", { error });

      // TOGAF Business Continuity: Fallback to Email-Only mode.
      // If DB fails, we MUST try to send the email to avoid losing the lead.
      try {
        await sendLeadNotification(dbRecord as unknown as LeadRecord);
        logger.warn("Lead recovered via Email Fallback (DB Failed)", { lead_name_hash: "SHA256(REDACTED)" });

        return NextResponse.json(
          { status: "accepted_fallback", warning: "persistence_failed" },
          { status: 202, headers: { "Cache-Control": "no-store" } }
        );
      } catch (emailErr) {
        // Both Failed - Catastrophic
        logger.error("DOUBLE FAILURE: DB and Email both failed. Lead Lost.", { error: String(emailErr) });
        return NextResponse.json(
          { error: "persistence_failed_critical" },
          { status: 500, headers: { "Cache-Control": "no-store" } }
        );
      }
    }

    // Success Path: DB Saved. Now send email best-effort.
    try {
      await sendLeadNotification(dbRecord as unknown as LeadRecord);
    } catch (emailErr) {
      logger.warn("Email notification failed (DB secure)", { error: String(emailErr) });
    }

    // Store idempotency result for future duplicate requests
    const successResult = { status: "accepted" };
    storeIdempotency(idempotencyKey, successResult);

    return NextResponse.json(
      successResult,
      { status: 202, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "internal_error";
    logger.error("Handler internal error", { message: msg });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
