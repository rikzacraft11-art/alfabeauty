import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { HTTP_NO_STORE_HEADERS } from "@/shared/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Validates candidate path against Open Redirect attacks (CWE-601) and CRLF injection.
 * Restricts target to same-origin relative paths starting with a single forward slash.
 */
function resolveSafeRedirect(target: string | null, requestUrl: string): URL {
  if (
    target &&
    target.startsWith("/") &&
    !target.startsWith("//") &&
    !target.includes("\\") &&
    !/[\r\n]/.test(target)
  ) {
    try {
      return new URL(target, requestUrl);
    } catch {
      // Fallback on malformed target
    }
  }
  return new URL("/", requestUrl);
}

export async function GET(request: Request): Promise<Response> {
  const store = await draftMode();
  store.disable();

  const { searchParams } = new URL(request.url);
  const target = searchParams.get("redirect") || searchParams.get("slug");
  const destination = resolveSafeRedirect(target, request.url);

  return NextResponse.redirect(destination, {
    status: 307,
    headers: HTTP_NO_STORE_HEADERS,
  });
}
