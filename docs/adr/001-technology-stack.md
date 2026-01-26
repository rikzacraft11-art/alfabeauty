# ADR 001: Technology Stack Selection

**Date:** 2026-01-26
**Status:** Accepted

## Context

Paket A requires a B2B Distribution platform that is:
- High performance (Core Web Vitals).
- Cost-effective (Serverless).
- Type-safe (Reliability).
- Secure (ISO 27001 ready).

## Decision

We chose the following stack:

1.  **Framework: Next.js (App Router)**
    - *Why:* React Server Components (RSC) reduce client bundle size; Built-in Optimizations (Image/Font); Vercel Edge support.
2.  **Database: Supabase (PostgreSQL)**
    - *Why:* Open Source; Row Level Security (RLS); Built-in Authentication hooks; Managed scaling.
3.  **Styling: Tailwind CSS**
    - *Why:* Utility-first minimizes CSS bundle growth; Design System consistency via config.
4.  **Language: TypeScript**
    - *Why:* Strict typing prevents 80% of runtime errors.

## Consequences

- **Positive:** Fast TTM (Time to Market); Zero infrastructure management ops.
- **Negative:** Vendor lock-in risk (Vercel/Supabase).
- **Mitigation:** Codebase is standard Next.js; PostgreSQL is standard SQL. Migration possible if needed.
