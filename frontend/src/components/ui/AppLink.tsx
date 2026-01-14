import Link from "next/link";
import { forwardRef } from "react";
import type { ComponentProps, ReactNode } from "react";

/**
 * Enterprise link primitive.
 *
 * Goals:
 * - Consistent focus-visible affordance (keyboard)
 * - Consistent underline behavior
 * - Avoid repeating per-link className strings
 *
 * Notes:
 * - Use `ButtonLink` for links that should look/behave like buttons.
 * - Keep typography tokens (type-*) close to where the link is used.
 */

type NextLinkProps = ComponentProps<typeof Link>;

type Props = Omit<NextLinkProps, "className" | "children"> & {
  className?: string;
  children: ReactNode;
  /**
   * Underline style:
   * - "auto": default underline on hover (safe for most body links)
   * - "always": always underlined
   * - "none": no underline (rare; only when surrounding UI already indicates clickability)
   */
  underline?: "auto" | "always" | "none";
};

const AppLink = forwardRef<HTMLAnchorElement, Props>(function AppLink(
  { className = "", underline = "auto", children, ...props },
  ref,
) {
  const underlineClass =
    underline === "always"
      ? "underline"
      : underline === "none"
        ? "no-underline"
        : "hover:underline";

  return (
    <Link
      {...props}
      ref={ref}
      className={`ui-focus-ring ui-radius-tight underline-offset-2 ${underlineClass} ${className}`.trim()}
    >
      {children}
    </Link>
  );
});

export default AppLink;
