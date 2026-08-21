-- Destructive rollback for development/preview only. Run after the matching
-- transaction rollback and only when order/payment evidence may be deleted.
drop table if exists public.commerce_rate_limits;
drop table if exists public.commerce_payment_events;
drop table if exists public.commerce_inventory_reservations;
drop table if exists public.commerce_order_items;
drop table if exists public.commerce_orders;
drop table if exists public.commerce_cart_items;
drop table if exists public.commerce_carts;
drop table if exists public.commerce_guest_sessions;
drop table if exists public.commerce_offers;

