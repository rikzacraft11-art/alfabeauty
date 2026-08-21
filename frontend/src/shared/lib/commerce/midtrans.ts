import "server-only";

import { z } from "zod";
import { midtransNotificationSchema } from "./contracts";
import { getMidtransConfig, getSiteOrigin } from "./env";
import { mapVerifiedMidtransStatus, parseMidtransAmount } from "./core";
import type { NormalizedPaymentEvent, OrderView } from "./types";
import { payloadHash } from "./security";
import { createMidtransSignature, signaturesMatch } from "./midtrans-crypto";

const snapResponseSchema = z.object({ token: z.string().min(1), redirect_url: z.string().url() });

function authorization(serverKey: string): string {
  return `Basic ${Buffer.from(`${serverKey}:`, "utf8").toString("base64")}`;
}

export async function createMidtransSnap(
  order: OrderView,
  orderToken: string,
  customer: { name: string; email: string; phone: string },
): Promise<{ token: string; redirectUrl: string }> {
  const config = getMidtransConfig();
  const siteOrigin = getSiteOrigin();
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      Authorization: authorization(config.serverKey),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_details: { order_id: order.orderNumber, gross_amount: order.totalIdr },
      item_details: order.items.map((item) => ({
        id: item.sku,
        price: item.unitPriceIdr,
        quantity: item.quantity,
        name: `${item.productName} ${item.variantLabel}`.slice(0, 50),
      })),
      customer_details: {
        first_name: customer.name.slice(0, 50),
        email: customer.email,
        phone: customer.phone,
      },
      callbacks: { finish: `${siteOrigin}/order/${orderToken}` },
      expiry: { unit: "minutes", duration: 30 },
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Midtrans Snap rejected checkout (${response.status})`);
  const parsed = snapResponseSchema.parse(await response.json());
  if (!parsed.redirect_url.startsWith("https://app.sandbox.midtrans.com/")) {
    throw new Error("Unexpected Midtrans redirect origin");
  }
  return { token: parsed.token, redirectUrl: parsed.redirect_url };
}

export function verifyMidtransSignature(payload: unknown, serverKey: string): boolean {
  const parsed = midtransNotificationSchema.safeParse(payload);
  if (!parsed.success) return false;
  const value = parsed.data;
  const expected = createMidtransSignature({
    orderId: value.order_id,
    statusCode: value.status_code,
    grossAmount: value.gross_amount,
    serverKey,
  });
  return signaturesMatch(expected, value.signature_key);
}

export async function fetchVerifiedMidtransStatus(orderId: string): Promise<unknown> {
  const config = getMidtransConfig();
  const response = await fetch(`${config.statusEndpoint}/${encodeURIComponent(orderId)}/status`, {
    headers: { Authorization: authorization(config.serverKey), Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Midtrans status verification failed (${response.status})`);
  return response.json();
}

export function normalizeMidtransEvent(payload: unknown): NormalizedPaymentEvent {
  const value = midtransNotificationSchema.parse(payload);
  const amount = parseMidtransAmount(value.gross_amount);
  const targetStatus = mapVerifiedMidtransStatus(
    value.status_code,
    value.transaction_status,
    value.fraud_status,
  );
  return {
    eventKey: [value.order_id, value.transaction_id ?? "none", value.transaction_status, value.status_code].join(":"),
    midtransOrderId: value.order_id,
    transactionId: value.transaction_id ?? null,
    transactionStatus: value.transaction_status,
    statusCode: value.status_code,
    fraudStatus: value.fraud_status ?? null,
    grossAmountIdr: amount,
    payloadHash: payloadHash(payload),
    payload: {
      orderId: value.order_id,
      transactionId: value.transaction_id ?? null,
      transactionStatus: value.transaction_status,
      statusCode: value.status_code,
      fraudStatus: value.fraud_status ?? null,
      grossAmount: value.gross_amount,
      settlementTime: value.settlement_time ?? null,
    },
    targetStatus,
  };
}
