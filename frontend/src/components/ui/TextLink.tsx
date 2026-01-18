"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type LinkComponentProps = ComponentProps<typeof Link>;

type TextLinkProps = {
    href: LinkComponentProps["href"];
    children: React.ReactNode;
    className?: string;
    /** Use on dark backgrounds (hero, dark sections) */
    onDark?: boolean;
} & Omit<LinkComponentProps, "href" | "className" | "children">;

/**
 * TextLink - CK-style editorial underlined text CTA
 *
 * Use instead of ButtonLink when you want an editorial,
 * magazine-like appearance (e.g., "Shop Women" / "Shop Men").
 */
export default function TextLink({
    href,
    children,
    className = "",
    onDark = false,
    ...linkProps
}: TextLinkProps) {
    const colorClass = onDark ? "ui-hero-on-media" : "text-foreground";

    return (
        <Link
            href={href}
            className={`ui-cta-text ui-focus-ring ${colorClass} ${className}`}
            {...linkProps}
        >
            {children}
        </Link>
    );
}
