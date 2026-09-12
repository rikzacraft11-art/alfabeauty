"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, RotateCcw } from "lucide-react";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface FilterSectionData {
    id: string;
    title: string;
    items: { id: string; label: string; count?: number }[];
    selected: string[];
    onToggle: (id: string) => void;
}

interface ShopSidebarFiltersProps {
    sections: FilterSectionData[];
    onResetAll: () => void;
    hasActiveFilters: boolean;
}

export const ShopSidebarFilters: React.FC<ShopSidebarFiltersProps> = ({
    sections,
    onResetAll,
    hasActiveFilters,
}) => {
    // Accordion open/collapse states
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        categories: true,
        brands: true,
        audience: true,
    });

    const toggleSection = (id: string) => {
        setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <aside className="s-sidebar w-full space-y-6">
            {/* Header with Clear All button */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-cta font-bold text-foreground">
                    Filters
                </span>
                {hasActiveFilters && (
                    <button
                        onClick={onResetAll}
                        className="flex min-h-[40px] items-center gap-1 text-caption font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset All</span>
                    </button>
                )}
            </div>

            {/* Accordion Filter Sections */}
            <div className="space-y-5">
                {sections.map((section) => {
                    const isOpen = openSections[section.id] ?? true;
                    return (
                        <div key={section.id} className="border-b border-border/20 pb-4">
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="flex min-h-[44px] w-full items-center justify-between py-2 text-left text-cta font-semibold text-foreground hover:text-foreground/80"
                            >
                                <span>{section.title}</span>
                                {isOpen ? (
                                    <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                            </button>

                            {isOpen && (
                                <div className="mt-1 space-y-1 pl-0.5">
                                    {section.items.map((item) => {
                                        const isChecked = section.selected.includes(item.id);
                                        return (
                                            <label
                                                key={item.id}
                                                className="group flex min-h-[40px] cursor-pointer items-center justify-between py-1.5 text-caption text-muted-foreground transition-colors hover:text-foreground active:opacity-70"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={() => section.onToggle(item.id)}
                                                        className="h-4 w-4 rounded-sm border-border-warm/60 data-[state=checked]:border-foreground data-[state=checked]:bg-foreground"
                                                    />
                                                    <span className={isChecked ? "font-medium text-foreground" : ""}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                {typeof item.count === "number" && (
                                                    <span className="text-tiny text-muted-foreground/60">
                                                        ({item.count})
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};
