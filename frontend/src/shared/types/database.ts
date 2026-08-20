/* ─────────────────────────────────────────────────────────────────────
 * Database Types — Supabase E-Commerce Schema
 *
 * TypeScript types matching the Supabase database tables defined in
 * 001_initial_ecommerce.sql. These types are used throughout the
 * application for type-safe database operations.
 * ───────────────────────────────────────────────────────────────────── */

// ── Product Taxonomy ──

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductBrand = {
  id: string;
  name: string;
  slug: string;
  origin: string | null;
  logo_url: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductFeature = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

// ── Products ──

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  sku: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  is_in_stock: boolean;
  weight_grams: number | null;
  dimensions: { length: number; width: number; height: number } | null;
  images: string[];
  brand_id: string | null;
  category_id: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  is_in_stock: boolean;
  attributes: Record<string, string>;
  sort_order: number;
  created_at: string;
};

// ── Extended Product (with relations) ──

export type ProductWithRelations = Product & {
  brand: ProductBrand | null;
  category: ProductCategory | null;
  features: ProductFeature[];
  variants: ProductVariant[];
};

// ── Users & Auth ──

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

export type Address = {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

// ── Cart ──

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type CartItemWithProduct = CartItem & {
  product: Product;
  variant: ProductVariant | null;
};

// ── Orders ──

export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
  shipping_address: Address | null;
  payment_method: string | null;
  payment_id: string | null;
  payment_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
};

export type OrderWithItems = Order & {
  items: OrderItem[];
};

// ── Blog ──

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  author_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
