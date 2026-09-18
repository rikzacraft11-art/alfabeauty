/* ─────────────────────────────────────────────────────────────────────
 * API Route — CSV Export for Lead Data
 *
 * GET /api/leads/export?token=<CSV_EXPORT_TOKEN>
 *
 * Protected by a simple bearer token (CSV_EXPORT_TOKEN env var).
 * Returns all leads from Supabase as a downloadable CSV file.
 *
 * paket-a.md §4 IDD: "export CSV untuk Owner/PIC"
 * UAT-12: Owner/PIC dapat mengunduh data lead sebagai file CSV
 *
 * Security:
 *   - Token-based access (no complex admin dashboard per SEC-04)
 *   - Content-Type: text/csv
 *   - X-Content-Type-Options: nosniff
 *   - Cache-Control: no-store
 * ───────────────────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/shared/lib/supabase";
import { timingSafeEqual } from "crypto";
import { HTTP_NO_STORE_HEADERS } from "@/shared/lib/config";
import { logError } from "@/shared/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CSV_COLUMNS = [
  "id",
  "created_at",
  "business_name",
  "contact_name",
  "phone_whatsapp",
  "email",
  "city",
  "salon_type",
  "chair_count",
  "specialization",
  "current_brands_used",
  "monthly_spend_range",
  "message",
  "consent",
  "page_url_initial",
  "page_url_current",
  "ip_address",
] as const;

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return "";
  let str = String(value);
  // Security: Prevent CSV Formula Injection (OWASP: '=', '+', '-', '@', '\t', '\r')
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return request.nextUrl.searchParams.get("token");
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // ── Auth check: Support both Bearer header and query param ──
  const token = extractToken(request);
  const expectedToken = process.env.CSV_EXPORT_TOKEN;

  if (!expectedToken || !token || token.length !== expectedToken.length) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: HTTP_NO_STORE_HEADERS }
    );
  }

  if (
    !timingSafeEqual(
      Buffer.from(token, "utf-8"),
      Buffer.from(expectedToken, "utf-8")
    )
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: HTTP_NO_STORE_HEADERS }
    );
  }

  try {
    // ── Fetch leads ──
    const supabase = getSupabaseAdmin();
    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logError("csv-export", "Supabase fetch error", error);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500, headers: HTTP_NO_STORE_HEADERS }
      );
    }

    // ── Build CSV with UTF-8 BOM for Microsoft Excel compatibility ──
    const header = CSV_COLUMNS.join(",");
    const rows = (leads ?? []).map((lead) =>
      CSV_COLUMNS.map((col) => escapeCSV(lead[col])).join(",")
    );
    const csv = "\uFEFF" + [header, ...rows].join("\n");

    // ── Response ──
    const filename = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        ...HTTP_NO_STORE_HEADERS,
      },
    });
  } catch (err) {
    logError("csv-export", "Unexpected error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: HTTP_NO_STORE_HEADERS }
    );
  }
}
