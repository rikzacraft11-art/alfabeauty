import assert from "node:assert/strict";
import test from "node:test";
import {
  formatIdr,
  mapMidtransStatus,
  mapVerifiedMidtransStatus,
  parseMidtransAmount,
  stableDemoPrice,
  stableVariantId,
} from "../src/shared/lib/commerce/core.ts";
import {
  createMidtransSignature,
  signaturesMatch,
} from "../src/shared/lib/commerce/midtrans-crypto.ts";
import { checkoutSchema } from "../src/shared/lib/commerce/contracts.ts";

test("IDR stays an integer currency contract", () => {
  assert.equal(parseMidtransAmount("150000.00"), 150000);
  assert.throws(() => parseMidtransAmount("150000.50"));
  assert.match(formatIdr(150000), /150\.000/);
});

test("Midtrans transitions never downgrade unknown or challenged states to paid", () => {
  assert.equal(mapMidtransStatus("settlement"), "paid");
  assert.equal(mapMidtransStatus("capture", "accept"), "paid");
  assert.equal(mapMidtransStatus("capture", "challenge"), "pending");
  assert.equal(mapMidtransStatus("pending"), "pending");
  assert.equal(mapMidtransStatus("expire"), "expired");
  assert.equal(mapMidtransStatus("deny"), "payment_failed");
  assert.equal(mapVerifiedMidtransStatus("500", "settlement"), "pending");
  assert.equal(mapVerifiedMidtransStatus("200", "settlement"), "paid");
});

test("Midtrans signatures use the documented field order and reject tampering", () => {
  const args = {
    orderId: "ALFA-TEST-1",
    statusCode: "200",
    grossAmount: "150000.00",
    serverKey: "SB-Mid-server-test",
  };
  const signature = createMidtransSignature(args);
  assert.equal(signature.length, 128);
  assert.equal(signaturesMatch(signature, signature.toUpperCase()), true);
  assert.equal(signaturesMatch(signature, createMidtransSignature({ ...args, grossAmount: "1.00" })), false);
});

test("checkout accepts UUID idempotency and rejects client price fields", () => {
  const valid = checkoutSchema.parse({
    idempotencyKey: "8b929a08-b62a-4b53-ab17-9e012c5fbef8",
    customer: { name: "Demo Buyer", email: "demo@example.com", phone: "+628123456789" },
    shippingAddress: {
      street: "Jl. Demo 1",
      city: "Jakarta",
      province: "DKI Jakarta",
      postalCode: "10110",
      country: "ID",
    },
    totalIdr: 1,
  });
  assert.equal("totalIdr" in valid, false);
  assert.equal(checkoutSchema.safeParse({ ...valid, idempotencyKey: "weak" }).success, false);
});

test("demo identifiers and prices are deterministic", () => {
  assert.equal(stableDemoPrice("demo.control-base.500ml"), stableDemoPrice("demo.control-base.500ml"));
  assert.equal(stableVariantId("demo.control-base", "500 ml"), "demo.control-base.500-ml");
});
