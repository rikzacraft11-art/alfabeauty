import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const core = await readFile(new URL("../supabase/migrations/202608200001_commerce_core.sql", import.meta.url), "utf8");
const transactions = await readFile(new URL("../supabase/migrations/202608200002_commerce_transactions.sql", import.meta.url), "utf8");
const rollbackCore = await readFile(new URL("../supabase/rollback/202608200001_commerce_core.down.sql", import.meta.url), "utf8");
const rollbackTransactions = await readFile(new URL("../supabase/rollback/202608200002_commerce_transactions.down.sql", import.meta.url), "utf8");

test("commerce migration does not duplicate Sanity editorial tables", () => {
  assert.doesNotMatch(core, /create table if not exists public\.(products|product_categories|product_brands)\b/i);
  assert.match(core, /create table if not exists public\.commerce_offers/i);
});

test("all confidential commerce tables enable RLS and revoke browser roles", () => {
  for (const table of [
    "commerce_guest_sessions",
    "commerce_carts",
    "commerce_cart_items",
    "commerce_orders",
    "commerce_order_items",
    "commerce_inventory_reservations",
    "commerce_payment_events",
  ]) {
    assert.match(core, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
    assert.match(core, new RegExp(`revoke all on table public\\.${table} from anon, authenticated`, "i"));
  }
});

test("money, snapshots, idempotency, and reservations are database constraints", () => {
  assert.match(core, /currency = 'IDR'/);
  assert.match(core, /total_idr = subtotal_idr \+ shipping_idr \+ tax_idr/);
  assert.match(core, /idempotency_key text not null unique/);
  assert.match(core, /line_total_idr = unit_price_idr \* quantity/);
  assert.match(transactions, /for update of o/);
  assert.match(transactions, /pg_advisory_xact_lock\(hashtext\(p_idempotency_key\)\)/);
  assert.match(transactions, /on conflict \(guest_session_id\) where status = 'open'/);
  assert.match(transactions, /on conflict \(provider_event_key\) do nothing/);
  assert.match(transactions, /for update skip locked/);
  assert.match(transactions, /commerce_expire_orders/);
});

test("ordered rollback removes functions before tables", () => {
  assert.match(rollbackTransactions, /drop function if exists public\.commerce_create_checkout/);
  assert.match(rollbackCore, /drop table if exists public\.commerce_orders/);
  assert.doesNotMatch(rollbackTransactions, /drop table/i);
});

test("transaction functions are invoker security and service-role only", () => {
  assert.doesNotMatch(transactions, /security definer/i);
  assert.match(transactions, /security invoker/g);
  assert.match(transactions, /revoke execute on function public\.commerce_create_checkout/);
  assert.match(transactions, /grant execute on function public\.commerce_create_checkout[^;]+service_role/s);
});
