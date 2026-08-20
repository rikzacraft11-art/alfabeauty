/* ─────────────────────────────────────────────────────────────────────
 * Validation Utilities — Shared across lead & contact schemas
 *
 * Extracted from lead.ts to eliminate cross-domain imports.
 * Both leadSchema and contactSchema import from this file instead
 * of one importing from the other.
 * ───────────────────────────────────────────────────────────────────── */

import type { z } from "zod";

// ── Phone normalizer ──

/** Normalize WhatsApp number to E.164-like format (lenient). */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[\s\-()]/g, "");
  // Convert leading 0 to +62
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  // Ensure leading +
  if (!digits.startsWith("+")) return `+${digits}`;
  return digits;
}

// ── Error flattener ──

/**
 * Flat error map — returns { field: "error message" } for client display.
 */
export function flattenErrors(
  result: { success: false; error: z.ZodError }
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".");
    if (!map[key]) map[key] = issue.message;
  }
  return map;
}
