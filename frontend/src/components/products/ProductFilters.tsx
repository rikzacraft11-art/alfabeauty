"use client";

import { useState, useEffect } from "react";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";
import { useProductFilters } from "@/hooks/useProductFilters";
import { getCategoryLabel } from "@/content/homepage";
import FilterPill from "@/components/ui/FilterPill";
import FilterCheckbox from "@/components/ui/FilterCheckbox";
import ProductCard from "@/components/products/ProductCard";
import { IconSearch, IconChevronDown } from "@/components/ui/icons";

export default function ProductFilters() {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;

  // Use the extracted hook for filter logic
  /* Search Debounce Logic */
  const {
    filters,
    searchQuery,
    filtered,
    hasFilters,
    availableBrands,
    availableCategories,
    availableFunctions,
    toggle,
    setSearch,
    clear,
  } = useProductFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  // Sync internal state with URL state (in case URL changes externally)
  // But avoid race conditions if user is typing
  // Simple approach: Only sync if URL changes and is different from local, OR init.
  // actually, if we debounce, we just push.

  // Hand-rolled debounce effect
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchTerm);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm, setSearch]);

  // Sync URL -> Local (e.g. Back button)
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  return (
    <section>
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconSearch className="h-5 w-5 text-muted" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="type-ui ui-focus-ring ui-radius-tight block w-full border border-border-strong bg-panel pl-10 pr-4 py-3 text-foreground placeholder:text-muted-soft transition-colors"
          placeholder={tx.products.filters.searchPlaceholder ?? "Search products..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label={tx.products.filters.searchAriaLabel ?? "Search products"} // Accessible name
        />
      </div>

      {/* Brand Filter Pills - Quick filter bar (Desktop) */}
      <div className="hidden md:block mb-8 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill
            label={tx.products.filters.allLabel ?? "All"}
            active={!hasFilters}
            onClick={clear}
          />
          {availableBrands.map((b) => (
            <FilterPill
              key={b}
              label={b}
              active={filters.brands.has(b)}
              onClick={() => toggle("brands", b)}
            />
          ))}
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden mb-6 flex items-center justify-between">
        <p className="type-data text-muted" aria-live="polite" aria-atomic="true">
          {filtered.length} {filtered.length === 1 ? (tx.products.filters.countSingular ?? "product") : (tx.products.filters.countPlural ?? "products")}
        </p>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="touch-target inline-flex items-center gap-2 type-data-strong text-foreground border border-border bg-panel px-3 py-2 ui-radius-tight hover:bg-subtle transition-colors"
          aria-expanded={mobileFiltersOpen}
          aria-controls="mobile-product-filters"
        >
          {tx.products.filters.button}
          <IconChevronDown
            className={`h-4 w-4 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Collapsible Mobile Filters */}
      {mobileFiltersOpen && (
        <div
          id="mobile-product-filters"
          className="md:hidden mb-6 border border-border bg-panel p-4 ui-radius-tight space-y-5"
        >
          {/* Category Filter */}
          {availableCategories.length > 0 && (
            <div>
              <p className="type-data-strong text-foreground">{tx.products.filters.groups.category}</p>
              <div className="mt-2 space-y-1.5">
                {availableCategories.map((c) => (
                  <FilterCheckbox
                    key={c}
                    label={getCategoryLabel(locale, c)}
                    checked={filters.categories.has(c)}
                    onChange={() => toggle("categories", c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Brand Filter */}
          <div>
            <p className="type-data-strong text-foreground">{tx.products.filters.groups.brand}</p>
            <div className="mt-2 space-y-1.5">
              {availableBrands.map((b) => (
                <FilterCheckbox
                  key={b}
                  label={b}
                  checked={filters.brands.has(b)}
                  onChange={() => toggle("brands", b)}
                />
              ))}
            </div>
          </div>

          {/* Audience Filter */}
          <div>
            <p className="type-data-strong text-foreground">{tx.products.filters.groups.audience}</p>
            <div className="mt-2 space-y-1.5">
              <FilterCheckbox
                label={tx.products.filters.audience.salon}
                checked={filters.audiences.has("SALON")}
                onChange={() => toggle("audiences", "SALON")}
              />
              <FilterCheckbox
                label={tx.products.filters.audience.barber}
                checked={filters.audiences.has("BARBER")}
                onChange={() => toggle("audiences", "BARBER")}
              />
            </div>
          </div>

          {/* Function Filter */}
          <div>
            <p className="type-data-strong text-foreground">{tx.products.filters.groups.function}</p>
            <div className="mt-2 space-y-1.5">
              {availableFunctions.map((f) => (
                <FilterCheckbox
                  key={f}
                  label={f}
                  checked={filters.functions.has(f)}
                  onChange={() => toggle("functions", f)}
                />
              ))}
            </div>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clear}
              className="w-full type-data-strong text-center text-muted hover:text-foreground underline decoration-dotted underline-offset-4 transition-colors py-2"
            >
              {tx.products.filters.clear}
            </button>
          )}
        </div>
      )}

      {/* Grid: Desktop Sidebar + Content */}
      <div className="grid gap-8 md:grid-cols-4">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block md:col-span-1">
          <div className="border border-border bg-panel p-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="type-data-strong text-foreground">{tx.products.filters.title}</h2>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clear}
                  className="type-data text-muted hover:text-foreground underline decoration-dotted underline-offset-4 transition-colors"
                >
                  {tx.products.filters.clear}
                </button>
              )}
            </div>

            <div className="mt-5 space-y-5">
              {/* Category Filter */}
              {availableCategories.length > 0 && (
                <div>
                  <p className="type-data-strong text-foreground">{tx.products.filters.groups.category}</p>
                  <div className="mt-2 space-y-1.5">
                    {availableCategories.map((c) => (
                      <FilterCheckbox
                        key={c}
                        label={getCategoryLabel(locale, c)}
                        checked={filters.categories.has(c)}
                        onChange={() => toggle("categories", c)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Filter */}
              <div>
                <p className="type-data-strong text-foreground">{tx.products.filters.groups.brand}</p>
                <div className="mt-2 space-y-1.5">
                  {availableBrands.map((b) => (
                    <FilterCheckbox
                      key={b}
                      label={b}
                      checked={filters.brands.has(b)}
                      onChange={() => toggle("brands", b)}
                    />
                  ))}
                </div>
              </div>

              {/* Audience Filter */}
              <div>
                <p className="type-data-strong text-foreground">{tx.products.filters.groups.audience}</p>
                <div className="mt-2 space-y-1.5">
                  <FilterCheckbox
                    label={tx.products.filters.audience.salon}
                    checked={filters.audiences.has("SALON")}
                    onChange={() => toggle("audiences", "SALON")}
                  />
                  <FilterCheckbox
                    label={tx.products.filters.audience.barber}
                    checked={filters.audiences.has("BARBER")}
                    onChange={() => toggle("audiences", "BARBER")}
                  />
                </div>
              </div>

              {/* Function Filter */}
              <div>
                <p className="type-data-strong text-foreground">{tx.products.filters.groups.function}</p>
                <div className="mt-2 space-y-1.5">
                  {availableFunctions.map((f) => (
                    <FilterCheckbox
                      key={f}
                      label={f}
                      checked={filters.functions.has(f)}
                      onChange={() => toggle("functions", f)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {/* Results count */}
          {hasFilters && (
            <p className="type-data text-muted mb-4 hidden md:block" aria-live="polite" aria-atomic="true">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>
          )}

          {filtered.length === 0 ? (
            /* Empty State */
            <div className="border border-border bg-panel p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-subtle">
                <IconSearch className="h-6 w-6 text-muted" />
              </div>
              <p className="mt-4 type-body-strong text-foreground">{tx.products.filters.empty.title}</p>
              <p className="mt-2 type-body max-w-sm mx-auto">{tx.products.filters.empty.body}</p>
              <button
                type="button"
                onClick={clear}
                className="mt-4 type-data-strong text-foreground underline decoration-dotted underline-offset-4"
              >
                {tx.products.filters.clear}
              </button>
            </div>
          ) : (
            /* Product Cards */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  href={`${base}/products/${p.slug}`}
                  index={i}
                  viewDetailsLabel={tx.cta.viewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
