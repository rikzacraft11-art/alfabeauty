import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "id"] as const;

type Locale = (typeof LOCALES)[number];

function isLocalePath(pathname: string): boolean {
  return LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
}

function chooseLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get("alfab_locale")?.value;
  if (cookieLocale === "id") return "id";
  if (cookieLocale === "en") return "en";

  const accept = req.headers.get("accept-language")?.toLowerCase() ?? "";
  if (accept.startsWith("id") || accept.includes("id-id") || accept.includes("id,")) return "id";
  return "en";
}

function localeFromPathname(pathname: string): Locale | null {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/id" || pathname.startsWith("/id/")) return "id";
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Scale Architecture: Precise Static Exclusion
  // Prevent catching legitimate slugs with dots (e.g. /blog/version-2.0)
  // while still skipping assets.
  const staticFileRegex = /\.(?:jpg|jpeg|png|gif|svg|ico|webp|js|css|woff2?|map|json|xml|txt)$/i;

  if (staticFileRegex.test(pathname)) {
    return NextResponse.next();
  }

  // Skip Next internals and API routes.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/opengraph-image" ||
    pathname === "/twitter-image"
  ) {
    return NextResponse.next();
  }

  if (isLocalePath(pathname)) {
    const locale = localeFromPathname(pathname) ?? chooseLocale(req);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-alfab-locale", locale);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // ITIL 4 / COBIT 2019 Security Compliance
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self';"
    );
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );

    return response;
  }

  const locale = chooseLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
