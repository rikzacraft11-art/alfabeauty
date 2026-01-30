"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
    const searchParams = useSearchParams();
    // Use window.history.replaceState directly to avoid Next.js router overhead for shallow updates if preferred,
    // but router.replace with scroll: false is standard.
    const router = useRouter();
    const pathname = usePathname();

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

    // Filter state derived from URL
    const filters = useMemo((): ProductFilters => {
        return {
            brands: new Set(searchParams.getAll("brand")),
            categories: new Set(searchParams.getAll("category")),
            functions: new Set(searchParams.getAll("function")),
            audiences: new Set(searchParams.getAll("audience") as Audience[]),
        };
    }, [searchParams]);

    const searchQuery = searchParams.get("q") ?? "";

    // Toggle a filter value by updating URL
    const toggle = useCallback((key: keyof ProductFilters, value: string) => {
        const current = new URLSearchParams(searchParams.toString());

        // Map logical keys to URL param keys
        const paramKeyMap: Record<keyof ProductFilters, string> = {
            brands: "brand",
            categories: "category",
            functions: "function",
            audiences: "audience",
        };
        const paramKey = paramKeyMap[key];

        // Manual toggle logic for URLSearchParams
        const values = current.getAll(paramKey);
        current.delete(paramKey);

        if (values.includes(value)) {
            values.filter(v => v !== value).forEach(v => current.append(paramKey, v));
        } else {
            [...values, value].forEach(v => current.append(paramKey, v));
        }

        router.replace(`${pathname}?${current.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    const setSearch = useCallback((query: string) => {
        const current = new URLSearchParams(searchParams.toString());
        if (query) {
            current.set("q", query);
        } else {
            current.delete("q");
        }
        router.replace(`${pathname}?${current.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    // Clear all filters
    const clear = useCallback(() => {
        router.replace(pathname, { scroll: false });
    }, [router, pathname]);

    // Filtered product list
    const filtered = useMemo(
        () => allProducts.filter((p) => {
            if (!matchesFilters(p, filters)) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const textMatch =
                    p.name.toLowerCase().includes(q) ||
                    p.summary.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q);
                if (!textMatch) return false;
            }
            return true;
        }),
        [allProducts, filters, searchQuery]
    );

    // Check if any filters are active
    const hasFilters = useMemo(
        () =>
            filters.brands.size > 0 ||
            filters.categories.size > 0 ||
            filters.functions.size > 0 ||
            filters.audiences.size > 0 ||
            searchQuery.length > 0,
        [filters, searchQuery]
    );

    return {
        // State
        filters,
        searchQuery,
        allProducts,
        filtered,
        hasFilters,

        // Available options
        availableBrands,
        availableCategories,
        availableFunctions,

        // Actions
        toggle,
        setSearch,
        clear,

        // Counts
        totalCount: allProducts.length,
        filteredCount: filtered.length,
    };
}

export type UseProductFiltersReturn = ReturnType<typeof useProductFilters>;
