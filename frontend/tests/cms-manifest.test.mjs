import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const manifest = JSON.parse(await readFile(new URL("../.artifacts/cms/catalog-migration-manifest.json", import.meta.url), "utf8"));
const csv = await readFile(new URL("../.artifacts/cms/commerce-offers.csv", import.meta.url), "utf8");

test("migration manifest reconciles the complete fallback catalog", () => {
  assert.deepEqual(manifest.counts, { products: 50, brands: 5, categories: 6 });
  assert.equal(new Set(manifest.products.map(({ commerceProductId }) => commerceProductId)).size, 50);
  assert.equal(manifest.products.every(({ status }) => status === "draft"), true);
  assert.equal(manifest.products.every((product) => !("price" in product) && !("stock" in product)), true);
});

test("commerce seed has one header plus 90 inactive offers", () => {
  const lines = csv.trim().split(/\r?\n/);
  assert.equal(lines.length, 91);
  assert.match(lines[0], /price_idr,stock_on_hand,active/);
  assert.equal(lines.slice(1).every((line) => line.endsWith('"false"')), true);
});

