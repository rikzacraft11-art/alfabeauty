"use client";

import Link from "next/link";

import { listProducts } from "@/lib/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
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
          <p className="type-body text-zinc-700">{tx.products.highlights.lede}</p>
        </div>
        <Link href={`${base}/products`} className="type-data font-semibold text-zinc-900 hover:underline">
          {tx.products.highlights.viewAll}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`${base}/products/${p.slug}`}
            className="border border-zinc-200 p-6 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
          >
            <p className="type-kicker">{p.brand}</p>
            <p className="mt-2 type-body font-semibold text-zinc-950">{p.name}</p>
            <p className="mt-2 type-body line-clamp-3">{p.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
