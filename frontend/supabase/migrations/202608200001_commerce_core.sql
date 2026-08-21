-- Alfa Beauty CMS + commerce sandbox MVP.
-- Editorial content stays in Sanity. These tables own sellability, price,
-- inventory, carts, orders, and payment state. Money is integer IDR.

create extension if not exists pgcrypto;

create table if not exists public.commerce_offers (
  commerce_variant_id text primary key,
  commerce_product_id text not null,
  sku text not null unique,
  display_name text not null,
  variant_label text not null,
  currency text not null default 'IDR' check (currency = 'IDR'),
  price_idr bigint not null check (price_idr > 0),
  stock_on_hand integer not null default 0 check (stock_on_hand >= 0),
  active boolean not null default false,
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commerce_offers_product_id_format check (
    commerce_product_id ~ '^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$'
  ),
  constraint commerce_offers_variant_id_format check (
    commerce_variant_id ~ '^[A-Za-z0-9][A-Za-z0-9._-]{2,95}$'
  ),
  constraint commerce_offers_sku_format check (
    sku ~ '^[A-Z0-9][A-Z0-9._-]{2,63}$'
  )
);

create index if not exists commerce_offers_product_active_idx
  on public.commerce_offers (commerce_product_id, active);

create table if not exists public.commerce_guest_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
  expires_at timestamptz not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists commerce_guest_sessions_expiry_idx
  on public.commerce_guest_sessions (expires_at);

create table if not exists public.commerce_carts (
  id uuid primary key default gen_random_uuid(),
  guest_session_id uuid not null references public.commerce_guest_sessions(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'converted', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists commerce_one_open_cart_per_guest_idx
  on public.commerce_carts (guest_session_id) where status = 'open';

create table if not exists public.commerce_cart_items (
  cart_id uuid not null references public.commerce_carts(id) on delete cascade,
  commerce_variant_id text not null references public.commerce_offers(commerce_variant_id),
  quantity integer not null check (quantity between 1 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (cart_id, commerce_variant_id)
);

create table if not exists public.commerce_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  midtrans_order_id text not null unique,
  guest_session_id uuid not null references public.commerce_guest_sessions(id),
  public_token_hash text not null unique check (public_token_hash ~ '^[a-f0-9]{64}$'),
  idempotency_key text not null unique check (char_length(idempotency_key) between 16 and 128),
  status text not null default 'awaiting_payment' check (
    status in ('awaiting_payment', 'paid', 'payment_failed', 'expired', 'cancelled')
  ),
  payment_status text not null default 'pending' check (
    payment_status in ('pending', 'challenge', 'paid', 'denied', 'cancelled', 'expired', 'error')
  ),
  currency text not null default 'IDR' check (currency = 'IDR'),
  subtotal_idr bigint not null check (subtotal_idr >= 0),
  shipping_idr bigint not null default 0 check (shipping_idr >= 0),
  tax_idr bigint not null default 0 check (tax_idr >= 0),
  total_idr bigint not null check (
    total_idr = subtotal_idr + shipping_idr + tax_idr and total_idr > 0
  ),
  customer jsonb not null,
  shipping_address jsonb not null,
  snap_token text,
  snap_redirect_url text,
  expires_at timestamptz not null,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists commerce_orders_guest_idx
  on public.commerce_orders (guest_session_id, created_at desc);
create index if not exists commerce_orders_status_expiry_idx
  on public.commerce_orders (status, expires_at);

create table if not exists public.commerce_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete restrict,
  commerce_product_id text not null,
  commerce_variant_id text not null,
  sku text not null,
  product_name text not null,
  variant_label text not null,
  quantity integer not null check (quantity between 1 and 20),
  unit_price_idr bigint not null check (unit_price_idr > 0),
  line_total_idr bigint not null check (line_total_idr = unit_price_idr * quantity),
  offer_version bigint not null check (offer_version > 0),
  created_at timestamptz not null default now(),
  unique (order_id, commerce_variant_id)
);

create index if not exists commerce_order_items_order_idx
  on public.commerce_order_items (order_id);

create table if not exists public.commerce_inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete restrict,
  commerce_variant_id text not null references public.commerce_offers(commerce_variant_id),
  quantity integer not null check (quantity between 1 and 20),
  status text not null default 'reserved' check (status in ('reserved', 'captured', 'released')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, commerce_variant_id)
);

create index if not exists commerce_reservations_expiry_idx
  on public.commerce_inventory_reservations (status, expires_at);

create table if not exists public.commerce_payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'midtrans' check (provider = 'midtrans'),
  provider_event_key text not null unique,
  midtrans_order_id text not null,
  transaction_id text,
  transaction_status text not null,
  status_code text not null,
  fraud_status text,
  gross_amount_idr bigint not null check (gross_amount_idr >= 0),
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  normalized_payload jsonb not null,
  processing_result text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists commerce_payment_events_order_idx
  on public.commerce_payment_events (midtrans_order_id, received_at desc);

create table if not exists public.commerce_rate_limits (
  action text not null,
  identifier_hash text not null check (identifier_hash ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  primary key (action, identifier_hash)
);

alter table public.commerce_offers enable row level security;
alter table public.commerce_guest_sessions enable row level security;
alter table public.commerce_carts enable row level security;
alter table public.commerce_cart_items enable row level security;
alter table public.commerce_orders enable row level security;
alter table public.commerce_order_items enable row level security;
alter table public.commerce_inventory_reservations enable row level security;
alter table public.commerce_payment_events enable row level security;
alter table public.commerce_rate_limits enable row level security;

revoke all on table public.commerce_offers from anon, authenticated;
revoke all on table public.commerce_guest_sessions from anon, authenticated;
revoke all on table public.commerce_carts from anon, authenticated;
revoke all on table public.commerce_cart_items from anon, authenticated;
revoke all on table public.commerce_orders from anon, authenticated;
revoke all on table public.commerce_order_items from anon, authenticated;
revoke all on table public.commerce_inventory_reservations from anon, authenticated;
revoke all on table public.commerce_payment_events from anon, authenticated;
revoke all on table public.commerce_rate_limits from anon, authenticated;

grant all on table public.commerce_offers to service_role;
grant all on table public.commerce_guest_sessions to service_role;
grant all on table public.commerce_carts to service_role;
grant all on table public.commerce_cart_items to service_role;
grant all on table public.commerce_orders to service_role;
grant all on table public.commerce_order_items to service_role;
grant all on table public.commerce_inventory_reservations to service_role;
grant all on table public.commerce_payment_events to service_role;
grant all on table public.commerce_rate_limits to service_role;

