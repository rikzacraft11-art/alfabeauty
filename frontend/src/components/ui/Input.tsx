import type { InputHTMLAttributes } from "react";

const base =
  "type-ui ui-focus-ring ui-radius-tight block border border-border-strong bg-background px-3 py-2 text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export default function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${base} ${className}`.trim()} />;
}
