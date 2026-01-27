import type { Metadata } from "next";

import ProductDetailContent from "@/components/products/ProductDetailContent";
import ProductSchema from "@/components/seo/ProductSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { getProductBySlug, listProducts } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const path = `/${locale}/products/${slug}`;
  const fullUrl = `${siteUrl.replace(/\/$/, "")}${path}`;

  // Fallbacks for undefined product data (UAT-15: no empty metadata)
  const title = p?.name ?? "Product";
  const description = p?.summary ?? "Professional beauty product for salons and barbershops.";

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/products/${slug}`,
        id: `/id/products/${slug}`,
      },
    },
    // UAT-15: openGraph metadata for share previews
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Alfa Beauty Cosmetica",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
    },
    // UAT-15: twitter card metadata
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug, locale } = await params;
  const p = getProductBySlug(slug);
  const tx = t(locale);

  const breadcrumbs = [
    { name: tx.nav ? tx.nav.home : "Home", url: `/${locale}` },
    { name: tx.nav ? tx.nav.products : "Products", url: `/${locale}/products` },
    { name: p ? p.name : slug, url: `/${locale}/products/${slug}` },
  ];

  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-12">
      <BreadcrumbSchema items={breadcrumbs} />
      {p && <ProductSchema product={p} />}
      <ProductDetailContent product={p ?? null} />
    </div>
  );
}
