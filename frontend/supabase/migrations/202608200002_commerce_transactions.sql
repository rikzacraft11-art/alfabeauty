-- Transactional RPCs. They are callable only with the server-side service role.

create or replace function public.commerce_set_cart_item(
  p_guest_token_hash text,
  p_session_expires_at timestamptz,
  p_variant_id text,
  p_quantity integer
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_guest_id uuid;
  v_cart_id uuid;
  v_stock integer;
begin
  if p_guest_token_hash !~ '^[a-f0-9]{64}$' or p_session_expires_at <= now() then
    raise exception 'invalid guest session';
  end if;
  if p_quantity < 0 or p_quantity > 20 then
    raise exception 'invalid quantity';
  end if;

  insert into public.commerce_guest_sessions (token_hash, expires_at)
  values (p_guest_token_hash, p_session_expires_at)
  on conflict (token_hash) do update
    set last_seen_at = now(),
        expires_at = greatest(public.commerce_guest_sessions.expires_at, excluded.expires_at)
  returning id into v_guest_id;

  insert into public.commerce_carts (guest_session_id)
  values (v_guest_id)
  on conflict (guest_session_id) where status = 'open' do update
    set updated_at = now()
  returning id into v_cart_id;

  if p_quantity = 0 then
    delete from public.commerce_cart_items
    where cart_id = v_cart_id and commerce_variant_id = p_variant_id;
    update public.commerce_carts set updated_at = now() where id = v_cart_id;
    return v_cart_id;
  end if;

  select stock_on_hand into v_stock
  from public.commerce_offers
  where commerce_variant_id = p_variant_id and active = true
  for update;

  if v_stock is null then raise exception 'offer unavailable'; end if;
  if p_quantity > v_stock then raise exception 'insufficient stock'; end if;

  insert into public.commerce_cart_items (cart_id, commerce_variant_id, quantity)
  values (v_cart_id, p_variant_id, p_quantity)
  on conflict (cart_id, commerce_variant_id) do update
    set quantity = excluded.quantity, updated_at = now();

  update public.commerce_carts set updated_at = now() where id = v_cart_id;
  return v_cart_id;
end;
$$;

create or replace function public.commerce_cart_snapshot(p_guest_token_hash text)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with selected_cart as (
    select c.id
    from public.commerce_carts c
    join public.commerce_guest_sessions s on s.id = c.guest_session_id
    where s.token_hash = p_guest_token_hash
      and s.expires_at > now()
      and c.status = 'open'
    limit 1
  ), lines as (
    select
      i.commerce_variant_id,
      o.commerce_product_id,
      o.sku,
      o.display_name,
      o.variant_label,
      o.price_idr,
      o.stock_on_hand,
      o.active,
      i.quantity,
      i.quantity * o.price_idr as line_total_idr
    from public.commerce_cart_items i
    join selected_cart c on c.id = i.cart_id
    join public.commerce_offers o on o.commerce_variant_id = i.commerce_variant_id
    order by i.created_at
  )
  select jsonb_build_object(
    'items', coalesce(jsonb_agg(to_jsonb(lines)), '[]'::jsonb),
    'subtotalIdr', coalesce(sum(line_total_idr), 0),
    'itemCount', coalesce(sum(quantity), 0)
  )
  from lines;
$$;

create or replace function public.commerce_create_checkout(
  p_guest_token_hash text,
  p_idempotency_key text,
  p_public_token_hash text,
  p_customer jsonb,
  p_shipping_address jsonb
) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_existing public.commerce_orders%rowtype;
  v_guest_id uuid;
  v_cart_id uuid;
  v_order_id uuid := gen_random_uuid();
  v_order_number text := 'ALFA-' || upper(substr(replace(v_order_id::text, '-', ''), 1, 20));
  v_subtotal bigint := 0;
  v_line record;
  v_expiry timestamptz := now() + interval '30 minutes';
begin
  if p_guest_token_hash !~ '^[a-f0-9]{64}$'
    or p_public_token_hash !~ '^[a-f0-9]{64}$'
    or char_length(p_idempotency_key) not between 16 and 128 then
    raise exception 'invalid checkout identity';
  end if;

  perform pg_advisory_xact_lock(hashtext(p_idempotency_key));
  select * into v_existing
  from public.commerce_orders
  where idempotency_key = p_idempotency_key;
  if found then
    return jsonb_build_object(
      'orderId', v_existing.id,
      'orderNumber', v_existing.order_number,
      'midtransOrderId', v_existing.midtrans_order_id,
      'totalIdr', v_existing.total_idr,
      'status', v_existing.status,
      'snapToken', v_existing.snap_token,
      'snapRedirectUrl', v_existing.snap_redirect_url,
      'expiresAt', v_existing.expires_at
    );
  end if;

  select id into v_guest_id
  from public.commerce_guest_sessions
  where token_hash = p_guest_token_hash and expires_at > now()
  for update;
  if v_guest_id is null then raise exception 'guest session unavailable'; end if;

  select id into v_cart_id
  from public.commerce_carts
  where guest_session_id = v_guest_id and status = 'open'
  for update;
  if v_cart_id is null then raise exception 'cart unavailable'; end if;

  for v_line in
    select i.quantity, o.*
    from public.commerce_cart_items i
    join public.commerce_offers o on o.commerce_variant_id = i.commerce_variant_id
    where i.cart_id = v_cart_id
    order by i.commerce_variant_id
    for update of o
  loop
    if not v_line.active then raise exception 'offer unavailable: %', v_line.commerce_variant_id; end if;
    if v_line.quantity > v_line.stock_on_hand then raise exception 'insufficient stock: %', v_line.commerce_variant_id; end if;
    v_subtotal := v_subtotal + (v_line.quantity * v_line.price_idr);
  end loop;

  if v_subtotal <= 0 then raise exception 'cart is empty'; end if;

  insert into public.commerce_orders (
    id, order_number, midtrans_order_id, guest_session_id, public_token_hash,
    idempotency_key, subtotal_idr, total_idr, customer, shipping_address, expires_at
  ) values (
    v_order_id, v_order_number, v_order_number, v_guest_id, p_public_token_hash,
    p_idempotency_key, v_subtotal, v_subtotal, p_customer, p_shipping_address, v_expiry
  );

  insert into public.commerce_order_items (
    order_id, commerce_product_id, commerce_variant_id, sku, product_name,
    variant_label, quantity, unit_price_idr, line_total_idr, offer_version
  )
  select
    v_order_id, o.commerce_product_id, o.commerce_variant_id, o.sku,
    o.display_name, o.variant_label, i.quantity, o.price_idr,
    i.quantity * o.price_idr, o.version
  from public.commerce_cart_items i
  join public.commerce_offers o on o.commerce_variant_id = i.commerce_variant_id
  where i.cart_id = v_cart_id;

  update public.commerce_offers o
  set stock_on_hand = o.stock_on_hand - i.quantity,
      version = o.version + 1,
      updated_at = now()
  from public.commerce_cart_items i
  where i.cart_id = v_cart_id and i.commerce_variant_id = o.commerce_variant_id;

  insert into public.commerce_inventory_reservations (
    order_id, commerce_variant_id, quantity, expires_at
  )
  select v_order_id, commerce_variant_id, quantity, v_expiry
  from public.commerce_cart_items
  where cart_id = v_cart_id;

  update public.commerce_carts set status = 'converted', updated_at = now() where id = v_cart_id;

  return jsonb_build_object(
    'orderId', v_order_id,
    'orderNumber', v_order_number,
    'midtransOrderId', v_order_number,
    'totalIdr', v_subtotal,
    'status', 'awaiting_payment',
    'expiresAt', v_expiry
  );
end;
$$;

create or replace function public.commerce_attach_snap(
  p_order_id uuid,
  p_snap_token text,
  p_snap_redirect_url text
) returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.commerce_orders
  set snap_token = p_snap_token,
      snap_redirect_url = p_snap_redirect_url,
      updated_at = now()
  where id = p_order_id and status = 'awaiting_payment';
  if not found then raise exception 'order unavailable'; end if;
end;
$$;

create or replace function public.commerce_release_order(
  p_order_id uuid,
  p_target_status text,
  p_payment_status text
) returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_target_status not in ('payment_failed', 'expired', 'cancelled') then
    raise exception 'invalid release status';
  end if;

  perform 1 from public.commerce_orders where id = p_order_id for update;
  if not found then raise exception 'order unavailable'; end if;

  update public.commerce_offers o
  set stock_on_hand = o.stock_on_hand + r.quantity,
      version = o.version + 1,
      updated_at = now()
  from public.commerce_inventory_reservations r
  where r.order_id = p_order_id
    and r.status = 'reserved'
    and r.commerce_variant_id = o.commerce_variant_id;

  update public.commerce_inventory_reservations
  set status = 'released', updated_at = now()
  where order_id = p_order_id and status = 'reserved';

  update public.commerce_orders
  set status = p_target_status,
      payment_status = p_payment_status,
      updated_at = now()
  where id = p_order_id and status = 'awaiting_payment';
end;
$$;

create or replace function public.commerce_apply_payment_event(
  p_midtrans_order_id text,
  p_provider_event_key text,
  p_transaction_id text,
  p_transaction_status text,
  p_status_code text,
  p_fraud_status text,
  p_gross_amount_idr bigint,
  p_payload_hash text,
  p_normalized_payload jsonb,
  p_target_status text
) returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_order public.commerce_orders%rowtype;
begin
  insert into public.commerce_payment_events (
    provider_event_key, midtrans_order_id, transaction_id, transaction_status,
    status_code, fraud_status, gross_amount_idr, payload_hash, normalized_payload
  ) values (
    p_provider_event_key, p_midtrans_order_id, p_transaction_id, p_transaction_status,
    p_status_code, p_fraud_status, p_gross_amount_idr, p_payload_hash, p_normalized_payload
  ) on conflict (provider_event_key) do nothing;

  if not found then return 'duplicate'; end if;

  select * into v_order
  from public.commerce_orders
  where midtrans_order_id = p_midtrans_order_id
  for update;

  if not found then
    update public.commerce_payment_events
    set processing_result = 'unknown_order', processed_at = now()
    where provider_event_key = p_provider_event_key;
    return 'unknown_order';
  end if;

  if v_order.total_idr <> p_gross_amount_idr then
    update public.commerce_payment_events
    set processing_result = 'amount_mismatch', processed_at = now()
    where provider_event_key = p_provider_event_key;
    return 'amount_mismatch';
  end if;

  if p_target_status = 'paid' and v_order.status = 'awaiting_payment' then
    update public.commerce_orders
    set status = 'paid', payment_status = 'paid', paid_at = now(), updated_at = now()
    where id = v_order.id;
    update public.commerce_inventory_reservations
    set status = 'captured', updated_at = now()
    where order_id = v_order.id and status = 'reserved';
  elsif p_target_status in ('payment_failed', 'expired', 'cancelled')
    and v_order.status = 'awaiting_payment' then
    perform public.commerce_release_order(
      v_order.id,
      p_target_status,
      case p_target_status
        when 'payment_failed' then 'denied'
        when 'expired' then 'expired'
        else 'cancelled'
      end
    );
  end if;

  update public.commerce_payment_events
  set processing_result = case
        when v_order.status = 'paid' and p_target_status <> 'paid' then 'ignored_after_paid'
        else 'processed'
      end,
      processed_at = now()
  where provider_event_key = p_provider_event_key;
  return 'processed';
end;
$$;

create or replace function public.commerce_order_snapshot(p_public_token_hash text)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'orderId', o.id,
    'orderNumber', o.order_number,
    'status', o.status,
    'paymentStatus', o.payment_status,
    'subtotalIdr', o.subtotal_idr,
    'shippingIdr', o.shipping_idr,
    'taxIdr', o.tax_idr,
    'totalIdr', o.total_idr,
    'customerName', o.customer->>'name',
    'expiresAt', o.expires_at,
    'createdAt', o.created_at,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'commerceProductId', i.commerce_product_id,
        'commerceVariantId', i.commerce_variant_id,
        'sku', i.sku,
        'productName', i.product_name,
        'variantLabel', i.variant_label,
        'quantity', i.quantity,
        'unitPriceIdr', i.unit_price_idr,
        'lineTotalIdr', i.line_total_idr
      ) order by i.created_at)
      from public.commerce_order_items i where i.order_id = o.id
    ), '[]'::jsonb)
  )
  from public.commerce_orders o
  where o.public_token_hash = p_public_token_hash
  limit 1;
