import "server-only";

import type { CommerceMode } from "./types";

export function getCommerceMode(): CommerceMode {
  const value = process.env.COMMERCE_MODE?.trim().toLowerCase();
  if (value === "demo" || value === "sandbox") return value;
  return "disabled";
}

export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_DOMAIN?.trim() || "http://localhost:3000";
  const url = new URL(raw);
  const localHttp =
    url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  if (url.protocol !== "https:" && !localHttp) throw new Error("Site origin must use HTTPS");
  return url.origin;
}

export function getMidtransConfig(): { serverKey: string; endpoint: string; statusEndpoint: string } {
  if (getCommerceMode() !== "sandbox") throw new Error("Midtrans is only available in sandbox mode");
  if (process.env.MIDTRANS_IS_PRODUCTION?.trim().toLowerCase() === "true") {
    throw new Error("Production Midtrans credentials are outside the approved MVP scope");
  }
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
  if (!serverKey || !serverKey.startsWith("SB-Mid-server-")) {
    throw new Error("A Midtrans Sandbox server key is required");
  }
  return {
    serverKey,
    endpoint: "https://app.sandbox.midtrans.com/snap/v1/transactions",
    statusEndpoint: "https://api.sandbox.midtrans.com/v2",
  };
}

export function getCommerceSecuritySecret(): string {
  const value = process.env.COMMERCE_SECURITY_SECRET?.trim();
  if (!value || value.length < 32) throw new Error("COMMERCE_SECURITY_SECRET must contain at least 32 characters");
  return value;
}
