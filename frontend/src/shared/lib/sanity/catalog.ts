import "server-only";

import { cache } from "react";
import { z } from "zod";
import {
  audienceFilters as fallbackAudienceFilters,
  brandFilters as fallbackBrandFilters,
  categories as fallbackCategories,
  products as fallbackProducts,
  type Product,
  type ProductListItem,
} from "@/features/brands/components/product-data";
import { logError, logWarn } from "@/shared/lib/logger";
import type { CatalogProductsQueryResult } from "@/shared/types/sanity.generated";
import { getSanityContentMode, isSanityConfigured } from "./env";
import { sanityFetch, sanityFetchPublished } from "./client";
import {
  catalogProductSlugsQuery,
  catalogProductsQuery,
  siteSettingsQuery,
} from "./queries";

function isSanityCdnUrl(value: string): boolean {
  try {
    return new URL(value).hostname === "cdn.sanity.io";
  } catch {
    return false;
  }
}

const imageUrlSchema = z
  .string()
  .url()
  .refine(isSanityCdnUrl, {
    message: "Image must be hosted on cdn.sanity.io.",
  });

const productSlugListSchema = z.array(
  z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
);

const catalogProductSchema = z.object({
  _id: z.string().min(1),
  commerceProductId: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(200),
  brand: z.string().trim().min(1).max(120),
  category: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryLabel: z.string().trim().min(1).max(120),
  audience: z.enum(["salon", "barber", "both"]),
  description: z.string().trim().min(1).max(2000),
  longDescription: z.string().trim().max(12000).nullish(),
  howToUse: z.string().trim().max(12000).nullish(),
  keyBenefits: z.array(z.object({ value: z.string().trim().min(1).max(500) })).nullish(),
  recommendedFor: z.array(z.object({ value: z.string().trim().min(1).max(500) })).nullish(),
  variants: z
    .array(
      z.object({
        id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{2,95}$/),
        label: z.string().trim().min(1).max(160),
      }),
    )
    .nullish(),
  isNew: z.boolean().nullish(),
  image: imageUrlSchema,
  gallery: z.array(imageUrlSchema).nullish(),
  infoSlides: z
    .array(
      z.object({
        type: z.enum(["description", "features", "benefits", "application", "technology", "ingredients"]),
        src: imageUrlSchema,
      }),
    )
    .nullish(),
  heroImage: imageUrlSchema.nullish(),
  relatedIds: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).nullish(),
  seoTitle: z.string().trim().max(200).nullish(),
  seoDescription: z.string().trim().max(500).nullish(),
  seoImage: imageUrlSchema.nullish(),
  noIndex: z.boolean().nullish(),
});

type CatalogProductRecord = z.infer<typeof catalogProductSchema>;

export type CatalogProduct = Product & {
  commerceProductId?: string;
  categoryLabel?: string;
  seo?: {
    title?: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
  };
};

export type CatalogData = {
  products: CatalogProduct[];
  listItems: ProductListItem[];
  categories: { id: string; label: string }[];
  brandFilters: string[];
  audienceFilters: { id: string; label: string }[];
  source: "sanity" | "fallback";
};

export type SiteSettings = {
  siteTitle?: string;
  catalogNotice?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  noIndex?: boolean;
};

const siteSettingsSchema = z
  .object({
    siteTitle: z.string().trim().min(1).max(100).nullish(),
    catalogNotice: z.string().trim().max(2000).nullish(),
    seoTitle: z.string().trim().max(200).nullish(),
    seoDescription: z.string().trim().max(500).nullish(),
    seoImage: imageUrlSchema.nullish(),
    noIndex: z.boolean().nullish(),
  })
  .nullish();

function mapProduct(record: CatalogProductRecord): CatalogProduct {
  return {
    id: record.slug,
    commerceProductId: record.commerceProductId,
    name: record.name,
    brand: record.brand,
    category: record.category,
    categoryLabel: record.categoryLabel,
    audience: record.audience,
    description: record.description,
    longDescription: record.longDescription ?? undefined,
    howToUse: record.howToUse ?? undefined,
    keyBenefits: record.keyBenefits?.map(({ value }) => value),
    recommendedFor: record.recommendedFor?.map(({ value }) => value),
    variants: record.variants?.map(({ label }) => label),
    commerceVariants: record.variants ?? undefined,
    isNew: record.isNew ?? false,
    image: record.image,
    gallery: record.gallery ?? undefined,
    infoSlides: record.infoSlides ?? undefined,
    heroImage: record.heroImage ?? undefined,
    relatedIds: record.relatedIds ?? undefined,
    seo: {
      title: record.seoTitle ?? undefined,
      description: record.seoDescription ?? undefined,
      image: record.seoImage ?? undefined,
      noIndex: record.noIndex ?? false,
    },
  };
}

function toListItems(products: CatalogProduct[]): ProductListItem[] {
  return products.map(
    ({ id, name, brand, category, audience, description, image, variants, isNew }) => ({
      id,
      name,
      brand,
      category,
      audience,
      description,
      image,
      variants,
      isNew,
    }),
  );
}

