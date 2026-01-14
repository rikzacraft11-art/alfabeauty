"use client";

import { listProducts } from "@/lib/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import { t } from "@/lib/i18n";

export default function ProductHighlights() {
  const { locale } = useLocale();
  const tx = t(locale);
  const products = listProducts().slice(0, 3);
  const base = `/${locale}`;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="type-h3">{tx.products.highlights.title}</h2>
          <p className="type-body">{tx.products.highlights.lede}</p>
        </div>
        <AppLink href={`${base}/products`} className="type-data-strong text-foreground">
          {tx.products.highlights.viewAll}
        </AppLink>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {products.map((p) => (
          <AppLink
            key={p.slug}
            href={`${base}/products/${p.slug}`}
            underline="none"
            className="border border-border bg-background p-6 transition-colors hover:bg-subtle"
          >
            <p className="type-kicker">{p.brand}</p>
            <p className="mt-2 type-body-strong text-foreground">{p.name}</p>
            <p className="mt-2 type-body line-clamp-3">{p.summary}</p>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
