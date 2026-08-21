import { createHash } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { basename, resolve } from "node:path";
import { getCliClient } from "sanity/cli";
import {
  categories,
  products,
  type Product,
} from "../../src/features/brands/components/product-data";

const API_VERSION = "2026-08-20";
const WRITE_CONFIRMATION = "--confirm-production-demo-seed";
const dryRun = process.argv.includes("--dry-run");
const confirmed = process.argv.includes(WRITE_CONFIRMATION);

async function main(): Promise<void> {
const client = getCliClient({ apiVersion: API_VERSION });
const { dataset, projectId } = client.config();

if (!projectId || !dataset) {
  throw new Error("Sanity project and dataset must be configured before seeding.");
}
if (!dryRun && dataset === "production" && !confirmed) {
  throw new Error(
    `Refusing to seed production without ${WRITE_CONFIRMATION}. Run with --dry-run first.`,
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stableKey(value: string): string {
  return createHash("sha1").update(value).digest("hex").slice(0, 16);
}

function productId(product: Product): string {
  return product.commerceProductId ?? `demo.${slugify(product.id)}`;
}

function variantId(product: Product, label: string): string {
  return `${productId(product)}.${slugify(label) || "default"}`.slice(0, 96);
}

function localAssetPath(publicPath: string): string {
  const relativePath = publicPath.replace(/^\/+/, "");
  const absolutePath = resolve("public", relativePath);
  const publicRoot = `${resolve("public")}\\`;
  if (!absolutePath.startsWith(publicRoot)) {
    throw new Error(`Asset path escapes public directory: ${publicPath}`);
  }
  return absolutePath;
}

function productAssetPaths(product: Product): string[] {
  return [
    product.image,
    ...(product.gallery ?? []),
    ...(product.infoSlides ?? []).map(({ src }) => src),
    product.heroImage,
  ].filter((value): value is string => Boolean(value));
}

const documentIds = [
  "siteSettings",
  ...new Set(products.map(({ brand }) => `brand.${slugify(brand)}`)),
  ...categories.filter(({ id }) => id !== "all").map(({ id }) => `category.${id}`),
  ...products.map(({ id }) => `product.${slugify(id)}`),
];

const existingIds = new Set(
  await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: documentIds }),
);
const missingProducts = products.filter(
  ({ id }) => !existingIds.has(`product.${slugify(id)}`),
);
const assetPaths = [...new Set(missingProducts.flatMap(productAssetPaths))];
const missingFiles = assetPaths.filter((path) => !existsSync(localAssetPath(path)));

if (missingFiles.length > 0) {
  throw new Error(`Missing ${missingFiles.length} local asset(s): ${missingFiles.join(", ")}`);
}

console.log(
  JSON.stringify({
    mode: dryRun ? "dry-run" : "write",
    projectId,
    dataset,
    existingDocuments: existingIds.size,
    documentsToCreate: documentIds.length - existingIds.size,
    productsToCreate: missingProducts.length,
    assetsToUpload: assetPaths.length,
  }),
);

if (dryRun) return;

const assetRefs = new Map<string, string>();
let uploaded = 0;

async function uploadAsset(publicPath: string): Promise<void> {
  const absolutePath = localAssetPath(publicPath);
  const asset = await client.assets.upload("image", createReadStream(absolutePath), {
    filename: basename(absolutePath),
  });
  assetRefs.set(publicPath, asset._id);
  uploaded += 1;
  if (uploaded % 20 === 0 || uploaded === assetPaths.length) {
    console.log(`Uploaded ${uploaded}/${assetPaths.length} assets.`);
  }
}

async function mapWithConcurrency<T>(
  values: T[],
  concurrency: number,
  operation: (value: T) => Promise<void>,
): Promise<void> {
  let index = 0;
  async function worker(): Promise<void> {
    while (index < values.length) {
      const current = values[index];
      index += 1;
      await operation(current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
}

await mapWithConcurrency(assetPaths, 4, uploadAsset);

const localizedString = (value: string) => ({
  _type: "localizedString",
  id: value,
  en: value,
});
const localizedText = (value: string) => ({
  _type: "localizedText",
  id: value,
  en: value,
});
const reference = (_ref: string, key?: string) => ({
  _type: "reference",
  _ref,
  ...(key ? { _key: key } : {}),
});
const accessibleImage = (path: string, alt: string, key?: string) => ({
  _type: "accessibleImage",
  ...(key ? { _key: key } : {}),
  asset: reference(assetRefs.get(path) ?? ""),
  alt: localizedString(alt),
});
const reviewedAt = new Date().toISOString();
const sourceMetadata = {
  _type: "sourceMetadata",
  owner: "Alfa Beauty demo catalog",
  lastReviewedAt: reviewedAt,
  notes: "Seeded from the checked-in MVP catalog. Business review is still required.",
};

const brands = [...new Set(products.map(({ brand }) => brand))].sort();
const brandDocuments = brands.map((name, index) => {
  const slug = slugify(name);
  return {
    _id: `brand.${slug}`,
    _type: "brand",
    commerceBrandId: `brand.${slug}`,
    name,
    slug: { _type: "slug", current: slug },
    status: "active",
    displayOrder: (index + 1) * 10,
    sourceMetadata,
  };
});

const categoryDocuments = categories
  .filter(({ id }) => id !== "all")
  .map(({ id, label }, index) => ({
    _id: `category.${id}`,
    _type: "productCategory",
    title: localizedString(label),
    slug: { _type: "slug", current: id },
    status: "active",
    displayOrder: (index + 1) * 10,
  }));

const productDocuments = missingProducts.map((product, index) => {
  if (!product.image) throw new Error(`Product ${product.id} has no primary image.`);
  const variants = product.commerceVariants ??
    (product.variants?.length ? product.variants : ["Default"]).map((label) => ({
      id: variantId(product, label),
      label,
    }));

  return {
    _id: `product.${slugify(product.id)}`,
    _type: "productContent",
    commerceProductId: productId(product),
    slug: { _type: "slug", current: slugify(product.id) },
    name: localizedString(product.name),
    brand: reference(`brand.${slugify(product.brand)}`),
    category: reference(`category.${product.category}`),
    audience: product.audience,
    shortDescription: localizedText(product.description),
    ...(product.longDescription
      ? { longDescription: localizedText(product.longDescription) }
      : {}),
    ...(product.howToUse ? { howToUse: localizedText(product.howToUse) } : {}),
    ...(product.keyBenefits?.length
      ? {
          keyBenefits: product.keyBenefits.map((value) => ({
            ...localizedString(value),
            _key: stableKey(`benefit:${value}`),
          })),
        }
      : {}),
    ...(product.recommendedFor?.length
      ? {
          recommendedFor: product.recommendedFor.map((value) => ({
            ...localizedString(value),
            _key: stableKey(`recommended:${value}`),
          })),
        }
      : {}),
    variants: variants.map(({ id, label }) => ({
      _type: "productVariantContent",
      _key: stableKey(`variant:${id}`),
      commerceVariantId: id,
      label: localizedString(label),
    })),
    heroImage: accessibleImage(product.image, product.name),
    ...(product.gallery?.length
      ? {
          gallery: product.gallery.map((path, imageIndex) =>
            accessibleImage(
              path,
              `${product.name} gallery image ${imageIndex + 1}`,
              stableKey(`gallery:${path}`),
            ),
          ),
        }
      : {}),
    ...(product.infoSlides?.length
      ? {
          infoSlides: product.infoSlides.map(({ type, src }, slideIndex) => ({
            _type: "infoSlide",
            _key: stableKey(`slide:${type}:${src}`),
            type,
            image: accessibleImage(
              src,
              `${product.name} ${type} information ${slideIndex + 1}`,
            ),
          })),
        }
      : {}),
    ...(product.heroImage
      ? { heroBrandImage: accessibleImage(product.heroImage, `${product.brand} product line`) }
      : {}),
    ...(product.relatedIds?.length
      ? {
          relatedProducts: product.relatedIds.map((id) =>
            reference(`product.${slugify(id)}`, stableKey(`related:${slugify(id)}`)),
          ),
        }
      : {}),
    isNew: product.isNew ?? false,
    status: "active",
    displayOrder: (index + 1) * 10,
    sourceMetadata,
    seo: {
      _type: "seo",
      title: localizedString(`${product.name} | Alfa Beauty`),
      description: localizedText(product.description),
      noIndex: false,
    },
  };
});

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteTitle: "Alfa Beauty",
  catalogNotice: localizedText(
    "Katalog MVP untuk demonstrasi. Harga, stok, dan transaksi masih menggunakan mode demo.",
  ),
  sourceMetadata,
};

const documents: Array<{ _id: string; _type: string; [key: string]: unknown }> = [
  ...brandDocuments,
  ...categoryDocuments,
  ...productDocuments,
  siteSettings,
].filter(({ _id }) => !existingIds.has(_id));

let transaction = client.transaction();
for (const document of documents) transaction = transaction.createIfNotExists(document);
await transaction.commit({ visibility: "sync" });

console.log(
  JSON.stringify({
    createdDocuments: documents.length,
    uploadedAssets: assetPaths.length,
    legacyDocumentsPreserved: true,
  }),
);
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
