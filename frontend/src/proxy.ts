/* ─────────────────────────────────────────────────────────────────────
 * Next.js Proxy — Nonce-Based Content Security Policy
 *
 * Referenced in paket-a.md §15 (Security headers baseline).
 *
 * Nonce strategy:
 *   1. Generate a per-request nonce via crypto.randomUUID()
 *   2. Pass it to Next.js via the x-nonce request header
 *   3. Next.js automatically injects nonce= into its inline scripts
 *   4. CSP script-src uses 'nonce-<value>' to allow only those scripts
 *
 * OWASP ASVS v5.0.0:
 *   v5.0.0-V3.4.6 — frame-ancestors prevents embedding
 *   v5.0.0-V3.4.3 — object-src 'none' + base-uri 'none'
 * ───────────────────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest): NextResponse {
  const nonce = crypto.randomUUID();

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://connect.facebook.net`,
    `style-src 'self' 'unsafe-inline'`, // Tailwind + Radix inject inline styles
    `img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com`,
    `font-src 'self'`,
    `media-src 'self'`,
    `connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://www.clarity.ms https://connect.facebook.net`,
    `frame-ancestors 'none'`,
    `base-uri 'none'`,
    `object-src 'none'`,
    `form-action 'self'`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - API routes (they set their own headers)
     */
    {
      source:
        "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
