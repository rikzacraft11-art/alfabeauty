/* ─────────────────────────────────────────────────────────────────────
 * Lead Form Validation Schema (Zod)
 *
 * Single source of truth for both client-side and server-side
 * validation. Aligned with paket-a.md §5 (Partner profiling spec).
 *
 * Schema fields:
 *   Required: business_name, contact_name, phone_whatsapp, city,
 *             salon_type (enum), consent
 *   Optional: email, chair_count, specialization, current_brands_used,
 *             monthly_spend_range, message
 *   Anti-spam: company (honeypot)
 * ───────────────────────────────────────────────────────────────────── */

import { z } from "zod";
import { normalizePhone, flattenErrors } from "./validation-utils";

// Re-export flattenErrors for consumers that already depend on lead.ts
export { flattenErrors };

// ── Enums ──

export const SALON_TYPES = [
  "SALON",
  "BARBER",
  "BRIDAL",
  "UNISEX",
  "OTHER",
] as const;

export const SPEND_RANGES = [
  "under-3jt",
  "3-5jt",
  "5-10jt",
  "10-25jt",
  "above-25jt",
] as const;

// ── Schema ──

export const leadSchema = z.object({
  // Required
  business_name: z
    .string()
    .trim()
    .min(1, "Business name is required")
    .max(200, "Business name is too long"),
  contact_name: z
    .string()
    .trim()
    .min(1, "Contact name is required")
    .max(200, "Contact name is too long"),
  phone_whatsapp: z
    .string()
    .trim()
    .min(1, "WhatsApp number is required")
    .refine(
      (val) => /^[+]?[0-9]{8,15}$/.test(val.replace(/[\s\-()]/g, "")),
      "Please enter a valid phone number (e.g. +628xxx or 08xxx)"
    )
    .transform(normalizePhone),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City name is too long"),
  salon_type: z.enum(SALON_TYPES, {
    error: "Please select your business type",
  }),
  consent: z.literal(true, {
    error: "You must agree to be contacted to submit this form",
  }),

  // Optional
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .optional()
    .or(z.literal("")),
  chair_count: z.coerce
    .number()
    .int()
    .positive()
    .max(9999)
    .optional()
    .or(z.literal("")),
  specialization: z
    .string()
    .trim()
    .max(500, "Specialization is too long")
    .optional()
    .or(z.literal("")),
  current_brands_used: z
    .string()
    .trim()
    .max(500, "Too long")
    .optional()
    .or(z.literal("")),
  monthly_spend_range: z
    .enum(SPEND_RANGES)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "Message is too long")
    .optional()
    .or(z.literal("")),

  // Tracking
  page_url_initial: z.string().url().optional().or(z.literal("")),
  page_url_current: z.string().url().optional().or(z.literal("")),

  // Anti-spam honeypot
  company: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
