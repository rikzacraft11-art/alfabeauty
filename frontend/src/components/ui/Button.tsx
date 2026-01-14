import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "type-ui-sm-strong ui-focus-ring ui-radius-tight inline-flex items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variantClass: Record<ButtonVariant, string> = {
  primary: "border-foreground bg-foreground text-background hover:bg-foreground/90",
  secondary: "border-border-strong bg-background text-foreground hover:bg-subtle",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-subtle",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-3",
  md: "h-11 px-5",
  lg: "h-12 px-6",
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

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      {...props}
      className={getButtonClassName({ variant, size, className })}
    />
  );
}
