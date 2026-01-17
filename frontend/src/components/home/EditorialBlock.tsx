"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import { IconArrowRight } from "@/components/ui/icons";

type Props = {
    kicker?: string;
    title: string;
    description?: string;
    ctaText?: string;
    ctaHref?: string;
    variant?: "default" | "subtle" | "dark" | "warm" | "cool";
    size?: "normal" | "large";
    children?: React.ReactNode;
};

export default function EditorialBlock({
    kicker,
    title,
    description,
    ctaText,
    ctaHref,
    variant = "default",
    size = "normal",
    children,
}: Props) {
    // Monochrome palette only (design tokens)
    const bgClass = {
        default: "bg-background",
        subtle: "bg-subtle",
        dark: "ui-section-dark",
        warm: "bg-panel",    // use panel token
        cool: "bg-subtle",   // use subtle token
    }[variant];

    const textClass = variant === "dark" ? "text-background" : "text-foreground";
    const mutedClass = variant === "dark" ? "text-background/70" : "text-muted-strong";
    const paddingClass = size === "large" ? "py-20 sm:py-28 lg:py-32" : "py-16 sm:py-20 lg:py-24";

    return (
        <section className={`${bgClass} ${paddingClass}`}>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 text-center">
                {/* Kicker with decorative lines */}
                {kicker && (
                    <p className={`type-kicker mb-5 inline-flex items-center gap-4 justify-center ${mutedClass}`}>
                        <span className="h-px w-10 bg-current opacity-40" aria-hidden="true" />
                        {kicker}
                        <span className="h-px w-10 bg-current opacity-40" aria-hidden="true" />
                    </p>
                )}

                {/* Title - Large serif for editorial feel */}
                <h2 className={`type-h2 mb-5 ${textClass}`}>
                    {title}
                </h2>

                {/* Description */}
                {description && (
                    <p className={`type-body max-w-xl mx-auto mb-8 ${mutedClass}`}>
                        {description}
                    </p>
                )}

                {/* CTA */}
                {ctaText && ctaHref && (
                    <ButtonLink
                        href={ctaHref}
                        variant={variant === "dark" ? "secondary" : "primary"}
                        size="lg"
                        className="group inline-flex items-center gap-2"
                    >
                        {ctaText}
                        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </ButtonLink>
                )}

                {/* Optional children content below */}
                {children && <div className="mt-12">{children}</div>}
            </div>
        </section>
    );
}
