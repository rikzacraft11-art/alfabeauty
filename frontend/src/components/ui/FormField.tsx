"use client";

import { forwardRef, useId, type ReactNode } from "react";

interface FormFieldProps {
    /** Field label text */
    label: string;
    /** Whether the field is required */
    required?: boolean;
    /** Error message to display */
    error?: string;
    /** Hint text below the input */
    hint?: string;
    /** The form input element */
    children: ReactNode;
    /** Optional className for the wrapper */
    className?: string;
}

/**
 * FormField Component
 * 
 * Standardized wrapper for form fields providing:
 * - Consistent label styling
 * - Required field indicator
 * - Error message display
 * - Optional hint text
 * 
 * Follows HCI principles:
 * - Clear visual hierarchy
 * - Immediate error feedback
 * - Consistent spacing
 */
const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
    ({ label, required = false, error, hint, children, className = "" }, ref) => {
        const id = useId();
        const errorId = `${id}-error`;
        const hintId = `${id}-hint`;

        return (
            <div ref={ref} className={`space-y-1.5 ${className}`}>
                <label className="block type-data-strong text-foreground">
                    {label}
                    {required && (
                        <span className="text-error ml-0.5" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>

                {children}

                {hint && !error && (
                    <p id={hintId} className="type-data text-muted">
                        {hint}
                    </p>
                )}

                {error && (
                    <p id={errorId} className="type-data text-error flex items-center gap-1.5" role="alert">
                        <svg
                            className="h-4 w-4 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";

export default FormField;
