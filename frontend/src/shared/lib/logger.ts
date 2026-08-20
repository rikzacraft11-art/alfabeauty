/* ─────────────────────────────────────────────────────────────────────
 * Logger — Structured Server-Side Logging
 *
 * Wraps console.warn/error so log output is structured and can be
 * silenced or routed in production (e.g. Vercel Functions logging).
 *
 * All server actions and API routes should use this instead of raw
 * console.error / console.warn.
 * ───────────────────────────────────────────────────────────────────── */

import "server-only";

const IS_PROD = process.env.NODE_ENV === "production";

export function logWarn(tag: string, message: string, meta?: unknown): void {
  if (IS_PROD) {
    // Structured JSON for Vercel log drain / observability
    console.warn(JSON.stringify({ level: "warn", tag, message, meta }));
  } else {
    console.warn(`[${tag}] ${message}`, meta ?? "");
  }
}

export function logError(tag: string, message: string, meta?: unknown): void {
  if (IS_PROD) {
    console.error(JSON.stringify({ level: "error", tag, message, meta }));
  } else {
    console.error(`[${tag}] ${message}`, meta ?? "");
  }
}