$$;

create or replace function public.commerce_consume_rate_limit(
  p_action text,
  p_identifier_hash text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_row public.commerce_rate_limits%rowtype;
begin
  if p_identifier_hash !~ '^[a-f0-9]{64}$'
    or p_limit < 1 or p_window_seconds < 1 or char_length(p_action) > 64 then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtext(p_action || ':' || p_identifier_hash));
  select * into v_row from public.commerce_rate_limits
  where action = p_action and identifier_hash = p_identifier_hash;

  if not found or v_row.window_started_at <= now() - make_interval(secs => p_window_seconds) then
    insert into public.commerce_rate_limits (action, identifier_hash, window_started_at, request_count)
    values (p_action, p_identifier_hash, now(), 1)
    on conflict (action, identifier_hash) do update
      set window_started_at = excluded.window_started_at, request_count = 1;
    return true;
  end if;

  if v_row.request_count >= p_limit then return false; end if;
  update public.commerce_rate_limits
  set request_count = request_count + 1
  where action = p_action and identifier_hash = p_identifier_hash;
  return true;
end;
$$;

create or replace function public.commerce_expire_orders(p_limit integer default 100)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_count integer := 0;
begin
  if p_limit < 1 or p_limit > 1000 then raise exception 'invalid expiry batch size'; end if;
  for v_order_id in
    select id from public.commerce_orders
    where status = 'awaiting_payment' and expires_at <= now()
    order by expires_at
    limit p_limit
    for update skip locked
  loop
    perform public.commerce_release_order(v_order_id, 'expired', 'expired');
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

