"use client";

import React from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { type CategoryTab, type SortOption } from "../types/catalog.types";

interface ShopToolbarProps {
    categories: CategoryTab[];
    activeCategory: string;
    showFilters: boolean;
    activeFilterCount: number;
    sortOption: SortOption;
    onCategoryChange: (categoryId: string) => void;
    onToggleFilters: () => void;
    onOpenMobileFilters: () => void;
    onSortChange: (sort: SortOption) => void;
}

export const ShopToolbar: React.FC<ShopToolbarProps> = ({
    categories,
    activeCategory,
    showFilters,
    activeFilterCount,
    sortOption,
    onCategoryChange,
    onToggleFilters,
    onOpenMobileFilters,
    onSortChange,
}) => {
    return (
        <div className="s-subheader flex items-center justify-between gap-4 border-b border-border/30 py-4">
            {/* Left: Filter Toggle (Desktop & Mobile) */}
            <div className="s-filter-toggle-wrapper flex shrink-0 items-center">
                {/* Desktop toggle */}
                <button
                    onClick={onToggleFilters}
                    className="s-filter-toggle hidden items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-foreground/70 lg:flex"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                </button>

                {/* Mobile trigger */}
                <button
                    onClick={onOpenMobileFilters}
                    className="s-filter-toggle flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:text-foreground/70 lg:hidden"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Center: Horizontal Category Radio Pills (1:1 Yucca .s-category-filters) */}
            <div className="s-category-filters scrollbar-none flex flex-1 items-center gap-2 overflow-x-auto px-2 lg:px-6">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={`s-filter group relative shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-all duration-200 ${
                                isActive
                                    ? "bg-foreground text-background font-semibold"
                                    : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground font-normal"
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <span>{cat.label}</span>
                                {typeof cat.count === "number" && cat.count > 0 && (
                                    <span
                                        className={`text-[10px] ${
                                            isActive ? "text-background/80" : "text-muted-foreground/70"
                                        }`}
                                    >
                                        {cat.count}
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Right: Sort Dropdown (1:1 Yucca) */}
            <div className="s-sorting relative shrink-0">
                <div className="relative flex items-center">
                    <select
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value as SortOption)}
                        aria-label="Sort products"
                        className="cursor-pointer appearance-none bg-transparent pr-7 text-xs font-medium uppercase tracking-[0.12em] text-foreground outline-none transition-colors hover:text-foreground/70"
                    >
                        <option value="latest">Sort by: Latest</option>
                        <option value="popular">Sort by: Popular</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Alphabetical: A-Z</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-muted-foreground" />
                </div>
            </div>
        </div>
    );
};
