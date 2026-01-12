import type { Metadata } from "next";

import ProductFilters from "@/components/products/ProductFilters";
import ProductsHeader from "@/components/products/ProductsHeader";
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

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <ProductsHeader />
      <ProductFilters />
    </div>
  );
}
