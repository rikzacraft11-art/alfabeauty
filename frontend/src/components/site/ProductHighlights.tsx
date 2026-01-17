"use client";

import { listProducts } from "@/lib/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import ProductCard from "@/components/products/ProductCard";
import { t } from "@/lib/i18n";
import { IconArrowRightSmall as IconArrowRight } from "@/components/ui/icons";

export default function ProductHighlights() {
  const { locale } = useLocale();
  const tx = t(locale);
  const products = listProducts().slice(0, 3);
  const base = `/${locale}`;

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="type-kicker">
            {locale === "id" ? "Produk Unggulan" : "Featured Products"}
          </p>
          <h2 className="type-h2">{tx.products.highlights.title}</h2>
          <p className="type-body max-w-lg">{tx.products.highlights.lede}</p>
        </div>
        <AppLink
          href={`${base}/products`}
          className="group inline-flex items-center gap-2 type-ui-strong text-foreground 
                     hover:text-foreground-soft transition-colors shrink-0"
        >
          {tx.products.highlights.viewAll}
          <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </AppLink>
      </div>

      {/* Product Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {products.map((p, i) => (
          <ProductCard
            key={p.slug}
            brand={p.brand}
            name={p.name}
            summary={p.summary}
            href={`${base}/products/${p.slug}`}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
