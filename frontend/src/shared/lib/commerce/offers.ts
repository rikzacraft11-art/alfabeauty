import "server-only";

import { cache } from "react";
import { getSupabaseAdmin } from "@/shared/lib/supabase";
import {
  getCatalogData,
  type CatalogData,
  type CatalogProduct,
} from "@/shared/lib/sanity/catalog";
import { commerceOfferRowSchema } from "./contracts";
import { getCommerceMode } from "./env";
import { stableDemoPrice, stableVariantId } from "./core";
import type { CommerceOffer } from "./types";

export type CommerceCatalogProduct = CatalogProduct & {
  offers: CommerceOffer[];
  startingPriceIdr?: number;
  purchasable: boolean;
};

export type CommerceCatalogData = Omit<CatalogData, "products" | "listItems"> & {
  products: CommerceCatalogProduct[];
  listItems: Array<CatalogData["listItems"][number] & {
    startingPriceIdr?: number;
    purchasable: boolean;
  }>;
  commerceMode: ReturnType<typeof getCommerceMode>;
};

function demoSku(productId: string, index: number): string {
  const base = productId.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `DEMO-${base}-${index + 1}`.slice(0, 64);
}

function createDemoOffers(products: CatalogProduct[]): CommerceOffer[] {
  return products.flatMap((product) => {
    const productId = product.commerceProductId ?? `demo.${product.id}`;
    const variants = product.commerceVariants?.length
      ? product.commerceVariants
      : (product.variants?.length ? product.variants : ["Default"]).map((label) => ({
          id: stableVariantId(productId, label),
          label,
        }));
    return variants.map((variant, index) => ({
      commerceProductId: productId,
      commerceVariantId: variant.id,
      sku: demoSku(productId, index),
      label: variant.label,
      priceIdr: stableDemoPrice(variant.id),
      stockAvailable: 25,
      active: true,
      currency: "IDR" as const,
      version: 1,
      demo: true,
    }));
  });
}

async function fetchSandboxOffers(productIds: string[]): Promise<CommerceOffer[]> {
  if (!productIds.length) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("commerce_offers")
    .select(
      "commerce_product_id,commerce_variant_id,sku,variant_label,price_idr,stock_on_hand,active,currency,version",
    )
    .in("commerce_product_id", productIds)
    .eq("active", true);
  if (error) throw new Error(`Unable to read commerce offers: ${error.message}`);

  return (data ?? []).map((row) => {
    const parsed = commerceOfferRowSchema.parse(row);
    return {
      commerceProductId: parsed.commerce_product_id,
      commerceVariantId: parsed.commerce_variant_id,
      sku: parsed.sku,
      label: parsed.variant_label,
      priceIdr: parsed.price_idr,
      stockAvailable: parsed.stock_on_hand,
      active: parsed.active,
      currency: parsed.currency,
      version: parsed.version,
      demo: false,
    };
  });
}

export const getCommerceCatalogData = cache(async (): Promise<CommerceCatalogData> => {
  const catalog = await getCatalogData();
  const mode = getCommerceMode();
  if (mode === "sandbox" && catalog.source !== "sanity") {
    throw new Error("Commerce sandbox requires an authoritative Sanity catalog.");
  }
  const ids = catalog.products.flatMap((product) =>
    product.commerceProductId ? [product.commerceProductId] : [],
  );
  const offers =
    mode === "demo"
      ? createDemoOffers(catalog.products)
      : mode === "sandbox"
        ? await fetchSandboxOffers(ids)
        : [];
  const offerMap = new Map<string, CommerceOffer[]>();
  for (const offer of offers) {
    const current = offerMap.get(offer.commerceProductId) ?? [];
    current.push(offer);
    offerMap.set(offer.commerceProductId, current);
  }

  const products = catalog.products.map((product): CommerceCatalogProduct => {
    const productId =
      product.commerceProductId ?? (mode === "demo" ? `demo.${product.id}` : undefined);
    const productOffers = productId ? offerMap.get(productId) ?? [] : [];
    const sellable = productOffers.filter((offer) => offer.active && offer.stockAvailable > 0);
    return {
      ...product,
      commerceProductId: productId,
      offers: productOffers,
      startingPriceIdr: sellable.length
        ? Math.min(...sellable.map((offer) => offer.priceIdr))
        : undefined,
      purchasable: sellable.length > 0,
    };
  });

  const productMap = new Map(products.map((product) => [product.id, product]));
  return {
    ...catalog,
    products,
    listItems: catalog.listItems.map((item) => {
      const product = productMap.get(item.id);
      return {
        ...item,
        startingPriceIdr: product?.startingPriceIdr,
        purchasable: product?.purchasable ?? false,
      };
    }),
    commerceMode: mode,
  };
});

export async function getCommerceProductBySlug(
  slug: string,
): Promise<CommerceCatalogProduct | undefined> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  return (await getCommerceCatalogData()).products.find((product) => product.id === slug);
}

export async function getCommerceOfferByVariantId(
  variantId: string,
): Promise<{ offer: CommerceOffer; product: CommerceCatalogProduct } | undefined> {
  const catalog = await getCommerceCatalogData();
  for (const product of catalog.products) {
    const offer = product.offers.find((candidate) => candidate.commerceVariantId === variantId);
    if (offer) return { offer, product };
  }
  return undefined;
}
