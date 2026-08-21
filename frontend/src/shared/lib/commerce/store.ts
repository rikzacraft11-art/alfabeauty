import "server-only";

import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/shared/lib/supabase";
import { getCommerceMode } from "./env";
import type {
  CheckoutAddress,
  CheckoutCustomer,
  CheckoutRecord,
  CommerceOffer,
  NormalizedPaymentEvent,
  OrderView,
  RawCartLine,
  RawCartSnapshot,
} from "./types";

type DemoOrder = OrderView & {
  publicTokenHash: string;
  guestTokenHash: string;
  idempotencyKey: string;
  midtransOrderId: string;
};

type DemoState = {
  carts: Map<string, Map<string, RawCartLine>>;
  orders: Map<string, DemoOrder>;
  idempotency: Map<string, string>;
  limits: Map<string, { startedAt: number; count: number }>;
};

const globalStore = globalThis as typeof globalThis & { __alfaCommerceDemo?: DemoState };
const demoState: DemoState =
  globalStore.__alfaCommerceDemo ?? {
    carts: new Map(),
    orders: new Map(),
    idempotency: new Map(),
    limits: new Map(),
  };
globalStore.__alfaCommerceDemo = demoState;

function assertCommerceAvailable(): "demo" | "sandbox" {
  const mode = getCommerceMode();
  if (mode === "disabled") throw new Error("Commerce is disabled");
  return mode;
}

function rpcData<T>(data: unknown, error: { message: string } | null, action: string): T {
  if (error) throw new Error(`${action}: ${error.message}`);
  if (data === null || data === undefined) throw new Error(`${action}: empty database response`);
  return data as T;
}

export async function setStoredCartItem(args: {
  guestTokenHash: string;
  expiresAt: string;
  offer: CommerceOffer;
  productName: string;
  quantity: number;
}): Promise<void> {
  const mode = assertCommerceAvailable();
  if (mode === "sandbox") {
    const { error } = await getSupabaseAdmin().rpc("commerce_set_cart_item", {
      p_guest_token_hash: args.guestTokenHash,
      p_session_expires_at: args.expiresAt,
      p_variant_id: args.offer.commerceVariantId,
      p_quantity: args.quantity,
    });
    if (error) throw new Error(`Unable to update cart: ${error.message}`);
    return;
  }

  const cart = demoState.carts.get(args.guestTokenHash) ?? new Map<string, RawCartLine>();
  if (args.quantity === 0) cart.delete(args.offer.commerceVariantId);
  else {
    cart.set(args.offer.commerceVariantId, {
      commerce_variant_id: args.offer.commerceVariantId,
      commerce_product_id: args.offer.commerceProductId,
      sku: args.offer.sku,
      display_name: args.productName,
      variant_label: args.offer.label,
      price_idr: args.offer.priceIdr,
      stock_on_hand: args.offer.stockAvailable,
      active: args.offer.active,
      quantity: args.quantity,
      line_total_idr: args.offer.priceIdr * args.quantity,
    });
  }
  demoState.carts.set(args.guestTokenHash, cart);
}

