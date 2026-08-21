export type CommerceMode = "disabled" | "demo" | "sandbox";

export type CommerceOffer = {
  commerceProductId: string;
  commerceVariantId: string;
  sku: string;
  label: string;
  priceIdr: number;
  stockAvailable: number;
  active: boolean;
  currency: "IDR";
  version: number;
  demo: boolean;
};

export type CartLine = {
  commerceProductId: string;
  commerceVariantId: string;
  sku: string;
  productName: string;
  variantLabel: string;
  slug?: string;
  image?: string;
  quantity: number;
  unitPriceIdr: number;
  lineTotalIdr: number;
  stockAvailable: number;
  available: boolean;
};

export type CartView = {
  items: CartLine[];
  subtotalIdr: number;
  itemCount: number;
  mode: CommerceMode;
};

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
};

export type CheckoutAddress = {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: "ID";
};

export type CheckoutInput = {
  customer: CheckoutCustomer;
  shippingAddress: CheckoutAddress;
  idempotencyKey: string;
};

export type CheckoutResult = {
  orderNumber: string;
  orderToken: string;
  totalIdr: number;
  redirectUrl: string;
  paymentMode: "demo" | "midtrans-sandbox";
};

export type OrderStatus =
  | "awaiting_payment"
  | "paid"
  | "payment_failed"
  | "expired"
  | "cancelled";

export type OrderLine = {
  commerceProductId: string;
  commerceVariantId: string;
  sku: string;
  productName: string;
  variantLabel: string;
  quantity: number;
  unitPriceIdr: number;
  lineTotalIdr: number;
};

export type OrderView = {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  subtotalIdr: number;
  shippingIdr: number;
  taxIdr: number;
  totalIdr: number;
  customerName: string;
  expiresAt: string;
  createdAt: string;
  items: OrderLine[];
};

export type RawCartLine = {
  commerce_variant_id: string;
  commerce_product_id: string;
  sku: string;
  display_name: string;
  variant_label: string;
  price_idr: number;
  stock_on_hand: number;
  active: boolean;
  quantity: number;
  line_total_idr: number;
};

export type RawCartSnapshot = {
  items: RawCartLine[];
  subtotalIdr: number;
  itemCount: number;
};

export type CheckoutRecord = {
  orderId: string;
  orderNumber: string;
  midtransOrderId: string;
  totalIdr: number;
  status: OrderStatus;
  snapToken?: string | null;
  snapRedirectUrl?: string | null;
  expiresAt: string;
};

export type PaymentTargetStatus = OrderStatus | "pending";

export type NormalizedPaymentEvent = {
  eventKey: string;
  midtransOrderId: string;
  transactionId: string | null;
  transactionStatus: string;
  statusCode: string;
  fraudStatus: string | null;
  grossAmountIdr: number;
  payloadHash: string;
  payload: Record<string, string | null>;
  targetStatus: PaymentTargetStatus;
};

