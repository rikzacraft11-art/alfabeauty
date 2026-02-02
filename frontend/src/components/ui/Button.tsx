import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "inverted";
export type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary: "ui-btn-primary",
  secondary: "ui-btn-secondary",
  inverted: "ui-btn-inverted",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-11 px-4 type-data-strong", // min 44px touch target
  md: "h-12 px-5",
  lg: "h-14 px-7",
};

/**
 * Generates button classes for non-button elements (links, etc.)
 */
export function getButtonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "type-ui-sm-strong ui-focus-ring ui-radius-none relative inline-flex items-center justify-center gap-3 border select-none disabled:cursor-not-allowed disabled:opacity-50 uppercase tracking-widest transition-all duration-300",
    variantClass[variant],
    sizeClass[size],
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

function Spinner() {
  return (
    <span className="ui-spinner" aria-hidden="true" />
  );
}

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading}
      className={getButtonClassName({ variant, size, className })}
    >

      {loading ? (
        <Spinner />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span className={loading ? "opacity-0" : undefined}>{children}</span>
      {!loading && rightIcon ? (
        <span className="shrink-0">{rightIcon}</span>
      ) : null}
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      ) : null}
    </button>
  );
}

