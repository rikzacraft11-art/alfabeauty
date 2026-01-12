import type { Metadata } from "next";

import ProductDetailContent from "@/components/products/ProductDetailContent";
import { getProductBySlug, listProducts } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";

export function generateStaticParams(): Array<{ locale: Locale; slug: string }> {
  const slugs = listProducts().map((p) => p.slug);
  return [
    ...slugs.map((slug) => ({ locale: "en" as const, slug })),
    ...slugs.map((slug) => ({ locale: "id" as const, slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProductBySlug(slug);

  const path = `/${locale}/products/${slug}`;
  return {
    title: p?.name ?? "Product",
    description: p?.summary,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/products/${slug}`,
        id: `/id/products/${slug}`,
      },
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  return <ProductDetailContent product={p ?? null} />;
}