export async function getStoredCart(guestTokenHash: string): Promise<RawCartSnapshot> {
  const mode = assertCommerceAvailable();
  if (mode === "sandbox") {
    const { data, error } = await getSupabaseAdmin().rpc("commerce_cart_snapshot", {
      p_guest_token_hash: guestTokenHash,
    });
    return rpcData<RawCartSnapshot>(data, error, "Unable to read cart");
  }
  const items = Array.from(demoState.carts.get(guestTokenHash)?.values() ?? []);
  return {
    items,
    subtotalIdr: items.reduce((sum, item) => sum + item.line_total_idr, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export async function createStoredCheckout(args: {
  guestTokenHash: string;
  idempotencyKey: string;
  publicTokenHash: string;
  customer: CheckoutCustomer;
  shippingAddress: CheckoutAddress;
}): Promise<CheckoutRecord> {
  const mode = assertCommerceAvailable();
  if (mode === "sandbox") {
    const { data, error } = await getSupabaseAdmin().rpc("commerce_create_checkout", {
      p_guest_token_hash: args.guestTokenHash,
      p_idempotency_key: args.idempotencyKey,
      p_public_token_hash: args.publicTokenHash,
      p_customer: args.customer,
      p_shipping_address: args.shippingAddress,
    });
    return rpcData<CheckoutRecord>(data, error, "Unable to create checkout");
  }

  const existingHash = demoState.idempotency.get(args.idempotencyKey);
  if (existingHash) {
    const existing = demoState.orders.get(existingHash);
    if (existing) {
      return {
        orderId: existing.orderId,
        orderNumber: existing.orderNumber,
        midtransOrderId: existing.midtransOrderId,
        totalIdr: existing.totalIdr,
        status: existing.status,
        expiresAt: existing.expiresAt,
      };
    }
  }

  const cart = await getStoredCart(args.guestTokenHash);
  if (!cart.items.length || cart.subtotalIdr <= 0) throw new Error("Cart is empty");
  for (const item of cart.items) {
    if (!item.active || item.quantity > item.stock_on_hand) throw new Error("Cart contains an unavailable item");
  }
  const orderId = randomUUID();
  const orderNumber = `DEMO-${orderId.replace(/-/g, "").slice(0, 20).toUpperCase()}`;
  const now = new Date();
  const order: DemoOrder = {
    orderId,
    orderNumber,
    midtransOrderId: orderNumber,
    publicTokenHash: args.publicTokenHash,
    guestTokenHash: args.guestTokenHash,
    idempotencyKey: args.idempotencyKey,
    status: "awaiting_payment",
    paymentStatus: "pending",
    subtotalIdr: cart.subtotalIdr,
    shippingIdr: 0,
    taxIdr: 0,
    totalIdr: cart.subtotalIdr,
    customerName: args.customer.name,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 30 * 60_000).toISOString(),
    items: cart.items.map((item) => ({
      commerceProductId: item.commerce_product_id,
      commerceVariantId: item.commerce_variant_id,
      sku: item.sku,
      productName: item.display_name,
      variantLabel: item.variant_label,
      quantity: item.quantity,
      unitPriceIdr: item.price_idr,
      lineTotalIdr: item.line_total_idr,
    })),
  };
  demoState.orders.set(args.publicTokenHash, order);
  demoState.idempotency.set(args.idempotencyKey, args.publicTokenHash);
  demoState.carts.delete(args.guestTokenHash);
  return {
    orderId,
    orderNumber,
    midtransOrderId: orderNumber,
    totalIdr: order.totalIdr,
    status: order.status,
    expiresAt: order.expiresAt,
  };
}

export async function attachStoredSnap(
  orderId: string,
  snapToken: string,
  redirectUrl: string,
): Promise<void> {
  if (assertCommerceAvailable() === "demo") return;
  const { error } = await getSupabaseAdmin().rpc("commerce_attach_snap", {
    p_order_id: orderId,
    p_snap_token: snapToken,
    p_snap_redirect_url: redirectUrl,
  });
  if (error) throw new Error(`Unable to attach Snap transaction: ${error.message}`);
}

export async function releaseStoredOrder(orderId: string): Promise<void> {
  if (assertCommerceAvailable() === "demo") return;
  const { error } = await getSupabaseAdmin().rpc("commerce_release_order", {
    p_order_id: orderId,
    p_target_status: "payment_failed",
    p_payment_status: "error",
  });
  if (error) throw new Error(`Unable to release failed checkout: ${error.message}`);
}

export async function getStoredOrder(publicTokenHash: string): Promise<OrderView | null> {
  const mode = assertCommerceAvailable();
  if (mode === "demo") return demoState.orders.get(publicTokenHash) ?? null;
  const { data, error } = await getSupabaseAdmin().rpc("commerce_order_snapshot", {
    p_public_token_hash: publicTokenHash,
  });
  if (error) throw new Error(`Unable to read order: ${error.message}`);
  return (data as OrderView | null) ?? null;
}

export async function applyStoredPaymentEvent(event: NormalizedPaymentEvent): Promise<string> {
  const mode = assertCommerceAvailable();
  if (mode === "demo") throw new Error("External payment events are unavailable in demo mode");
  const { data, error } = await getSupabaseAdmin().rpc("commerce_apply_payment_event", {
    p_midtrans_order_id: event.midtransOrderId,
    p_provider_event_key: event.eventKey,
    p_transaction_id: event.transactionId,
    p_transaction_status: event.transactionStatus,
    p_status_code: event.statusCode,
    p_fraud_status: event.fraudStatus,
    p_gross_amount_idr: event.grossAmountIdr,
    p_payload_hash: event.payloadHash,
    p_normalized_payload: event.payload,
    p_target_status: event.targetStatus,
  });
  return rpcData<string>(data, error, "Unable to apply payment event");
}

export async function completeDemoOrder(publicTokenHash: string): Promise<OrderView | null> {
  if (assertCommerceAvailable() !== "demo") throw new Error("Demo payment is disabled");
  const order = demoState.orders.get(publicTokenHash);
  if (!order) return null;
  if (order.status === "awaiting_payment") {
    order.status = "paid";
    order.paymentStatus = "paid";
  }
  return order;
}

export async function consumeStoredRateLimit(
  action: string,
  identifierHash: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const mode = assertCommerceAvailable();
  if (mode === "sandbox") {
    const { data, error } = await getSupabaseAdmin().rpc("commerce_consume_rate_limit", {
      p_action: action,
      p_identifier_hash: identifierHash,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    return rpcData<boolean>(data, error, "Unable to apply rate limit");
  }
  const key = `${action}:${identifierHash}`;
  const now = Date.now();
  const current = demoState.limits.get(key);
  if (!current || current.startedAt <= now - windowSeconds * 1000) {
    demoState.limits.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

