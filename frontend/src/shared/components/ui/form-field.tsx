"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

/* ─────────────────────────────────────────────────────────────────────
 * FormField — Shared form field wrapper with label + error display.
 *
 * Follows Shadcn/ui component conventions:
 *   - Composable (wrap any input element)
 *   - className forwarding via cn()
 *   - Accessible label-to-input association via auto-generated id
 *
 * Usage:
 *   <FormField label="Name" error={errors.name}>
 *     <input className={fieldClass(errors.name)} ... />
 *   </FormField>
 * ───────────────────────────────────────────────────────────────────── */

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactElement<{ id?: string; "aria-describedby"?: string }>;
  className?: string;
  id?: string;
}

export function FormField({
  label,
  error,
  children,
  className,
  id: externalId,
}: FormFieldProps): React.JSX.Element {
  const autoId = React.useId();
  const fieldId = externalId ?? autoId;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-xs font-semibold text-charcoal"
      >
        {label}
      </label>
      {React.cloneElement(children, {
        id: fieldId,
        "aria-describedby": errorId,
      })}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-brand-crimson" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Standard field class string for form inputs.
 * Pass an error string to switch to the error border style.
 */
export function fieldClass(error?: string): string {
  return cn(
    "w-full border bg-background px-4 py-3 sm:py-2.5 text-base sm:text-sm outline-none transition-colors focus:border-foreground placeholder:text-text-muted/60",
    error ? "border-brand-crimson" : "border-border-warm"
  );
}