revoke execute on function public.commerce_set_cart_item(text, timestamptz, text, integer) from public, anon, authenticated;
revoke execute on function public.commerce_cart_snapshot(text) from public, anon, authenticated;
revoke execute on function public.commerce_create_checkout(text, text, text, jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.commerce_attach_snap(uuid, text, text) from public, anon, authenticated;
revoke execute on function public.commerce_release_order(uuid, text, text) from public, anon, authenticated;
revoke execute on function public.commerce_apply_payment_event(text, text, text, text, text, text, bigint, text, jsonb, text) from public, anon, authenticated;
revoke execute on function public.commerce_order_snapshot(text) from public, anon, authenticated;
revoke execute on function public.commerce_consume_rate_limit(text, text, integer, integer) from public, anon, authenticated;
revoke execute on function public.commerce_expire_orders(integer) from public, anon, authenticated;

grant execute on function public.commerce_set_cart_item(text, timestamptz, text, integer) to service_role;
grant execute on function public.commerce_cart_snapshot(text) to service_role;
grant execute on function public.commerce_create_checkout(text, text, text, jsonb, jsonb) to service_role;
grant execute on function public.commerce_attach_snap(uuid, text, text) to service_role;
grant execute on function public.commerce_release_order(uuid, text, text) to service_role;
grant execute on function public.commerce_apply_payment_event(text, text, text, text, text, text, bigint, text, jsonb, text) to service_role;
grant execute on function public.commerce_order_snapshot(text) to service_role;
grant execute on function public.commerce_consume_rate_limit(text, text, integer, integer) to service_role;
grant execute on function public.commerce_expire_orders(integer) to service_role;
