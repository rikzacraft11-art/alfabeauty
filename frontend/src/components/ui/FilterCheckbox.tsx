"use client";

import { forwardRef, useId } from "react";

interface FilterCheckboxProps {
    /** Label to display next to the checkbox */
    label: string;
    /** Whether the checkbox is currently checked */
    checked: boolean;
    /** Change handler when checkbox is toggled */
    onChange: (checked: boolean) => void;
    /** Optional className for the label container */
    className?: string;
}

/**
 * Filter Checkbox Component
 * 
 * A styled checkbox used for multi-select filtering.
 * Used in ProductFilters for mobile filter panels and sidebar.
 * 
 * Accessibility:
 * - Uses native checkbox for proper keyboard and screen reader support
 * - Label is associated with input via htmlFor/id
 * - Focus ring visible on keyboard navigation
 */
const FilterCheckbox = forwardRef<HTMLInputElement, FilterCheckboxProps>(
    ({ label, checked, onChange, className = "" }, ref) => {
        const id = useId();

        return (
            <label
                htmlFor={id}
                className={`
          group flex items-center gap-2.5 py-1 type-data cursor-pointer 
          hover:text-foreground transition-colors
          ${className}
        `}
            >
                <input
                    ref={ref}
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4 accent-foreground transition-shadow focus:ring-2 focus:ring-border-strong focus:ring-offset-1"
                />
                <span className={checked ? "text-foreground type-data-strong" : "text-muted-strong"}>
                    {label}
                </span>
            </label>
        );
    }
);

FilterCheckbox.displayName = "FilterCheckbox";

export default FilterCheckbox;
