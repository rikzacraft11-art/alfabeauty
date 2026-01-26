import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Traceability: Generate Request ID (ITIL)
    // Propagated to all downstream logs and services.
    const requestHeaders = new Headers(request.headers);
    const requestId = crypto.randomUUID();
    requestHeaders.set("x-request-id", requestId);

    // Expert Mode: Standard Sub-path Routing (Best Practice)
    // We do NOT use suffix rewriting (.en) as it fights the framework.

    // 1. Root Redirect
    if (pathname === "/") {
        const url = request.nextUrl.clone();
        url.pathname = "/id";
        return NextResponse.redirect(url);
    }

    // 2. Locale Enforcement (Resilience)
    // Check if path starts with a supported locale
    const pathnameIsMissingLocale = ["/en", "/id"].every(
        (locale) => !pathname.startsWith(`${locale}/`) && pathname !== locale
    );

    // Redirect if locale is missing (e.g. /products -> /id/products)
    // Exception: Explicit API routes or known public files (handled by matcher config)
    if (pathnameIsMissingLocale) {
        const url = request.nextUrl.clone();
        url.pathname = `/id${pathname.startsWith("/") ? "" : "/"}${pathname}`;
        return NextResponse.redirect(url);
    }

    // 3. Pass headers (including Trace ID)
    requestHeaders.set("Server-Timing", `trace;desc="${requestId}"`);
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
