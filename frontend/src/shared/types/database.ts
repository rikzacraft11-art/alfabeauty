/** Database rows for the ordered commerce MVP migrations. Money is integer IDR. */
export type CommerceOfferRow = {
  commerce_variant_id: string;
  commerce_product_id: string;
  sku: string;
  display_name: string;
  variant_label: string;
  currency: "IDR";
  price_idr: number;
  stock_on_hand: number;
  active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
};

export type CommerceGuestSessionRow = {
  id: string;
  token_hash: string;
  expires_at: string;
  last_seen_at: string;
  created_at: string;
};

export type CommerceCartRow = {
  id: string;
  guest_session_id: string;
  status: "open" | "converted" | "expired";
  created_at: string;
  updated_at: string;
};

export type CommerceCartItemRow = {
  cart_id: string;
  commerce_variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type CommerceOrderRow = {
  id: string;
  order_number: string;
  midtrans_order_id: string;
  guest_session_id: string;
  public_token_hash: string;
  idempotency_key: string;
  status: "awaiting_payment" | "paid" | "payment_failed" | "expired" | "cancelled";
  payment_status: "pending" | "challenge" | "paid" | "denied" | "cancelled" | "expired" | "error";
  currency: "IDR";
  subtotal_idr: number;
  shipping_idr: number;
  tax_idr: number;
  total_idr: number;
  customer: Record<string, unknown>;
  shipping_address: Record<string, unknown>;
  expires_at: string;
  created_at: string;
  updated_at: string;
};

export type CommerceOrderItemRow = {
  id: string;
  order_id: string;
  commerce_product_id: string;
  commerce_variant_id: string;
  sku: string;
  product_name: string;
  variant_label: string;
  quantity: number;
  unit_price_idr: number;
  line_total_idr: number;
  offer_version: number;
  created_at: string;
};

export type CommerceOrderWithItems = CommerceOrderRow & { items: CommerceOrderItemRow[] };
