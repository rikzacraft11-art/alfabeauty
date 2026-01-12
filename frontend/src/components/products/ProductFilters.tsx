"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Audience, Product } from "@/lib/types";
import { listProducts } from "@/lib/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

function uniq(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function matches(p: Product, selected: Filters) {
  if (selected.brands.size > 0 && !selected.brands.has(p.brand)) return false;
  if (selected.audiences.size > 0 && !p.audience.some((a) => selected.audiences.has(a))) return false;
  if (selected.functions.size > 0 && !p.functions.some((f) => selected.functions.has(f))) return false;
  return true;
}

type Filters = {
  brands: Set<string>;
  functions: Set<string>;
  audiences: Set<Audience>;
};

export default function ProductFilters() {
  const { locale } = useLocale();
  const tx = t(locale);

  const all = useMemo(() => listProducts(), []);

  const brands = useMemo(() => uniq(all.map((p) => p.brand)), [all]);
  const functions = useMemo(() => uniq(all.flatMap((p) => p.functions)), [all]);

  const [filters, setFilters] = useState<Filters>({
    brands: new Set(),
    functions: new Set(),
    audiences: new Set(),
  });

  const filtered = useMemo(() => all.filter((p) => matches(p, filters)), [all, filters]);

  const toggle = (key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const next = {
        brands: new Set(prev.brands),
        functions: new Set(prev.functions),
        audiences: new Set(prev.audiences),
      };
      const set = next[key] as Set<string>;
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return next;
    });
  };

  const clear = () =>
    setFilters({
      brands: new Set(),
      functions: new Set(),
      audiences: new Set(),
    });

  return (
    <section className="grid gap-6 md:grid-cols-4">
      <aside className="md:col-span-1">
        <div className="border border-zinc-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="type-data font-semibold text-zinc-900">
              {tx.products.filters.title}
            </h2>
            <button
              type="button"
              onClick={clear}
              className="type-data font-semibold text-zinc-900 underline"
            >
              {tx.products.filters.clear}
            </button>
          </div>

          <div className="mt-4 space-y-5">
            <div>
              <p className="type-data font-semibold text-zinc-900">{tx.products.filters.groups.brand}</p>
              <div className="mt-2 space-y-2">
                {brands.map((b) => (
                  <label key={b} className="flex items-center gap-2 type-body text-zinc-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={filters.brands.has(b)}
                      onChange={() => toggle("brands", b)}
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="type-data font-semibold text-zinc-900">
                {tx.products.filters.groups.audience}
              </p>
              <div className="mt-2 space-y-2">
                {(["SALON", "BARBER"] as const).map((a) => (
                  <label key={a} className="flex items-center gap-2 type-body text-zinc-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={filters.audiences.has(a)}
                      onChange={() => toggle("audiences", a)}
                    />
                    {a === "SALON" ? tx.products.filters.audience.salon : tx.products.filters.audience.barber}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="type-data font-semibold text-zinc-900">
                {tx.products.filters.groups.function}
              </p>
              <div className="mt-2 space-y-2">
                {functions.map((f) => (
                  <label key={f} className="flex items-center gap-2 type-body text-zinc-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={filters.functions.has(f)}
                      onChange={() => toggle("functions", f)}
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="md:col-span-3">
        {filtered.length === 0 ? (
          <div className="border border-zinc-200 bg-zinc-50 p-8">
            <p className="type-data font-semibold text-zinc-900">
              {tx.products.filters.empty.title}
            </p>
            <p className="mt-2 type-body text-zinc-700">
              {tx.products.filters.empty.body}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="border border-zinc-200 p-6 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
              >
                <p className="type-kicker">{p.brand}</p>
                <p className="mt-2 type-body font-semibold text-zinc-950">{p.name}</p>
                <p className="mt-2 type-body line-clamp-3">{p.summary}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
