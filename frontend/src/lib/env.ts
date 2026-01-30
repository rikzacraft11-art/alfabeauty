import { z } from "zod";

const envSchema = z.object({
    // Core
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    // Vercel / Core
    // Vercel auto-sets NEXT_PUBLIC_VERCEL_URL. We prefer NEXT_PUBLIC_SITE_URL if set (Canonical).
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(), // Vercel Preview URL (no protocol)

    // Supabase (Service Role is optional for client, mandatory for admin)
    NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

    // Email (SMTP) - Optional (Fail-Open)
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().optional(),
    SMTP_TO: z.string().optional(),

    // Features / Security
    // COBIT DSS05.04: Admin Token must be strong (min 12 chars) if configured
    LEAD_API_ADMIN_TOKEN: z.string().min(12, "Admin token must be at least 12 characters").optional(),
    NEXT_PUBLIC_GA_ID: z.string().optional(),

    // ITIL 4: Service Management
    MAINTENANCE_MODE: z.enum(["true", "false"]).optional(),

    // ITIL 4: Design V2 Gradual Rollout (OPS-06)
    // Set to "true" to enable V2 design for all users
    // Set to "percentage:XX" for A/B testing (e.g., "percentage:20" = 20% users)
    ENABLE_V2_DESIGN: z.string().optional(),

    // Contact / Business (Critical B2B)
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional(),
    NEXT_PUBLIC_WHATSAPP_PREFILL: z.string().optional(),
    NEXT_PUBLIC_FALLBACK_EMAIL: z.string().email().optional(),

    // Observability (OPS-01 ITIL4)
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

// Parse and validate process.env
// In Next.js, process.env contains all loaded env vars.
// We use safeParse to avoid crashing the build if some non-critical vars are missing,
// but for critical ones (like SITE_URL), we want to know.
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables");
}

// TOGAF: Dynamic Environment Resolution
// Vercel previews don't have SITE_URL set, but provide VERCEL_URL (without https://)
const raw = _env.data;
const siteUrl = raw.NEXT_PUBLIC_SITE_URL ??
    (raw.NEXT_PUBLIC_VERCEL_URL ? `https://${raw.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000");

export const env = {
    ...raw,
    NEXT_PUBLIC_SITE_URL: siteUrl
};
