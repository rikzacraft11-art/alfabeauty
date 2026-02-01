import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";

import { logger } from "@/lib/logger";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { rateLimitAsync } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Health Check Endpoint (ITIL Operation)
 * 
 * OWASP A05:2021 / ISO 27001 A.5/A.8 Compliance:
 * - Public: Returns minimal 200 OK (no infrastructure details)
 * - Deep: Requires HEALTH_CHECK_TOKEN, returns DB/service status
 * 
 * Usage:
 * - GET /api/health → 200 { status: "ok" }
 * - GET /api/health?deep=true + Authorization: Bearer <token> → full status
 */
export async function GET(request: NextRequest) {
    const ip = (await headers()).get("x-forwarded-for") || "unknown";

    // Rate Limiter (OWASP API4:2023): Distributed via Upstash, fallback memory
    const limiter = await rateLimitAsync(ip, { limit: 100, windowMs: 60000 });
    if (!limiter.success) {
        return NextResponse.json(
            { error: "rate_limited" },
            {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": limiter.limit.toString(),
                    "X-RateLimit-Remaining": limiter.remaining.toString(),
                    "X-RateLimit-Reset": limiter.reset,
                    "Retry-After": String(Math.ceil((new Date(limiter.reset).getTime() - Date.now()) / 1000)),
                },
            }
        );
    }

    const timestamp = new Date().toISOString();
    const isDeepCheck = request.nextUrl.searchParams.get("deep") === "true";

    // === Public Health Check (Minimal) ===
    // OWASP: Do not expose infrastructure details publicly
    if (!isDeepCheck) {
        return NextResponse.json({
            status: "ok",
            timestamp
        }, { status: 200 });
    }

    // === Deep Health Check (Auth Required) ===
    // ISO 27001 A.9: Access control for operational endpoints
    const authHeader = request.headers.get("authorization");
    const token = process.env.HEALTH_CHECK_TOKEN;

    if (!token) {
        logger.warn("[health] Deep check requested but HEALTH_CHECK_TOKEN not configured");
        // Generic error - don't reveal configuration details
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    // SECURITY: Constant-time comparison to prevent timing attacks (OWASP)
    const isValidToken = (() => {
        if (!authHeader?.startsWith("Bearer ")) return false;
        const providedToken = authHeader.slice(7);
        if (providedToken.length !== token.length) return false;

        // Constant-time comparison using XOR
        let result = 0;
        for (let i = 0; i < token.length; i++) {
            result |= token.charCodeAt(i) ^ providedToken.charCodeAt(i);
        }
        return result === 0;
    })();

    if (!isValidToken) {
        logger.warn("[health] Unauthorized deep check attempt", { ip });
        // Generic error - don't reveal what's wrong
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Log authorized deep check access (COBIT audit trail)
    logger.info("[health] Deep check authorized", { ip });

    // 1. Check Configuration
    if (!isSupabaseConfigured()) {
        return NextResponse.json({
            status: "degraded",
            services: { database: "unconfigured" },
            timestamp
        }, { status: 200 });
    }

    try {
        // 2. Deep Ping (HEAD request to leads table)
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
            version: "4.3.0"
        }, { status: 200 });

    } catch (err) {
        logger.error("[health] DB Check Failed", { error: err });
        return NextResponse.json({
            status: "unhealthy",
            services: { database: "disconnected" },
            timestamp
        }, { status: 503 });
    }
}
