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

  // Skip public/static files (anything with an extension), otherwise the locale
  // redirect breaks asset URLs like /images/* and Next/Image optimization.
  if (pathname.includes(".")) {
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

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const locale = chooseLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
