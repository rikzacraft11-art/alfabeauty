"use client";

import { forwardRef } from "react";

interface FilterPillProps {
    /** Label to display on the pill */
    label: string;
    /** Whether the pill is currently selected/active */
    active: boolean;
    /** Click handler when pill is toggled */
    onClick: () => void;
    /** Optional className for custom styling */
    className?: string;
}

/**
 * Filter Pill Component
 * 
 * A pill-shaped toggle button used for quick filtering.
 * Used in ProductFilters for brand quick-filter bar.
 * 
 * Accessibility:
 * - Uses button element for proper keyboard interaction
 * - Visual state indicated by background color change
 * - Touch-friendly sizing on mobile
 */
const FilterPill = forwardRef<HTMLButtonElement, FilterPillProps>(
    ({ label, active, onClick, className = "" }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                onClick={onClick}
                aria-pressed={active}
                className={`
          px-4 py-2 border transition-colors
          ${active
                        ? "bg-foreground text-background border-foreground type-data-strong"
                        : "bg-background text-muted-strong border-border hover:bg-subtle hover:border-muted-strong hover:text-foreground type-data"
                    }
          ${className}
        `}
            >
                {label}
            </button>
        );
    }
);

FilterPill.displayName = "FilterPill";

export default FilterPill;
