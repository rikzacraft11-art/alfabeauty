/* ─────────────────────────────────────────────────────────────────────
 * Rate Limiter — In-memory Sliding Window
 *
 * Shared rate-limiting utility for server actions.
 * Prevents abuse via an IP-based sliding window counter.
 *
 * Usage:
 *   import { isRateLimited } from "@/shared/lib/rate-limit";
 *   if (isRateLimited(ip)) return errorResponse;
 * ───────────────────────────────────────────────────────────────────── */

import "server-only";

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5; // max 5 submissions per window per IP
const ipTimestamps = new Map<string, number[]>();

/** Returns `true` if the given IP has exceeded the rate limit. */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipTimestamps.get(ip) ?? [];
  const valid = timestamps.filter((t) => now - t < WINDOW_MS);

  if (valid.length >= MAX_REQUESTS) {
    ipTimestamps.set(ip, valid);
    return true;
  }

  valid.push(now);
  ipTimestamps.set(ip, valid);
  return false;
}

// ── Periodic cleanup to prevent memory leak (every 5 min) ──

if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 5 * 60_000;
  const cleanupKey = "__rateLimitCleanup";
  if (!(globalThis as Record<string, unknown>)[cleanupKey]) {
    (globalThis as Record<string, unknown>)[cleanupKey] = setInterval(() => {
      const now = Date.now();
      for (const [ip, timestamps] of ipTimestamps) {
        const valid = timestamps.filter((t) => now - t < WINDOW_MS);
        if (valid.length === 0) ipTimestamps.delete(ip);
        else ipTimestamps.set(ip, valid);
      }
    }, CLEANUP_INTERVAL);
  }
}
