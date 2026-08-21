import { z } from "zod";

const stableId = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{2,95}$/);
const safeText = (max: number) => z.string().trim().min(1).max(max);

export const cartMutationSchema = z.object({
  commerceVariantId: stableId,
  quantity: z.number().int().min(0).max(20),
});

export const checkoutSchema = z.object({
  idempotencyKey: z.string().uuid(),
  customer: z.object({
    name: safeText(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().regex(/^\+?[0-9][0-9 -]{7,19}$/),
  }),
  shippingAddress: z.object({
    street: safeText(300),
    city: safeText(100),
    province: safeText(100),
    postalCode: z.string().trim().regex(/^[0-9]{5}$/),
    country: z.literal("ID"),
  }),
});

export const midtransNotificationSchema = z.object({
  order_id: z.string().min(1).max(50),
  status_code: z.string().min(1).max(8),
  gross_amount: z.string().regex(/^[0-9]+(?:\.00)?$/),
  signature_key: z.string().regex(/^[a-fA-F0-9]{128}$/),
  transaction_status: z.string().min(1).max(32),
  transaction_id: z.string().min(1).max(100).optional(),
  fraud_status: z.string().max(32).optional(),
  settlement_time: z.string().max(40).optional(),
});

export const commerceOfferRowSchema = z.object({
  commerce_product_id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/),
  commerce_variant_id: stableId,
  sku: z.string().regex(/^[A-Z0-9][A-Z0-9._-]{2,63}$/),
  variant_label: z.string().trim().min(1).max(160),
  price_idr: z.number().int().positive(),
  stock_on_hand: z.number().int().nonnegative(),
  active: z.boolean(),
  currency: z.literal("IDR"),
  version: z.number().int().positive(),
});
