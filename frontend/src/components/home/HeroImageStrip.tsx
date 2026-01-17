"use client";

import * as React from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { categories, getCategoryLabel, getCategoryStripTitle } from "@/content/homepage";
import { ScrollProgressBar } from "@/components/ui/ScrollIndicators";

// =============================================================================
// Types
// =============================================================================

interface CategoryCardProps {
    image: string;
    label: string;
    href: string;
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * CategoryCard - Individual category with image and label
 * Touch-friendly: minimum 140px width on mobile
 */
function CategoryCard({ image, label, href }: CategoryCardProps) {
    return (
        <AppLink
            href={href}
            underline="none"
            className="group block w-[140px] sm:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground/60"
        >
            {/* 4:3 aspect ratio image */}
            <div className="relative aspect-[4/3] overflow-hidden border border-border">
                <Image
                    src={image}
                    alt={label}
                    fill
                    sizes="(max-width: 640px) 140px, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="py-3 text-center">
                <span className="type-data text-muted-strong group-hover:text-foreground transition-colors">
                    {label}
                </span>
            </div>
        </AppLink>
    );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * HeroImageStrip - Category navigation strip
 * 
 * Features:
 * - Horizontal scroll on mobile (touch-friendly)
 * - Grid layout on desktop (6 columns)
 * - Mobile-first responsive design
 * 
 * Clean Code:
 * - Uses centralized content from homepage.ts
 * - CategoryCard extracted for reusability
 */
export default function HeroImageStrip() {
    const { locale } = useLocale();
    const baseUrl = `/${locale}`;
    const sectionTitle = getCategoryStripTitle(locale);

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [progress, setProgress] = React.useState(0);
    const [thumbRatio, setThumbRatio] = React.useState(1);

    const update = React.useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        // Use item geometry so the indicator reflects the snapped card paging,
        // not raw scrollWidth (which is distorted by container padding/gaps).
        const items = Array.from(el.querySelectorAll<HTMLElement>("[data-strip-item='true']"));
        if (items.length === 0) return;

        const total = items.length;

        // Determine the scroll step based on actual offsets.
        const step = items.length > 1
            ? Math.max(1, items[1].offsetLeft - items[0].offsetLeft)
            : Math.max(1, items[0].offsetWidth);

        const visibleCount = Math.max(1, Math.floor(el.clientWidth / step));
        const maxIndex = Math.max(0, total - visibleCount);

        const rawIndex = Math.round(el.scrollLeft / step);
        const index = Math.min(maxIndex, Math.max(0, rawIndex));

        const p = maxIndex > 0 ? index / maxIndex : 0;
        const ratio = Math.min(1, visibleCount / total);

        setThumbRatio(ratio);
        setProgress(p);
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
            className="bg-background py-6 sm:py-8 lg:py-10"
            aria-labelledby="category-strip-title"
        >
            {/* Boxed container */}
            <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-10">
                {/* Section header */}
                <p
                    id="category-strip-title"
                    className="type-kicker text-center mb-4 sm:mb-6"
                >
                    {sectionTitle}
                </p>

                {/* Mobile: horizontal scroll, Desktop: 6-column grid */}
                <div ref={scrollRef} className="overflow-x-auto sm:overflow-x-visible scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
                    <div
                        className="grid grid-flow-col auto-cols-[140px] sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-6 gap-3 sm:gap-4"
                        role="list"
                        aria-label={sectionTitle}
                    >
                        {categories.map((cat) => (
                            <div key={cat.key} role="listitem" className="snap-start" data-strip-item="true">
                                <CategoryCard
                                    image={cat.image}
                                    label={getCategoryLabel(locale, cat.key)}
                                    href={`${baseUrl}/products?category=${cat.key}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator (mobile-only) */}
                {thumbRatio < 1 ? (
                    <ScrollProgressBar
                        progress={progress}
                        thumbRatio={thumbRatio}
                        tone="light"
                        thickness="thin"
                        trackClassName="bg-foreground/[0.18]"
                        thumbClassName="bg-indicator-fixed"
                        ariaLabel={locale === "id" ? "Posisi gulir" : "Scroll position"}
                        className="mt-4 sm:hidden"
                    />
                ) : null}
            </div>
        </section>
    );
}
