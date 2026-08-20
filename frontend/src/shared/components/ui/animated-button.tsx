"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

/* ─────────────────────────────────────────────────────────────────────
 * AnimatedButton — Yucca-style fill-sweep hover effect
 *
 * V2: Complete rewrite — does NOT wrap shadcn <Button>.
 * Renders its own <a> or <button> directly so the .btn-fill and
 * .btn-label structure is guaranteed correct without Radix Slot
 * nesting issues.
 *
 * The fill color slides up from 104% ➜ 0% on hover (CSS-only).
 * On hover, the label text color transitions to fillTextClass.
 *
 * Usage:
 *   <AnimatedButton href="/products" fillClass="bg-white" fillTextClass="text-brand-crimson">
 *     Explore Our Brands <ArrowRight className="h-4 w-4" />
 *   </AnimatedButton>
 * ───────────────────────────────────────────────────────────────────── */

interface AnimatedButtonProps extends React.ComponentProps<"a"> {
  /** Link destination — renders <a> when provided, <button> otherwise */
  href?: string;
  /** Class(es) for the sweep-fill layer (e.g. "bg-white") */
  fillClass?: string;
  /** Text color class when fill is visible (hover state) */
  fillTextClass?: string;
  /** Whether to open link in new tab */
  external?: boolean;
  children: React.ReactNode;
}

export function AnimatedButton({
  href,
  fillClass = "bg-white",
  fillTextClass = "text-foreground",
  external,
  children,
  className,
  ...props
}: AnimatedButtonProps): React.JSX.Element {
  const fillTextColor = fillTextClass.replace("text-", "");
  const cssVars = {
    "--btn-fill-text": `var(--color-${fillTextColor}, currentColor)`,
  } as React.CSSProperties;

  const baseClasses = cn(
    // Match shadcn button styling
    "btn-animated group/btn inline-flex items-center justify-center",
    "h-10 px-8 py-6",
    "text-[11px] font-bold uppercase tracking-[0.15em]",
    "rounded-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    className,
  );

  const inner = (
    <>
      <span className={cn("btn-fill", fillClass)} aria-hidden="true" />
      <span className="btn-label">{children}</span>
    </>
  );

  if (href) {
    // Exclude any HTML anchor props that conflict with Link
    const linkSafeProps = { ...props } as Record<string, unknown>;
    delete linkSafeProps.role;
    return (
      <Link
        href={href}
        className={baseClasses}
        style={cssVars}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...linkSafeProps}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClasses}
      style={cssVars}
      {...(props as React.ComponentProps<"button">)}
    >
      {inner}
    </button>
  );
}
