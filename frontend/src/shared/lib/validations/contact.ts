/* ─────────────────────────────────────────────────────────────────────
 * Contact Form Validation Schema (Zod)
 *
 * Single source of truth for both client-side and server-side
 * validation of the general-inquiry contact form (/contact).
 *
 * Schema fields:
 *   Required: name, email, subject (enum), message, consent
 *   Optional: phone
 *   Anti-spam: company (honeypot)
 * ───────────────────────────────────────────────────────────────────── */

import { z } from "zod";
import { normalizePhone } from "./validation-utils";

// ── Subject options ──

export const CONTACT_SUBJECTS = [
  "product-inquiry",
  "partnership",
  "training",
  "technical-support",
  "general",
  "other",
] as const;

// ── Schema ──

export const contactSchema = z.object({
  // Required
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
  subject: z.enum(CONTACT_SUBJECTS, {
    error: "Please select a subject",
  }),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
  consent: z.literal(true, {
    error: "You must agree to be contacted to submit this form",
  }),

  // Optional
  phone: z
    .string()
    .trim()
    .refine(
      (val) =>
        val === "" ||
        /^[+]?[0-9]{8,15}$/.test(val.replace(/[\s\-()]/g, "")),
      "Please enter a valid phone number (e.g. +628xxx or 08xxx)"
    )
    .transform((val) => (val ? normalizePhone(val) : ""))
    .optional()
    .or(z.literal("")),

  // Anti-spam honeypot
  company: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
