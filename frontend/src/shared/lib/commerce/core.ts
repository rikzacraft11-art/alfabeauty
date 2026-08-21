import type { PaymentTargetStatus } from "./types";

export const GUEST_COOKIE_NAME = "alfa_guest";
export const GUEST_SESSION_SECONDS = 24 * 60 * 60;
export const ORDER_TOKEN_BYTES = 32;

export function formatIdr(value: number): string {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("Invalid IDR amount");
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseMidtransAmount(value: string): number {
  if (!/^[0-9]+(?:\.00)?$/.test(value)) throw new Error("Invalid Midtrans amount");
  const parsed = Number(value.replace(/\.00$/, ""));
  if (!Number.isSafeInteger(parsed) || parsed < 0) throw new Error("Unsafe Midtrans amount");
  return parsed;
}

export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string | null,
): PaymentTargetStatus {
  const status = transactionStatus.toLowerCase();
  const fraud = fraudStatus?.toLowerCase();
  if (status === "settlement") return "paid";
  if (status === "capture") return !fraud || fraud === "accept" ? "paid" : "pending";
  if (status === "deny" || status === "failure") return "payment_failed";
  if (status === "cancel") return "cancelled";
  if (status === "expire") return "expired";
  return "pending";
}

export function mapVerifiedMidtransStatus(
  statusCode: string,
  transactionStatus: string,
  fraudStatus?: string | null,
): PaymentTargetStatus {
  const mapped = mapMidtransStatus(transactionStatus, fraudStatus);
  return mapped === "paid" && statusCode !== "200" ? "pending" : mapped;
}

export function stableDemoPrice(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return 125_000 + (hash % 12) * 25_000;
}

export function stableVariantId(productId: string, label: string): string {
  const suffix = label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "default";
  return `${productId}.${suffix}`.slice(0, 96);
}
