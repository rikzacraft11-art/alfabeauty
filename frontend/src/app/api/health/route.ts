import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { logger } from "@/lib/logger";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";


export const runtime = "nodejs";

/**
 * Health Check Endpoint (ITIL Operation)
 * Performs a DEEP check against the database to ensure actual availability.
 */
export async function GET() {
    const ip = (await headers()).get("x-forwarded-for") || "unknown";

    // Rate Limiter (COBIT Security): Prevent DoS on this deep-check endpoint
    // Strategy: 100 requests per minute per IP.
    const limiter = rateLimit(ip, { limit: 100, windowMs: 60000 });

    if (!limiter.success) {
        return rateLimitResponse(limiter);
    }

    const timestamp = new Date().toISOString();

    // 1. Check Configuration
    if (!isSupabaseConfigured()) {
        return NextResponse.json({
            status: "degraded",
            message: "Database unconfigured",
            timestamp
        }, { status: 200 }); // Still 200 because the app might work statically
    }

    try {
        // 2. Check Verification (Deep Ping)
        // HEAD request to 'leads' table (lightweight)
        const { error } = await supabaseAdmin()
            .from("leads")
            .select("*", { count: "exact", head: true });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            status: "healthy",
            services: {
                database: "connected",
                admin_api: "ready"
            },
            timestamp,
            version: "4.1.0"
        }, { status: 200 });

    } catch (err) {
        logger.error("[health] DB Check Failed", { error: err });
        return NextResponse.json({
            status: "unhealthy",
            services: {
                database: "disconnected"
            },
            timestamp
        }, { status: 503 }); // ITIL: Service Unavailable
    }
}
