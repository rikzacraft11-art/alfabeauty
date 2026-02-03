import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { handleI18nRouting } from "@/lib/i18n-middleware";

/**
 * Next.js Proxy (formerly Middleware)
 *
 * Responsibilities:
 * 1. Internationalization (i18n): Detect locale and redirect/rewrite.
 * 2. Security headers: Set dynamic CSP nonce header.
 * 3. Traceability: Add request id and timing.
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Traceability: Generate Request ID (ITIL)
  const requestHeaders = new Headers(request.headers);
  const requestId = crypto.randomUUID();
  requestHeaders.set("x-request-id", requestId);

  // Propagate locale (derived from URL) for server components that can't access route params.
  const localeFromPath =
    pathname === "/id" || pathname.startsWith("/id/")
      ? "id"
      : pathname === "/en" || pathname.startsWith("/en/")
        ? "en"
        : null;
  if (localeFromPath) requestHeaders.set("x-alfab-locale", localeFromPath);

  // 0. Maintenance Mode Check (High Priority)
  if (process.env.MAINTENANCE_MODE === "true" && !pathname.startsWith("/maintenance")) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // 1. & 2. Handle I18n Routing
  const i18nResponse = handleI18nRouting(request);
  if (i18nResponse) return i18nResponse;

  // 3. Pass headers (including Trace ID)
  requestHeaders.set("Server-Timing", `trace;desc="${requestId}"`);

  // 4. Content Security Policy (Nonce-based)
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  requestHeaders.set("x-nonce", nonce);

  const isDev = process.env.NODE_ENV !== "production";
  const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com ${isDev ? "'unsafe-eval'" : ""};
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https://cdn.brandfetch.io https://*.supabase.co https://placehold.co https://www.google-analytics.com;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://*.supabase.co https://*.sentry.io https://vitals.vercel-insights.com https://www.google-analytics.com https://www.googletagmanager.com;
        object-src 'none';
        base-uri 'none';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|webm|ogg|mp3|wav|pdf)$).*)",
  ],
};
