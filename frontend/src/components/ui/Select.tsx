import { forwardRef, type SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

// Enhanced for mobile: larger padding for touch, type-ui token for consistent sizing
const base =
  "type-ui ui-focus-ring ui-radius-tight block w-full border bg-panel px-4 py-3 text-foreground transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2371717a%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 disabled:cursor-not-allowed disabled:opacity-50";

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = "", error, ...props },
  ref
) {
  const stateClass = error
    ? "border-error bg-error-bg focus:border-error"
    : "border-border-strong hover:border-muted focus:border-foreground";

  return (
    <select
      ref={ref}
      {...props}
      className={`${base} ${stateClass} ${className}`.trim()}
      aria-invalid={error ? "true" : undefined}
    />
  );
});

export default Select;
