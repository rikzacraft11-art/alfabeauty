import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendLeadNotification, type LeadRecord } from "@/lib/email";

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

function checkRateLimit(ip: string): boolean {
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

/**
 * Lead API (Option B) accepts the Partner Profiling payload (preferred) and a
 * limited legacy shape (for transition).
 *
 * See Paket A §4 IDD for payload contract.
 */
type LeadRequestPartnerProfiling = {
  business_name: string;
  contact_name: string;
  phone_whatsapp: string;
  city: string;
  salon_type: "SALON" | "BARBER" | "BRIDAL" | "UNISEX" | "OTHER";
  consent: boolean;
  chair_count?: number;
  specialization?: string;
  current_brands_used?: string;
  monthly_spend_range?: string;

  email?: string;
  message?: string;
  page_url_initial?: string;
  page_url_current?: string;
  company?: string; // honeypot
};

type LeadRequestLegacy = {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  page_url_initial?: string;
  page_url_current?: string;
  company?: string; // honeypot
};

type LeadRequest = LeadRequestPartnerProfiling | LeadRequestLegacy;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isPartnerPayload(p: LeadRequest): p is LeadRequestPartnerProfiling {
  return "business_name" in p && "contact_name" in p;
}

export async function POST(req: Request) {
  // Get IP for rate limiting
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  // Rate limit check (§5, §9 DoD: 429 on abuse)
  if (!checkRateLimit(ip)) {
    console.warn("[leads] Rate limit exceeded for IP:", ip.substring(0, 20));
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "60",
        },
      }
    );
  }

  // Idempotency check - return cached result if already processed
  const idempotencyKey = req.headers.get("idempotency-key");
  const idempotencyResult = checkIdempotency(idempotencyKey);
  if (idempotencyResult.cached) {
    return NextResponse.json(
      idempotencyResult.result,
      { status: 202, headers: { "Cache-Control": "no-store", "X-Idempotent-Replay": "true" } }
    );
  }

  const ct = req.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      { error: "content_type_must_be_application_json" },
      { status: 415, headers: { "Cache-Control": "no-store" } }
    );
  }

  let payload: LeadRequest;
  try {
    const parsed: unknown = await req.json();
    if (!isPlainObject(parsed)) {
      throw new Error("Invalid object");
    }
    payload = parsed as LeadRequest;
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Anti-spam: Honeypot check
  if (payload.company) {
    // Silent success for bots
    return NextResponse.json(
      { status: "ok" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }

  // SEC-01 Server-side validation (Length limits)
  const MAX_TEXT_LEN = 255;
  const MAX_MSG_LEN = 2000;

  if (isPartnerPayload(payload)) {
    if (payload.business_name.length > MAX_TEXT_LEN) {
      return NextResponse.json({ error: "business_name_too_long" }, { status: 400 });
    }
    if (payload.contact_name.length > MAX_TEXT_LEN) {
      return NextResponse.json({ error: "contact_name_too_long" }, { status: 400 });
    }
  } else {
    if (payload.name.length > MAX_TEXT_LEN) {
      return NextResponse.json({ error: "name_too_long" }, { status: 400 });
    }
  }

  if (payload.message && payload.message.length > MAX_MSG_LEN) {
    return NextResponse.json({ error: "message_too_long" }, { status: 400 });
  }

  const ua = req.headers.get("user-agent") || "";

  const dbRecord: Record<string, unknown> = {
    ip_address: ip.substring(0, 45), // IPv6 max length
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
      console.error("[leads] Supabase error:", error);
      return NextResponse.json(
        { error: "persistence_failed" },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Send email notification (fail-safe: log error, don't block)
    try {
      // safe cast: we populated required fields above
      await sendLeadNotification(dbRecord as unknown as LeadRecord);
    } catch (emailErr) {
      console.error("[leads] Email notification failed:", emailErr);
      // Don't return error - lead is already saved in Supabase
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
    console.error("[leads] Handler error:", msg);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
