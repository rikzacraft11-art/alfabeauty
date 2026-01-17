"use client";

import { useMemo, useState, useCallback } from "react";
import type { Audience, Product } from "@/lib/types";
import { listProducts } from "@/lib/catalog";

/**
 * Filter state for product catalog
 */
export type ProductFilters = {
    brands: Set<string>;
    categories: Set<string>;
    functions: Set<string>;
    audiences: Set<Audience>;
};

/**
 * Initial empty filter state
 */
const EMPTY_FILTERS: ProductFilters = {
    brands: new Set(),
    categories: new Set(),
    functions: new Set(),
    audiences: new Set(),
};

/**
 * Check if a product matches the current filters
 */
function matchesFilters(product: Product, filters: ProductFilters): boolean {
    if (filters.brands.size > 0 && !filters.brands.has(product.brand)) {
        return false;
    }
    if (
        filters.categories.size > 0 &&
        !(product.categories ?? []).some((c) => filters.categories.has(c))
    ) {
        return false;
    }
    if (filters.audiences.size > 0 && !product.audience.some((a) => filters.audiences.has(a))) {
        return false;
    }
    if (filters.functions.size > 0 && !product.functions.some((f) => filters.functions.has(f))) {
        return false;
    }
    return true;
}

/**
 * Get unique sorted values from an array
 */
function uniq(values: string[]): string[] {
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

/**
 * Hook for managing product catalog filtering
 * 
 * Extracts filter state management from ProductFilters component
 * following Single Responsibility Principle.
 * 
 * @returns Filter state and actions for product catalog
 * 
 * @example
 * ```tsx
 * const { filters, toggle, clear, filtered, hasFilters, availableBrands } = useProductFilters();
 * ```
 */
export function useProductFilters() {
    // Load all products once
    const allProducts = useMemo(() => listProducts(), []);

    // Extract available filter options from products
    const availableBrands = useMemo(
        () => uniq(allProducts.map((p) => p.brand)),
        [allProducts]
    );

    const availableCategories = useMemo(
        () => uniq(allProducts.flatMap((p) => p.categories ?? [])),
        [allProducts]
    );

    const availableFunctions = useMemo(
        () => uniq(allProducts.flatMap((p) => p.functions)),
        [allProducts]
    );

    // Filter state
    const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);

    // Toggle a filter value on/off
    const toggle = useCallback((key: keyof ProductFilters, value: string) => {
        setFilters((prev) => {
            const next: ProductFilters = {
                brands: new Set(prev.brands),
                categories: new Set(prev.categories),
                functions: new Set(prev.functions),
                audiences: new Set(prev.audiences),
            };
            const set = next[key] as Set<string>;
            if (set.has(value)) {
                set.delete(value);
            } else {
                set.add(value);
            }
            return next;
        });
    }, []);

    // Clear all filters
    const clear = useCallback(() => {
        setFilters(EMPTY_FILTERS);
    }, []);

    // Filtered product list
    const filtered = useMemo(
        () => allProducts.filter((p) => matchesFilters(p, filters)),
        [allProducts, filters]
    );

    // Check if any filters are active
    const hasFilters = useMemo(
        () =>
            filters.brands.size > 0 ||
            filters.categories.size > 0 ||
            filters.functions.size > 0 ||
            filters.audiences.size > 0,
        [filters]
    );

    return {
        // State
        filters,
        allProducts,
        filtered,
        hasFilters,

        // Available options
        availableBrands,
        availableCategories,
        availableFunctions,

        // Actions
        toggle,
        clear,

        // Counts
        totalCount: allProducts.length,
        filteredCount: filtered.length,
    };
}

export type UseProductFiltersReturn = ReturnType<typeof useProductFilters>;
