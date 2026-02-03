/**
 * Sentry Server Configuration
 * OPS-01: Incident Management (ITIL4)
 * 
 * This file configures Sentry for server-side error tracking in Next.js.
 * Errors in API routes (e.g., /api/leads) will be captured here.
 */

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProd = process.env.NODE_ENV === "production";

// Avoid importing/bundling Sentry during local development to keep DX clean.
// Next may load this file by convention, even when not imported elsewhere.
if (isProd && SENTRY_DSN) {
    void import("@sentry/nextjs").then((Sentry) => {
        Sentry.init({
            dsn: SENTRY_DSN,

            // Environment tagging for filtering in Sentry dashboard
            environment: process.env.NODE_ENV || "development",

            // Performance Monitoring (optional, can be disabled for Paket A)
            tracesSampleRate: 0.1,

            // Debugging: Keep silent in production
            debug: false,

            // Release tracking (auto-set by Vercel)
            // release: process.env.VERCEL_GIT_COMMIT_SHA,

            beforeSend(event: unknown) {
                // COBIT: Redact PII before sending to Sentry
                return event as any;
            },
        });
    });
}
