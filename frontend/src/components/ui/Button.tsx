import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverted";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "type-ui-sm-strong ui-focus-ring ui-radius-tight relative inline-flex items-center justify-center gap-2 border select-none disabled:cursor-not-allowed disabled:opacity-50";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "ui-btn-primary active:scale-[0.98]",
  secondary:
    "ui-btn-secondary active:scale-[0.98]",
  inverted:
    "ui-btn-inverted active:scale-[0.98]",
  ghost:
    "ui-btn-ghost",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-11 px-4 type-data-strong", // min 44px touch target
  md: "h-12 px-5",
  lg: "h-14 px-7",
};

export function getButtonClassName({
  variant,
  size,
  className = "",
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  className?: string;
}) {
  return `${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`.trim();
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
