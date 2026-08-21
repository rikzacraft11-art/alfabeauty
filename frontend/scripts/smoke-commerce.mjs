import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const baseUrl = (process.argv[2] || process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const origin = new URL(baseUrl).origin;
let cookie = "";

async function request(path, init = {}) {
  const headers = new Headers(init.headers);
  if (cookie) headers.set("Cookie", cookie);
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers, redirect: "manual" });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";", 1)[0];
  return response;
}

const detail = await request("/shop/control-base");
assert.equal(detail.status, 200);
assert.match(await detail.text(), /Demo offer/);

const crossOrigin = await request("/api/commerce/cart", {
  method: "POST",
  headers: { Origin: "https://evil.example", "Content-Type": "application/json" },
  body: JSON.stringify({ commerceVariantId: "demo.control-base.500ml", quantity: 1 }),
});
assert.equal(crossOrigin.status, 409);

const add = await request("/api/commerce/cart", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ commerceVariantId: "demo.control-base.500ml", quantity: 2, priceIdr: 1 }),
});
assert.equal(add.status, 200);
const added = await add.json();
assert.equal(added.cart.itemCount, 2);
assert.notEqual(added.cart.subtotalIdr, 1);
assert.ok(cookie.startsWith("alfa_guest="));

const idempotencyKey = randomUUID();
const checkoutPayload = {
  idempotencyKey,
  customer: { name: "Demo Buyer", email: "demo@example.com", phone: "+628123456789" },
  shippingAddress: {
    street: "Jl. Demo 1",
    city: "Jakarta",
    province: "DKI Jakarta",
    postalCode: "10110",
    country: "ID",
  },
  totalIdr: 1,
};
const checkoutRequest = () => request("/api/commerce/checkout", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify(checkoutPayload),
});
const firstCheckout = await checkoutRequest();
assert.equal(firstCheckout.status, 200);
const first = (await firstCheckout.json()).checkout;
assert.equal(first.paymentMode, "demo");
assert.notEqual(first.totalIdr, 1);

const retryCheckout = await checkoutRequest();
assert.equal(retryCheckout.status, 200);
const retry = (await retryCheckout.json()).checkout;
assert.equal(retry.orderNumber, first.orderNumber);

const before = await request(`/order/${first.orderToken}`);
assert.equal(before.status, 200);
assert.match(await before.text(), /Awaiting payment/);

const fakePayment = await request("/api/commerce/demo-payment", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ orderToken: randomUUID() }),
});
assert.equal(fakePayment.status, 404);

const payment = await request("/api/commerce/demo-payment", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ orderToken: first.orderToken }),
});
assert.equal(payment.status, 200);
assert.equal((await payment.json()).order.status, "paid");

const after = await request(`/order/${first.orderToken}`);
assert.equal(after.status, 200);
assert.match(await after.text(), /Payment confirmed/);

console.log(JSON.stringify({
  ok: true,
  baseUrl,
  orderNumber: first.orderNumber,
  serverTotalIdr: first.totalIdr,
  checks: ["same-origin", "opaque-cookie", "server-price", "idempotency", "private-token", "demo-payment"],
}));

