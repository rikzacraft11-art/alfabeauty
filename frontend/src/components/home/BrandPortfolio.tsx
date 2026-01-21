"use client";

import * as React from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { brands, getBrandPortfolioContent } from "@/content/homepage";
import { ScrollProgressBar } from "@/components/ui/ScrollIndicators";

// =============================================================================
// Types
// =============================================================================

interface BrandLogoProps {
    name: string;
    logo?: string;
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * BrandLogo - Brand logo with fallback to text
 * Uses external CDN for logo images
 */
function BrandLogo({ name, logo }: BrandLogoProps) {
    if (logo) {
        return (
            <div
                className="flex h-full w-full items-center justify-center px-4 py-2"
                title={name}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={logo}
                    alt={name}
                    className="h-8 sm:h-10 lg:h-12 w-auto max-w-[120px] sm:max-w-[140px] object-contain transition-cinematic hover:scale-105"
                    loading="lazy"
                />
            </div>
        );
    }

    // Fallback to text
    return (
        <div
            className="flex h-full w-full items-center justify-center px-6"
            title={name}
        >
            <span className="type-h3 text-foreground whitespace-nowrap">
                {name}
            </span>
        </div>
    );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * BrandPortfolio - Partner brand logo showcase
 * 
 * Features:
 * - Horizontal scroll on mobile
 * - 6-column grid on desktop
 * - Fade edges on mobile for scroll indication
 * 
 * Clean Code:
 * - Uses centralized content from homepage.ts
 * - Simple, focused component
 */
export default function BrandPortfolio() {
    const { locale } = useLocale();
    const content = getBrandPortfolioContent(locale);

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [progress, setProgress] = React.useState(0);
    const [thumbRatio, setThumbRatio] = React.useState(1);

    const update = React.useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        const ratio = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
        const p = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;

        setThumbRatio(Math.min(1, Math.max(0, ratio)));
        setProgress(Math.min(1, Math.max(0, p)));
    }, []);

    React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const raf = window.requestAnimationFrame(() => update());
        el.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        return () => {
            window.cancelAnimationFrame(raf);
            el.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [update]);

    return (
        <section
            className="section-py-md"
            aria-labelledby="brand-portfolio-title"
        >
            {/* Section Header */}
            <div className="text-center mb-6 sm:mb-8">
                <p className="type-kicker mb-2">
                    {content.kicker}
                </p>
                <h2 id="brand-portfolio-title" className="type-h3">
                    {content.title}
                </h2>
                {content.subtitle && (
                    <p className="mt-2 type-body text-muted">
                        {content.subtitle}
                    </p>
                )}
            </div>

            {/* Brand Strip */}
            <div className="relative">
                {/* Fade edges on mobile - visual scroll indicator */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none sm:hidden"
                    aria-hidden="true"
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none sm:hidden"
                    aria-hidden="true"
                />

                {/* Scrollable container */}
                <div ref={scrollRef} className="overflow-x-auto pb-4 sm:pb-0 scrollbar-hide">
                    <div
                        className="flex sm:grid sm:grid-cols-6 gap-px bg-border min-w-max sm:min-w-0"
                        role="list"
                        aria-label={content.title}
                    >
                        {brands.map((brand) => (
                            <div
                                key={brand.slug}
                                role="listitem"
                                className="h-20 sm:h-24 lg:h-28 w-36 sm:w-auto bg-background flex items-center justify-center
                                           hover:bg-subtle transition-cinematic cursor-default"
                            >
                                <BrandLogo name={brand.name} logo={brand.logo} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator (mobile-only) */}
                {thumbRatio < 1 ? (
                    <div className="px-4 sm:hidden">
                        <ScrollProgressBar
                            progress={progress}
                            thumbRatio={thumbRatio}
                            tone="light"
                            ariaLabel={locale === "id" ? "Posisi gulir" : "Scroll position"}
                            className="bg-foreground/[0.85] p-3"
                        />
                    </div>
                ) : null}
            </div>

            {/* Footer text */}
            <div className="text-center mt-4 sm:mt-6">
                <p className="type-data text-muted">
                    {content.footer}
                </p>
            </div>
        </section>
    );
}
