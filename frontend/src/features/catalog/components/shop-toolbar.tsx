"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { type CategoryTab, type SortOption } from "../types/catalog.types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "latest", label: "Sort: Latest" },
    { value: "popular", label: "Sort: Popular" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Alphabetical: A–Z" },
];

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
        <div className="s-subheader border-b border-border/30 py-3 sm:py-4">
            {/* Mobile Top Row: Filters + Sort (sm:hidden) */}
            <div className="flex items-center justify-between gap-3 pb-3 sm:hidden">
                <button
                    onClick={onOpenMobileFilters}
                    className="s-filter-toggle min-h-[44px] inline-flex items-center gap-2 text-cta font-semibold text-foreground hover:text-foreground/70 active:scale-[0.98]"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-tiny font-bold text-background">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                <div className="s-sorting relative shrink-0">
                    <Select
                        value={sortOption}
                        onValueChange={(value) => onSortChange(value as SortOption)}
                    >
                        <SelectTrigger
                            className="h-9 min-h-[40px] border border-border-warm/60 bg-surface-elevated/40 px-3 text-caption font-medium tracking-normal text-foreground hover:bg-surface-elevated hover:border-border-warm focus-visible:ring-1 focus-visible:ring-foreground transition-all shadow-none rounded-sm gap-2"
                            aria-label="Sort products"
                        >
                            <SelectValue placeholder="Sort products" />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            align="end"
                            className="border-border-warm/80 bg-background/95 backdrop-blur-md shadow-xl rounded-md py-1 min-w-[180px]"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="text-caption font-medium text-foreground/85 hover:text-foreground hover:bg-accent py-2 px-3 cursor-pointer rounded-xs"
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Desktop and Tablet Row / Mobile Category Pills */}
            <div className="flex items-center justify-between gap-4">
                {/* Desktop Filter Toggle */}
                <div className="s-filter-toggle-wrapper hidden shrink-0 items-center sm:flex">
                    <button
                        onClick={onToggleFilters}
                        className="s-filter-toggle hidden items-center gap-2.5 text-cta font-semibold text-foreground transition-colors hover:text-foreground/70 lg:flex"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                    </button>

                    <button
                        onClick={onOpenMobileFilters}
                        className="s-filter-toggle flex items-center gap-2 text-cta font-semibold text-foreground hover:text-foreground/70 lg:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-tiny font-bold text-background">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Horizontal Category Radio Pills */}
                <div className="s-category-filters scrollbar-none flex flex-1 items-center gap-2 overflow-x-auto py-1 px-1 sm:px-2 lg:px-6">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`s-filter group relative shrink-0 rounded-full px-3.5 py-1.5 min-h-[36px] flex items-center text-caption transition-all duration-200 active:scale-[0.98] ${
                                    isActive
                                        ? "bg-foreground text-background font-semibold"
                                        : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground font-normal"
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <span>{cat.label}</span>
                                    {typeof cat.count === "number" && cat.count > 0 && (
                                        <span
                                            className={`text-tiny ${
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

                {/* Desktop Sort Dropdown */}
                <div className="s-sorting relative shrink-0 hidden sm:block">
                    <Select
                        value={sortOption}
                        onValueChange={(value) => onSortChange(value as SortOption)}
                    >
                        <SelectTrigger
                            className="h-9 border border-border-warm/60 bg-surface-elevated/40 px-3.5 text-caption font-medium tracking-normal text-foreground hover:bg-surface-elevated hover:border-border-warm focus-visible:ring-1 focus-visible:ring-foreground transition-all shadow-none rounded-sm gap-2"
                            aria-label="Sort products"
                        >
                            <SelectValue placeholder="Sort products" />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            align="end"
                            className="border-border-warm/80 bg-background/95 backdrop-blur-md shadow-xl rounded-md py-1 min-w-[190px]"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="text-caption font-medium text-foreground/85 hover:text-foreground hover:bg-accent py-2 px-3 cursor-pointer rounded-xs"
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};
