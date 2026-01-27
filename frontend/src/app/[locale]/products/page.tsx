import type { Metadata } from "next";

import ProductFilters from "@/components/products/ProductFilters";
import ProductsHeader from "@/components/products/ProductsHeader";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tx = t(locale);
  const path = `/${locale}/products`;

  return {
    title: tx.products.title,
    description: tx.seo.productsDescription,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/products",
        id: "/id/products",
      },
    },
  };
}

// ... props ...
export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const tx = t(locale);

  const breadcrumbs = [
    { name: tx.nav ? tx.nav.home : "Home", url: `/${locale}` },
    { name: tx.nav ? tx.nav.products : "Products", url: `/${locale}/products` },
  ];

  return (
    <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-10 py-12 space-y-10">
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductsHeader />
      <ProductFilters />
    </div>
  );
}
