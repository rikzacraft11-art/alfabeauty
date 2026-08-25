"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ShopHeader } from "./shop-header";
import { ShopToolbar } from "./shop-toolbar";
import { ShopSidebarFilters } from "./shop-sidebar-filters";
import { ProductCard } from "./product-card";
import { DeliveryPromoCard, RewardsPromoCard } from "./editorial-card";
import {
    catalogProducts,
    categoryPills,
    brandFacets,
    audienceFacets,
} from "../data/products";
import { type SortOption } from "../types/catalog.types";
import { Sheet, SheetContent, SheetTitle } from "@/shared/components/ui/sheet";

export const ShopGrid: React.FC = () => {
    const searchParams = useSearchParams();

    // ─── Query State Sync ───
    const initialCategory = searchParams.get("category") || searchParams.get("product_cat") || "all";
    const initialSearch = searchParams.get("s") || searchParams.get("q") || "";

    const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
    const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(Boolean(initialSearch));
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState<boolean>(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<SortOption>("latest");

    // Sync URL when category or search changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (activeCategory && activeCategory !== "all") params.set("category", activeCategory);
        if (searchQuery.trim()) params.set("s", searchQuery.trim());
        const queryString = params.toString();
        const newUrl = queryString ? `?${queryString}` : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
    }, [activeCategory, searchQuery]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let list = [...catalogProducts];

        // Search query filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (activeCategory !== "all") {
            list = list.filter((p) => p.category === activeCategory);
        }

        // Brand filter
        if (selectedBrands.length > 0) {
            list = list.filter((p) => selectedBrands.includes(p.brand));
        }

        // Audience filter
        if (selectedAudience.length > 0) {
            list = list.filter(
                (p) =>
                    selectedAudience.includes(p.audience) ||
                    (p.audience === "both" && selectedAudience.some((a) => a === "salon" || a === "barber"))
            );
        }

        // Sorting
        switch (sortOption) {
            case "price-asc":
                list.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case "price-desc":
                list.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case "name-asc":
                list.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "popular":
                list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case "latest":
            default:
                break;
        }

        return list;
    }, [searchQuery, activeCategory, selectedBrands, selectedAudience, sortOption]);

    // Compute dynamic item counts for categories
    const categoriesWithCount = useMemo(() => {
        return categoryPills.map((cat) => {
            if (cat.id === "all") return { ...cat, count: catalogProducts.length };
            const count = catalogProducts.filter((p) => p.category === cat.id).length;
            return { ...cat, count };
        });
    }, []);

    // Brand section data
    const brandSections = useMemo(() => {
        return [
            {
                id: "brands",
                title: "Brands",
                items: brandFacets.map((b) => ({
                    id: b,
                    label: b,
                    count: catalogProducts.filter((p) => p.brand === b).length,
                })),
                selected: selectedBrands,
                onToggle: (id: string) => {
                    setSelectedBrands((prev) =>
                        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
                    );
                },
            },
            {
                id: "audience",
                title: "Target Market",
                items: audienceFacets.map((a) => ({
                    id: a.id,
                    label: a.label,
                    count: catalogProducts.filter((p) => p.audience === a.id || p.audience === "both").length,
                })),
                selected: selectedAudience,
                onToggle: (id: string) => {
                    setSelectedAudience((prev) =>
                        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
                    );
                },
            },
        ];
    }, [selectedBrands, selectedAudience]);

    const activeFilterCount = selectedBrands.length + selectedAudience.length;

    const handleResetAll = () => {
        setActiveCategory("all");
        setSelectedBrands([]);
        setSelectedAudience([]);
        setSearchQuery("");
        setIsSearchOpen(false);
    };

    const handleToggleSearch = () => {
        if (isSearchOpen) {
            setSearchQuery("");
            setIsSearchOpen(false);
        } else {
            setIsSearchOpen(true);
        }
    };

    // Determine current header title
    const currentTitle = useMemo(() => {
        if (activeCategory === "all") return "Shop all products";
        const found = categoryPills.find((c) => c.id === activeCategory);
        return found ? found.label : "Shop all products";
    }, [activeCategory]);

    return (
        <section className="section-shop relative min-h-screen bg-background pb-24 pt-[var(--header-height,80px)]">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
                {/* 1:1 Yucca .s-header (In-Place Expandable Search) */}
                <ShopHeader
                    title={currentTitle}
                    searchQuery={searchQuery}
                    isSearchOpen={isSearchOpen}
                    onSearchChange={setSearchQuery}
                    onToggleSearch={handleToggleSearch}
                    onClearSearch={() => setSearchQuery("")}
                />

                {/* 1:1 Yucca .s-subheader (Horizontal Category Radio Pills + Filters Toggle + Sort) */}
                <ShopToolbar
                    categories={categoriesWithCount}
                    activeCategory={activeCategory}
                    showFilters={showFilters}
                    activeFilterCount={activeFilterCount}
                    sortOption={sortOption}
                    onCategoryChange={setActiveCategory}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onOpenMobileFilters={() => setMobileFiltersOpen(true)}
                    onSortChange={setSortOption}
                />

                {/* Main Body Layout */}
                <div className="s-body mt-8 flex gap-8 lg:gap-12">
                    {/* Left Sidebar (Desktop) */}
                    {showFilters && (
                        <div className="hidden w-64 shrink-0 lg:block">
                            <ShopSidebarFilters
                                sections={brandSections}
                                onResetAll={handleResetAll}
                                hasActiveFilters={activeFilterCount > 0 || activeCategory !== "all"}
                            />
                        </div>
                    )}

                    {/* Mobile Filters Sheet Drawer */}
                    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                        <SheetContent side="left" className="w-[300px] overflow-y-auto p-6">
                            <SheetTitle className="sr-only">Product Filters</SheetTitle>
                            <ShopSidebarFilters
                                sections={brandSections}
                                onResetAll={() => {
                                    handleResetAll();
                                    setMobileFiltersOpen(false);
                                }}
                                hasActiveFilters={activeFilterCount > 0 || activeCategory !== "all"}
                            />
                        </SheetContent>
                    </Sheet>

                    {/* Products Grid (1:1 Yucca Editorial Commerce Grid) */}
                    <div className="s-main flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <h3 className="font-serif text-2xl font-light text-foreground">
                                    No products found
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Try adjusting your search query or reset your filters.
                                </p>
                                <button
                                    onClick={handleResetAll}
                                    className="mt-6 rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-80"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="s-products-list grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                {/* Slot 1: Editorial Delivery Promo Card (1:1 Yucca style) */}
                                <DeliveryPromoCard />

                                {/* Products Batch 1 */}
                                {filteredProducts.slice(0, 5).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}

                                {/* Slot 7: Editorial Rewards Ad Card (1:1 Yucca style) */}
                                {filteredProducts.length >= 5 && <RewardsPromoCard />}

                                {/* Products Batch 2 */}
                                {filteredProducts.slice(5).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
