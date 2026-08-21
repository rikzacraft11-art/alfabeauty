import "server-only";

import { GUEST_SESSION_SECONDS } from "./core";
import { getCommerceMode } from "./env";
import { createMidtransSnap } from "./midtrans";
import { getCommerceCatalogData, getCommerceOfferByVariantId } from "./offers";
import { hashOpaqueToken } from "./security";
import {
  attachStoredSnap,
  completeDemoOrder,
  createStoredCheckout,
  getStoredCart,
  getStoredOrder,
  releaseStoredOrder,
  setStoredCartItem,
} from "./store";
import type { CartView, CheckoutInput, CheckoutResult, OrderView } from "./types";

export async function getCart(guestToken: string | null): Promise<CartView> {
  const mode = getCommerceMode();
  if (mode === "disabled" || !guestToken) return { items: [], subtotalIdr: 0, itemCount: 0, mode };
  const snapshot = await getStoredCart(hashOpaqueToken(guestToken));
  const catalog = await getCommerceCatalogData();
  const productMap = new Map(
    catalog.products.flatMap((product) =>
      product.commerceProductId ? [[product.commerceProductId, product] as const] : [],
    ),
  );
  return {
    mode,
    subtotalIdr: snapshot.subtotalIdr,
    itemCount: snapshot.itemCount,
    items: snapshot.items.map((item) => {
      const product = productMap.get(item.commerce_product_id);
      return {
        commerceProductId: item.commerce_product_id,
        commerceVariantId: item.commerce_variant_id,
        sku: item.sku,
        productName: product?.name ?? item.display_name,
        variantLabel: item.variant_label,
        slug: product?.id,
        image: product?.image,
        quantity: item.quantity,
        unitPriceIdr: item.price_idr,
        lineTotalIdr: item.line_total_idr,
        stockAvailable: item.stock_on_hand,
        available: item.active && item.quantity <= item.stock_on_hand,
      };
    }),
  };
}

export async function updateCart(
  guestToken: string,
  commerceVariantId: string,
  quantity: number,
): Promise<CartView> {
  const found = await getCommerceOfferByVariantId(commerceVariantId);
  if (!found || !found.offer.active) throw new Error("Offer is unavailable");
  if (quantity > found.offer.stockAvailable) throw new Error("Requested quantity exceeds demo stock");
  await setStoredCartItem({
    guestTokenHash: hashOpaqueToken(guestToken),
    expiresAt: new Date(Date.now() + GUEST_SESSION_SECONDS * 1000).toISOString(),
    offer: found.offer,
    productName: found.product.name,
    quantity,
  });
  return getCart(guestToken);
}

export async function createCheckout(
  guestToken: string,
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const mode = getCommerceMode();
  if (mode === "disabled") throw new Error("Commerce is disabled");
  // The client persists this UUID for retries. Reusing it as the opaque order
  // capability keeps idempotent retries attached to the original token hash.
  const orderToken = input.idempotencyKey;
  const checkout = await createStoredCheckout({
    guestTokenHash: hashOpaqueToken(guestToken),
    idempotencyKey: input.idempotencyKey,
    publicTokenHash: hashOpaqueToken(orderToken),
    customer: input.customer,
    shippingAddress: input.shippingAddress,
  });

  if (mode === "demo") {
    return {
      orderNumber: checkout.orderNumber,
      orderToken,
      totalIdr: checkout.totalIdr,
      redirectUrl: `/order/${orderToken}`,
      paymentMode: "demo",
    };
  }

  const order = await getStoredOrder(hashOpaqueToken(orderToken));
  if (!order) throw new Error("Checkout order could not be loaded");
  try {
    const snap = await createMidtransSnap(order, orderToken, input.customer);
    await attachStoredSnap(checkout.orderId, snap.token, snap.redirectUrl);
    return {
      orderNumber: checkout.orderNumber,
      orderToken,
      totalIdr: checkout.totalIdr,
      redirectUrl: snap.redirectUrl,
      paymentMode: "midtrans-sandbox",
    };
  } catch (error) {
    await releaseStoredOrder(checkout.orderId);
    throw error;
  }
}

export async function getOrder(orderToken: string): Promise<OrderView | null> {
  if (!/^(?:[A-Za-z0-9_-]{43}|[a-f0-9-]{36})$/.test(orderToken)) return null;
  return getStoredOrder(hashOpaqueToken(orderToken));
}

export async function payDemoOrder(orderToken: string): Promise<OrderView | null> {
  if (!/^(?:[A-Za-z0-9_-]{43}|[a-f0-9-]{36})$/.test(orderToken)) return null;
  return completeDemoOrder(hashOpaqueToken(orderToken));
}
