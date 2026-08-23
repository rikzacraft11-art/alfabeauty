import assert from "node:assert/strict";
import test from "node:test";
import { resolveProductRoleAccess } from "../src/features/catalog/lib/role-pricing.ts";

const mockRetailProduct = {
  id: "moisture-shampoo",
  name: "Moisture Nutritive Shampoo",
  brand: "Alfaparf Milano Professional",
  category: "hair-care",
  audience: "both",
  description: "Hydrating shampoo for normal to dry hair",
  msrp: 250000,
  salonPrice: 162500, // 35% discount
  distributorPrice: 125000, // 50% discount
  canBuyRetail: true,
  isPriceApproved: true,
  stockStatus: "ready",
  bpomNumber: "NA18231000123",
};

const mockChemicalProduct = {
  id: "control-base-perm",
  name: "CORE Control Base CMC Equalizer",
  brand: "CORE",
  category: "treatments",
  audience: "salon",
  description: "Japanese pre-treatment chemical equalizer for digital perm",
  msrp: 450000,
  salonPrice: 292500,
  distributorPrice: 225000,
  canBuyRetail: false,
  isPriceApproved: true,
  stockStatus: "ready",
  bpomNumber: "NA18231000456",
  sopUrl: "/docs/sop/sop-core-chemical.pdf",
};

const mockUnapprovedProduct = {
  id: "new-experimental-elixir",
  name: "Experimental Diamond Elixir",
  brand: "Montibello",
  category: "hair-care",
  audience: "salon",
  description: "Formula awaiting owner price ACC",
  msrp: 350000,
  salonPrice: 227500,
  distributorPrice: 175000,
  isPriceApproved: false, // Belum di-ACC
  canBuyRetail: true,
};

test("Guest sees MSRP if C1 enabled, but net price is hidden and direct buy is locked", () => {
  const result = resolveProductRoleAccess(mockRetailProduct, "guest", {
    showMsrpToGuests: true,
    minOpeningOrderSalon: 1500000,
    pointsPer500k: 5000,
    maxConsumerDiscountPercent: 10,
  });

  assert.equal(result.canViewMsrp, true);
  assert.equal(result.canViewNetPrice, false);
  assert.equal(result.canDirectBuy, false);
  assert.equal(result.ctaType, "login_required");
  assert.match(result.formattedEffectivePrice, /250\.000/);
});

test("Consumer can buy retail-whitelist SKUs at MSRP but NEVER sees salon net price", () => {
  const result = resolveProductRoleAccess(mockRetailProduct, "consumer");

  assert.equal(result.canViewMsrp, true);
  assert.equal(result.canViewNetPrice, false);
  assert.equal(result.canDirectBuy, true);
  assert.equal(result.ctaType, "buy");
  assert.equal(result.isRestrictedForRole, false);
  assert.match(result.formattedEffectivePrice, /250\.000/);
});

test("Consumer viewing professional chemical SKU is restricted with safety advice (Blueprint M1 & B7)", () => {
  const result = resolveProductRoleAccess(mockChemicalProduct, "consumer");

  assert.equal(result.canViewNetPrice, false);
  assert.equal(result.canDirectBuy, false);
  assert.equal(result.isRestrictedForRole, true);
  assert.equal(result.ctaType, "professional_service_only");
  assert.match(result.restrictionReason, /salon/i);
});

test("Verified Salon partner sees net wholesale price, discount anchor, loyalty points, and SOP access (Blueprint D2)", () => {
  const result = resolveProductRoleAccess(mockRetailProduct, "salon_verified");

  assert.equal(result.canViewMsrp, true);
  assert.equal(result.canViewNetPrice, true);
  assert.equal(result.canDirectBuy, true);
  assert.equal(result.effectivePrice, 162500);
  assert.match(result.formattedNetPrice, /162\.500/);
  assert.equal(result.discountPercent, 35);
  assert.equal(result.technicalAccessLevel, "professional_sop");
});

test("Verified Distributor partner sees distributor net price and wholesale tier (Blueprint D2)", () => {
  const result = resolveProductRoleAccess(mockRetailProduct, "distributor_verified");

  assert.equal(result.canViewNetPrice, true);
  assert.equal(result.canDirectBuy, true);
  assert.equal(result.effectivePrice, 125000);
  assert.match(result.formattedNetPrice, /125\.000/);
  assert.equal(result.discountPercent, 50);
});

test("Unapproved price SKU displays 'Hubungi Kami' and locks direct checkout (Blueprint Principle A5)", () => {
  const result = resolveProductRoleAccess(mockUnapprovedProduct, "salon_verified");

  assert.equal(result.isPriceApproved, false);
  assert.equal(result.canDirectBuy, false);
  assert.equal(result.formattedEffectivePrice, "Hubungi Kami");
  assert.equal(result.ctaType, "contact_sales");
});
