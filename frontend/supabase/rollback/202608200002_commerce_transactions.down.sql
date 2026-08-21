-- Destructive rollback for development/preview only. Back up and reconcile
-- orders before use. Production rollback should normally be forward-fix.
drop function if exists public.commerce_expire_orders(integer);
drop function if exists public.commerce_consume_rate_limit(text, text, integer, integer);
drop function if exists public.commerce_order_snapshot(text);
drop function if exists public.commerce_apply_payment_event(text, text, text, text, text, text, bigint, text, jsonb, text);
drop function if exists public.commerce_release_order(uuid, text, text);
drop function if exists public.commerce_attach_snap(uuid, text, text);
drop function if exists public.commerce_create_checkout(text, text, text, jsonb, jsonb);
drop function if exists public.commerce_cart_snapshot(text);
drop function if exists public.commerce_set_cart_item(text, timestamptz, text, integer);

