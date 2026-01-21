import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

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

  // Prepare DB record
  const ip =
    req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "";
  const ua = req.headers.get("user-agent") || "";

  const dbRecord: any = {
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

    // TODO: Send Email Notification (via SMTP or Supabase Edge Function)
    // For now, we rely on persistence.

    return NextResponse.json(
      { status: "ok" },
      { status: 201, headers: { "Cache-Control": "no-store" } }
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
