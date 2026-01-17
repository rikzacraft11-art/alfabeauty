import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Lead API (Option B) accepts the Partner Profiling payload (preferred) and a
 * limited legacy shape (for transition). This route is a thin proxy; validation
 * lives in the Lead API.
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

export async function POST(req: Request) {
  const baseUrl = process.env.LEAD_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "lead_api_not_configured" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const ct = req.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      { error: "content_type_must_be_application_json" },
      { status: 415, headers: { "Cache-Control": "no-store" } },
    );
  }

  let payload: LeadRequest;
  try {
    const parsed: unknown = await req.json();
    if (!isPlainObject(parsed)) {
      return NextResponse.json(
        { error: "invalid_json" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    payload = parsed as LeadRequest;
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Forward to Lead API Option B.
  const url = `${baseUrl.replace(/\/$/, "")}/api/v1/leads`;
  const idempotencyKey = req.headers.get("Idempotency-Key") || randomUUID();

  // Forward selected client context headers so the Lead API can:
  // - capture meaningful user agent
  // - apply rate limiting / IP signals correctly when TRUSTED_PROXIES is configured
  const ua = req.headers.get("user-agent");
  const xff = req.headers.get("x-forwarded-for");
  const xri = req.headers.get("x-real-ip");

  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
      ...(ua ? { "User-Agent": ua } : {}),
      ...(xff ? { "X-Forwarded-For": xff } : {}),
      ...(xri ? { "X-Real-IP": xri } : {}),
    },
    body: JSON.stringify(payload),
    // Keep a reasonable timeout so UI can show actionable feedback.
    signal: AbortSignal.timeout(8000),
  }).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : "upstream_error";
    // Log error for server-side observability
    console.error("[leads] upstream error:", msg);
    return new Response(JSON.stringify({ error: "lead_api_unreachable", detail: msg }), {
      status: 502,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  });

  // Pass through status + JSON body, but always no-store.
  const text = await upstream.text();
  const contentType = upstream.headers.get("Content-Type") ?? "application/json; charset=utf-8";

  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