function buildCatalogData(products: CatalogProduct[], source: CatalogData["source"]): CatalogData {
  const categoryMap = new Map<string, string>();
  for (const product of products) {
    categoryMap.set(product.category, product.categoryLabel ?? product.category);
  }

  return {
    products,
    listItems: toListItems(products),
    categories: [
      { id: "all", label: "All Products" },
      ...Array.from(categoryMap, ([id, label]) => ({ id, label })).sort((a, b) =>
        a.label.localeCompare(b.label),
      ),
    ],
    brandFilters: Array.from(new Set(products.map(({ brand }) => brand))).sort((a, b) =>
      a.localeCompare(b),
    ),
    audienceFilters: fallbackAudienceFilters,
    source,
  };
}

let fallbackWarningLogged = false;

function fallbackCatalog(reason: string): CatalogData {
  if (!fallbackWarningLogged) {
    logWarn("sanity-catalog", "Using checked-in demo catalog fallback.", { reason });
    fallbackWarningLogged = true;
  }
  const products = fallbackProducts.map((product) => ({
    ...product,
    commerceProductId: product.commerceProductId ?? `demo.${product.id}`,
  })) as CatalogProduct[];
  return {
    products,
    listItems: toListItems(products),
    categories: fallbackCategories,
    brandFilters: fallbackBrandFilters,
    audienceFilters: fallbackAudienceFilters,
    source: "fallback",
  };
}

export const getCatalogData = cache(async (): Promise<CatalogData> => {
  const mode = getSanityContentMode();

  if (!isSanityConfigured) {
    if (mode === "required") {
      throw new Error("Sanity is required but its public project configuration is missing.");
    }
    return fallbackCatalog("sanity-not-configured");
  }

  try {
    const records = await sanityFetch<CatalogProductsQueryResult>({
      query: catalogProductsQuery,
      tags: ["sanity:catalog", "sanity:productContent"],
    });

    if (!records?.length) {
      if (mode === "required") {
        throw new Error("Sanity returned no active products while content mode is required.");
      }
      return fallbackCatalog("sanity-catalog-empty");
    }

    const validProducts: CatalogProduct[] = [];
    let invalidCount = 0;
    for (const record of records) {
      const result = catalogProductSchema.safeParse(record);
      if (result.success) validProducts.push(mapProduct(result.data));
      else invalidCount += 1;
    }

    if (invalidCount > 0) {
      if (mode === "required") {
        throw new Error(`Sanity returned ${invalidCount} invalid active product record(s).`);
      }
      logWarn("sanity-catalog", "Skipped invalid Sanity product records.", { invalidCount });
    }

    if (!validProducts.length) return fallbackCatalog("sanity-records-invalid");
    return buildCatalogData(validProducts, "sanity");
  } catch (error) {
    logError("sanity-catalog", "Catalog query failed.", {
      message: error instanceof Error ? error.message : "unknown-error",
    });
    if (mode === "required") throw error;
    return fallbackCatalog("sanity-query-failed");
  }
});

export async function getCatalogProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  const { products } = await getCatalogData();
  return products.find((product) => product.id === slug);
}

export async function getCatalogProductSlugs(): Promise<string[]> {
  const mode = getSanityContentMode();
  const fallbackSlugs = fallbackProducts.map(({ id }) => id);

  if (!isSanityConfigured) {
    if (mode === "required") {
      throw new Error("Sanity is required but its public project configuration is missing.");
    }
    return fallbackSlugs;
  }

  try {
    const value = await sanityFetchPublished<unknown>({
      query: catalogProductSlugsQuery,
      tags: ["sanity:catalog", "sanity:productContent"],
    });
    const parsed = productSlugListSchema.safeParse(value);
    if (!parsed.success || parsed.data.length === 0) {
      if (mode === "required") {
        throw new Error("Sanity returned no valid active product slugs.");
      }
      return fallbackSlugs;
    }
    return parsed.data;
  } catch (error) {
    logError("sanity-catalog", "Published product slug query failed.", {
      message: error instanceof Error ? error.message : "unknown-error",
    });
    if (mode === "required") throw error;
    return fallbackSlugs;
  }
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSanityConfigured) return {};
  const value = await sanityFetch<unknown>({
    query: siteSettingsQuery,
    tags: ["sanity:siteSettings"],
  });
  const parsed = siteSettingsSchema.safeParse(value);
  if (!parsed.success || !parsed.data) {
    if (getSanityContentMode() === "required") throw new Error("Sanity site settings are invalid.");
    return {};
  }
  return {
    siteTitle: parsed.data.siteTitle ?? undefined,
    catalogNotice: parsed.data.catalogNotice ?? undefined,
    seoTitle: parsed.data.seoTitle ?? undefined,
    seoDescription: parsed.data.seoDescription ?? undefined,
    seoImage: parsed.data.seoImage ?? undefined,
    noIndex: parsed.data.noIndex ?? false,
  };
});
