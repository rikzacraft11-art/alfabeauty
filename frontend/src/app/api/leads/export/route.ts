import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Lead Export API (CSV)
 * 
 * GET /api/leads/export
 * 
 * Requires admin authentication via X-Admin-Token header.
 * Returns leads as CSV file.
 * 
 * See Paket A UAT-12: Owner/PIC dapat mengunduh data lead sebagai file CSV
 */

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const ADMIN_TOKEN = env.LEAD_API_ADMIN_TOKEN || "";
const EXPORT_LIMIT = 1000; // Pagination limit to prevent timeout

export async function GET(req: Request) {
    // Validate admin token - MUST be non-empty and match
    const token =
        req.headers.get("x-admin-token") ||
        req.headers.get("authorization")?.replace("Bearer ", "");

    // Security: Require ADMIN_TOKEN to be configured AND non-empty
    if (!ADMIN_TOKEN || ADMIN_TOKEN.length < 8) {
        logger.error("[leads/export] LEAD_API_ADMIN_TOKEN not configured or too short");
        return NextResponse.json(
            { error: "service_not_configured" },
            { status: 503, headers: { "Cache-Control": "no-store" } }
        );
    }

    if (!token || token !== ADMIN_TOKEN) {
        return NextResponse.json(
            { error: "unauthorized" },
            { status: 401, headers: { "Cache-Control": "no-store" } }
        );
    }

    try {
        // Fetch leads with pagination to prevent timeout
        const { data, error } = await supabaseAdmin()
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(EXPORT_LIMIT);

        if (error) {
            logger.error("[leads/export] Supabase error", { error });
            return NextResponse.json(
                { error: "fetch_failed" },
                { status: 500, headers: { "Cache-Control": "no-store" } }
            );
        }

        // Convert to CSV
        const csv = convertToCSV(data || []);

        // Return as downloadable CSV
        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="leads-export-${getDateString()}.csv"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "internal_error";
        logger.error("[leads/export] Handler error", { error: msg });
        return NextResponse.json(
            { error: "internal_error" },
            { status: 500, headers: { "Cache-Control": "no-store" } }
        );
    }
}

/**
 * Convert array of leads to CSV string
 */
function convertToCSV(leads: Record<string, unknown>[]): string {
    if (leads.length === 0) {
        return "id,name,phone,email,message,ip_address,created_at\n";
    }

    // Define columns to export
    const columns = [
        "id",
        "created_at",
        "name",
        "phone",
        "email",
        "message",
        // Partner Profiling Fields (extracted from raw)
        "business_name",
        "salon_type",
        "chair_count",
        "specialization",
        "current_brands_used",
        "monthly_spend_range",
        "city",
        // Tech info
        "ip_address",
        "page_url_current",
    ];

    // Header row
    const header = columns.join(",");

    // Data rows
    const rows = leads.map((lead) => {
        const raw = lead.raw as Record<string, unknown> || {};

        return columns
            .map((col) => {
                // Check top-level first, then raw
                let value = lead[col];

                // If not found in top-level, check raw for specific partner fields
                if (value === undefined && col in raw) {
                    value = raw[col];
                }

                if (value === null || value === undefined) return "";

                // Escape quotes and wrap in quotes if contains comma or quote
                const str = String(value);
                if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            })
            .join(",");
    });

    return [header, ...rows].join("\n");
}

/**
 * Get current date as string for filename
 */
function getDateString(): string {
    const now = new Date();
    return now.toISOString().split("T")[0] ?? new Date().toISOString();
}
