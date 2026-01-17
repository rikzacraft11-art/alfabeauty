import { forwardRef, type TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

// Enhanced mobile support with better touch targets and consistent type sizing
const base =
  "type-ui ui-focus-ring ui-radius-tight block w-full border bg-panel px-4 py-3 text-foreground placeholder:text-muted-soft transition-colors resize-y min-h-[120px] disabled:cursor-not-allowed disabled:opacity-50";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className = "", error, ...props },
  ref
) {
  const stateClass = error
    ? "border-error bg-error-bg focus:border-error"
    : "border-border-strong hover:border-muted focus:border-foreground";

  return (
    <textarea
      ref={ref}
      {...props}
      className={`${base} ${stateClass} ${className}`.trim()}
      aria-invalid={error ? "true" : undefined}
    />
  );
});

export default Textarea;
