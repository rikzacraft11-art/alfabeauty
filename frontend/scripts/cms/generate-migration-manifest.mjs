import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { products, categories } from "../../src/features/brands/components/product-data.ts";

const outputDirectory = resolve(".artifacts/cms");
const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const productId = (product) => product.commerceProductId ?? `demo.${slugify(product.id)}`;
const variantId = (product, label) => `${productId(product)}.${slugify(label) || "default"}`.slice(0, 96);
const price = (seed) => {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return 125000 + (hash % 12) * 25000;
};
const csv = (value) => `"${String(value).replaceAll('"', '""')}"`;

const duplicateSlugs = products.filter((product, index) => products.findIndex((item) => slugify(item.id) === slugify(product.id)) !== index);
if (duplicateSlugs.length) throw new Error(`Duplicate product slugs: ${duplicateSlugs.map(({ id }) => id).join(", ")}`);

const brandNames = [...new Set(products.map(({ brand }) => brand))].sort();
const categoryRows = categories.filter(({ id }) => id !== "all");
const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  authority: { editorial: "Sanity", commerce: "Supabase", priceUnit: "integer IDR" },
  counts: { products: products.length, brands: brandNames.length, categories: categoryRows.length },
  brands: brandNames.map((name) => ({ _id: `brand.${slugify(name)}`, _type: "brand", commerceBrandId: `brand.${slugify(name)}`, name, status: "draft" })),
  categories: categoryRows.map(({ id, label }) => ({ _id: `category.${id}`, _type: "productCategory", title: { id: label, en: label }, slug: { current: id }, status: "draft", displayOrder: 100 })),
  products: products.map((product) => ({
    _id: `product.${slugify(product.id)}`,
    _type: "productContent",
    commerceProductId: productId(product),
    slug: { current: slugify(product.id) },
    name: { id: product.name, en: product.name },
    brandRef: `brand.${slugify(product.brand)}`,
    categoryRef: `category.${product.category}`,
    audience: product.audience,
    shortDescription: { id: product.description, en: product.description },
    variants: (product.variants?.length ? product.variants : ["Default"]).map((label) => ({ commerceVariantId: variantId(product, label), label: { id: label, en: label } })),
    assetFiles: [product.image, ...(product.gallery ?? []), ...(product.infoSlides ?? []).map(({ src }) => src)].filter(Boolean),
    status: "draft",
    displayOrder: 100,
    sourceMetadata: { owner: "PENDING_BUSINESS_SIGN_OFF", lastReviewedAt: null },
  })),
};

const offers = products.flatMap((product) => (product.variants?.length ? product.variants : ["Default"]).map((label, index) => {
  const id = variantId(product, label);
  return {
    commerce_variant_id: id,
    commerce_product_id: productId(product),
    sku: `DEMO-${product.id.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}-${index + 1}`.slice(0, 64),
    display_name: product.name,
    variant_label: label,
    currency: "IDR",
    price_idr: price(id),
    stock_on_hand: 25,
    active: false,
  };
}));

await mkdir(outputDirectory, { recursive: true });
await writeFile(resolve(outputDirectory, "catalog-migration-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
const columns = Object.keys(offers[0]);
await writeFile(resolve(outputDirectory, "commerce-offers.csv"), `${columns.join(",")}\n${offers.map((row) => columns.map((column) => csv(row[column])).join(",")).join("\n")}\n`, "utf8");
console.log(JSON.stringify({ outputDirectory, ...manifest.counts, offers: offers.length }));
