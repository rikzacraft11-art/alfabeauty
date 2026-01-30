import { NextResponse } from "next/server";

interface RateLimitConfig {
    limit: number;
    windowMs: number;
}

declare global {
    // eslint-disable-next-line no-unused-vars
    var rateLimitMap: Map<string, { count: number; expires: number }> | undefined;
}

/**
 * Rate Limiter (Token Bucket Strategy)
 * ITIL 4: Capacity Management
 * COBIT: DSS05.10 Network Security
 * 
 * Uses in-memory storage. Note: In serverless (Vercel), memory is not shared 
 * across isolates, so this is "per lambda" limiting. For strict global limiting,
 * use Redis/Upstash (Task 14 Future). This is a sufficient "Level 1" guard.
 */
export function rateLimit(ip: string, config: RateLimitConfig = { limit: 100, windowMs: 60000 }) {
    if (!globalThis.rateLimitMap) {
        globalThis.rateLimitMap = new Map();
    }

    const { limit, windowMs } = config;
    const now = Date.now();

    // Cleanup: Prevent memory leaks (ITIL stability)
    if (globalThis.rateLimitMap.size > 10000) {
        globalThis.rateLimitMap.clear();
    }

    const record = globalThis.rateLimitMap.get(ip) || { count: 0, expires: now + windowMs };

    // Reset if window expired
    if (now > record.expires) {
        record.count = 0;
        record.expires = now + windowMs;
    }

    record.count++;
    globalThis.rateLimitMap.set(ip, record);

    const remaining = Math.max(0, limit - record.count);
    const reset = new Date(record.expires).toUTCString();

    return {
        success: record.count <= limit,
        limit,
        remaining,
        reset,
    };
}

/**
 * Helper to generate 429 response
 */
export function rateLimitResponse(result: { limit: number; remaining: number; reset: string }) {
    return NextResponse.json(
        {
            success: false,
            error: {
                code: "RATE_LIMIT_EXCEEDED",
                message: "Too many requests, please try again later.",
            },
        },
        {
            status: 429,
            headers: {
                "X-RateLimit-Limit": result.limit.toString(),
                "X-RateLimit-Remaining": result.remaining.toString(),
                "X-RateLimit-Reset": result.reset,
                // RFC 7231: Can be HTTP Date or Seconds. Switched to Seconds for easier client consumption.
                "Retry-After": String(Math.ceil((new Date(result.reset).getTime() - Date.now()) / 1000)),
            },
        }
    );
}
