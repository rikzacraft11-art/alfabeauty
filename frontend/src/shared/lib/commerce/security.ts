import "server-only";

import { createHash, createHmac, randomBytes } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { GUEST_COOKIE_NAME, GUEST_SESSION_SECONDS, ORDER_TOKEN_BYTES } from "./core";
import { getCommerceSecuritySecret } from "./env";

export function randomOpaqueToken(bytes = ORDER_TOKEN_BYTES): string {
  return randomBytes(bytes).toString("base64url");
}

export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function readGuestToken(request: NextRequest): string | null {
  const token = request.cookies.get(GUEST_COOKIE_NAME)?.value ?? null;
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}

export function ensureGuestToken(request: NextRequest): { token: string; created: boolean } {
  return { token: readGuestToken(request) ?? randomOpaqueToken(), created: !readGuestToken(request) };
}

export function setGuestCookie(response: NextResponse, token: string, secure: boolean): void {
  response.cookies.set({
    name: GUEST_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: GUEST_SESSION_SECONDS,
  });
}

export function assertSameOrigin(request: NextRequest): void {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host")?.toLowerCase();
  if (!origin || !host) throw new Error("Cross-origin request rejected");
  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    throw new Error("Cross-origin request rejected");
  }
  if (
    originUrl.host.toLowerCase() !== host ||
    (originUrl.protocol !== "https:" && originUrl.protocol !== "http:")
  ) {
    throw new Error("Cross-origin request rejected");
  }
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) throw new Error("JSON content type required");
}

export function clientIdentifierHash(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const value = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHmac("sha256", getCommerceSecuritySecret()).update(value, "utf8").digest("hex");
}

export function requestUsesHttps(request: NextRequest): boolean {
  return (
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase() === "https"
  );
}

export function payloadHash(value: unknown): string {
  return hashOpaqueToken(JSON.stringify(value));
}
