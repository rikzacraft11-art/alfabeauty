"use client";

import { useRef, useState, useEffect, useCallback, useId } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { listProducts } from "@/lib/catalog";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ScrollDots, ScrollProgressBar } from "@/components/ui/ScrollIndicators";
import type { Product } from "@/lib/types";

// =============================================================================
// Constants (Reference: Lekker Home specs)
// =============================================================================

const SPECS = {
    productGap: 16, // Gap between product cards (matches Tailwind gap-4)
} as const;

// =============================================================================
// Types
// =============================================================================

interface EditorialCarouselSectionProps {
    heroImage?: string;
    heroImages?: string[];
    heroAlt?: string;
    kicker?: string;
    title: string;
    description?: string;
    badge?: string; // Optional badge text (e.g., "Free for Partners")
    variant?: "light" | "dark";
    maxItems?: number;
    ctaHref?: string;
    ctaLabel?: string;
}

interface ProductCardProps {
    product: Product;
    baseUrl: string;
    isDark: boolean;
}

interface CarouselArrowProps {
    direction: "left" | "right";
    onClick: () => void;
    visible: boolean;
    className?: string;
    ariaLabel?: string;
    topClassName?: string;
}

// =============================================================================
// Custom Hook: useCarousel
// =============================================================================

/**
 * useCarousel - Manages carousel scroll state and navigation
 * Extracted for reusability and testability
 */
function useCarousel(itemCount: number) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [progress, setProgress] = useState(0);
    const [thumbRatio, setThumbRatio] = useState(1);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        if (itemCount <= 1) {
            setCanScrollLeft(false);
            setCanScrollRight(false);
            return;
        }

        const scrollLeft = el.scrollLeft;
        const maxScroll = el.scrollWidth - el.clientWidth;

        const ratio = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
        const p = maxScroll > 0 ? scrollLeft / maxScroll : 0;

        setThumbRatio(Math.min(1, Math.max(0, ratio)));
        setProgress(Math.min(1, Math.max(0, p)));

        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(maxScroll > 10 && scrollLeft < maxScroll - 10);
    }, [itemCount]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        updateScrollState();
        window.addEventListener("resize", updateScrollState);
        el.addEventListener("scroll", updateScrollState, { passive: true });

        return () => {
            window.removeEventListener("resize", updateScrollState);
            el.removeEventListener("scroll", updateScrollState);
        };
    }, [updateScrollState]);

    const scroll = useCallback((direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;

        // Get actual card width from first card element (CSS-controlled)
        const firstCard = el.querySelector<HTMLElement>("[data-carousel-card]");
        const cardWidth = firstCard?.offsetWidth ?? 260;
        const scrollAmount = cardWidth + SPECS.productGap;
        el.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    }, []);

    return {
        scrollRef,
        canScrollLeft,
        canScrollRight,
        progress,
        thumbRatio,
        scroll,
    };
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * CarouselArrow - Navigation button for carousel
 * Accessible with proper ARIA attributes
 */
function CarouselArrow({ direction, onClick, visible, className, ariaLabel, topClassName }: CarouselArrowProps) {
    if (!visible) return null;

    const isLeft = direction === "left";
    const Icon = isLeft ? IconChevronLeft : IconChevronRight;
    const label = ariaLabel ?? (isLeft ? "Previous" : "Next");
    const position = isLeft ? "left-[-10px]" : "right-[-10px]";
    const top = topClassName ?? "top-1/3 -translate-y-1/2";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                absolute ${position} ${top} z-10
                flex items-center justify-center
                h-11 w-11
                rounded-full
                bg-background/[0.92] text-foreground
                shadow-md
                transition-all duration-200
                hover:scale-105 hover:bg-background
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-foreground/60
                ${className ?? ""}
            `}
            aria-label={label}
        >
            <Icon className="h-5 w-5 block" />
        </button>
    );
}

/**
 * ProductCard - Individual product in carousel
 * LekkerHome approach: fixed aspect images + fixed min-height text block
 * Mobile-first: touch-friendly with proper spacing
 * Enhanced: audience badge + benefit snippet per UX research
 */
function ProductCard({ product, baseUrl, isDark }: ProductCardProps) {
    // Get primary audience for badge
    const primaryAudience = product.audience?.[0];
    // Get first benefit as snippet
    const benefitSnippet = product.benefits?.[0];

    return (
        <AppLink
            href={`${baseUrl}/products/${product.slug}`}
            underline="none"
            className={`group carousel-card snap-start ui-radius-tight overflow-hidden flex flex-col h-full ${isDark ? "bg-background/[0.08]" : "bg-foreground/[0.04]"}`}
            data-carousel-card
        >
            {/* Product Image - Fixed 1:1 aspect ratio (LekkerHome: uniform image heights) */}
            <div className="relative aspect-square overflow-hidden flex-shrink-0">
                <Image
                    src="/images/products/product-placeholder.jpg"
                    alt={`${product.brand} ${product.name}`}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 260px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Audience badge */}
                {primaryAudience && (
                    <span
                        className={`absolute top-2 left-2 type-data px-2 py-1 ui-radius-tight ${isDark
                            ? "bg-background text-foreground"
                            : "bg-foreground text-background"
                            }`}
                    >
                        {primaryAudience}
                    </span>
                )}
            </div>

            {/* Product Info - Fixed min-height for consistent card alignment */}
            <div className="p-3 flex flex-col min-h-[5.5rem]">
                <p className={`type-data-strong uppercase mb-1 ${isDark ? "text-background/75" : "text-foreground-muted"}`}>
                    {product.brand}
                </p>
                <h3 className={`type-body-strong line-clamp-2 ${isDark ? "text-background" : "text-foreground"}`}>
                    {product.name}
                </h3>
                {/* Benefit snippet for decision support */}
                {benefitSnippet && (
                    <p className={`type-data mt-1 line-clamp-1 ${isDark ? "text-background/60" : "text-muted"}`}>
                        {benefitSnippet}
                    </p>
                )}
            </div>
        </AppLink>
    );
}

/**
 * SectionHeader - Kicker, title, and description
 */
function SectionHeader({
    kicker,
    title,
    description,
    badge,
    isDark,
    titleId,
    ctaHref,
    ctaLabel,
}: {
    kicker?: string;
    title: string;
    description?: string;
    badge?: string;
    isDark: boolean;
    titleId?: string;
    ctaHref?: string;
    ctaLabel?: string;
}) {
    return (
        <div className="text-center" style={{ marginBottom: "var(--card-padding)" }}>
            {/* Badge (e.g., "Free for Partners") */}
            {badge && (
                <span className={`inline-block mb-3 px-3 py-1 type-data-strong ui-radius-tight ${isDark
                    ? "bg-background text-foreground"
                    : "bg-foreground text-background"
                    }`}>
                    {badge}
                </span>
            )}

            {kicker && (
                <p className="type-kicker mb-2 sm:mb-3">
                    {kicker}
                </p>
            )}
            <h2
                id={titleId}
                className={`type-h2 mb-2 sm:mb-3 ${isDark ? "text-background" : "text-foreground"}`}
            >
                {title}
            </h2>
            {description && (
                <p className={`type-body mx-auto px-4 sm:px-0 max-w-[42rem] ${isDark ? "text-background/75" : ""}`}>
                    {description}
                </p>
            )}

            {ctaHref && ctaLabel ? (
                <div className="mt-4 sm:mt-5 flex justify-center">
                    <AppLink
                        href={ctaHref}
                        underline="none"
                        className={`type-ui-strong inline-flex items-center justify-center border border-border px-5 h-12 ui-radius-tight ui-focus-ring ${isDark
                            ? "bg-background text-foreground hover:bg-subtle"
                            : "bg-foreground text-background hover:bg-foreground/90"
                            }`}
                    >
                        {ctaLabel}
                    </AppLink>
                </div>
            ) : null}
        </div>
    );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * EditorialCarouselSection
 * 
 * Editorial hero image with overlapping product carousel.
 * Reference: Lekker Home "Bestsellers of 2025" section.
 * 
 * Features:
 * - Contained hero image (not full-bleed)
 * - Overlapping content card
 * - Linear scroll carousel with conditional arrows
 * - Mobile-first responsive design
 * 
 * Clean Code:
 * - Uses shared icons from @/components/ui/icons
 * - Carousel logic extracted to useCarousel hook
 * - Sub-components for single responsibility
 */
export default function EditorialCarouselSection({
    heroImage = "/images/hero/hero-salon.jpg",
    heroImages,
    heroAlt = "Lifestyle editorial",
    kicker,
    title,
    description,
    badge,
    variant = "dark",
    maxItems = 8,
    ctaHref,
    ctaLabel,
}: EditorialCarouselSectionProps) {
    const { locale } = useLocale();
    const prefersReducedMotion = usePrefersReducedMotion();
    const baseUrl = `/${locale}`;
    const sectionId = useId().replace(/:/g, "");
    const titleId = `section-title-${sectionId}`;

    const allProducts = listProducts();
    const products = allProducts.slice(0, maxItems);

    const isDark = variant === "dark";

    const { scrollRef, canScrollLeft, canScrollRight, progress: productProgress, thumbRatio: productThumbRatio, scroll } = useCarousel(products.length);

    const galleryImages = (() => {
        if (heroImages && heroImages.length > 0) return heroImages;

        // Default: reuse existing available local assets to enable a real gallery.
        // If only one image is desired, pass heroImages={[heroImage]}.
        const defaults = [
            heroImage,
            "/images/partnership/partner-lifestyle.jpg",
        ];
        return Array.from(new Set(defaults));
    })();

    const heroScrollRef = useRef<HTMLDivElement>(null);
    const [canHeroScrollLeft, setCanHeroScrollLeft] = useState(false);
    const [canHeroScrollRight, setCanHeroScrollRight] = useState(galleryImages.length > 1);
    const [heroActiveIndex, setHeroActiveIndex] = useState(0);

    const updateHeroScrollState = useCallback(() => {
        const el = heroScrollRef.current;
        if (!el) return;

        if (galleryImages.length <= 1) {
            setCanHeroScrollLeft(false);
            setCanHeroScrollRight(false);
            return;
        }

        const scrollLeft = el.scrollLeft;
        const maxScroll = el.scrollWidth - el.clientWidth;

        setCanHeroScrollLeft(scrollLeft > 10);
        setCanHeroScrollRight(maxScroll > 10 && scrollLeft < maxScroll - 10);

        // Active slide index for dot indicators.
        const firstSlide = el.querySelector<HTMLElement>("[data-hero-slide='true']");
        const slideWidth = firstSlide?.offsetWidth ?? el.clientWidth;
        const gap = Number.parseFloat(window.getComputedStyle(el).columnGap || "0") || 0;
        const step = slideWidth + gap;
        const idx = step > 0 ? Math.round(scrollLeft / step) : 0;

        const clampedIdx = Math.min(galleryImages.length - 1, Math.max(0, idx));
        setHeroActiveIndex((prev) => (prev === clampedIdx ? prev : clampedIdx));
    }, [galleryImages.length]);

    useEffect(() => {
        const el = heroScrollRef.current;
        if (!el) return;

        // Defer initial measurement to the next paint so scrollWidth/clientWidth are accurate.
        // This avoids the "setState synchronously within an effect" warning and prevents
        // incorrect arrow visibility on first render.
        const raf = window.requestAnimationFrame(() => {
            updateHeroScrollState();
        });

        el.addEventListener("scroll", updateHeroScrollState, { passive: true });
        window.addEventListener("resize", updateHeroScrollState);

        return () => {
            window.cancelAnimationFrame(raf);
            el.removeEventListener("scroll", updateHeroScrollState);
            window.removeEventListener("resize", updateHeroScrollState);
        };
    }, [updateHeroScrollState]);

    const scrollHero = useCallback((direction: "left" | "right") => {
        const el = heroScrollRef.current;
        if (!el) return;

        const firstSlide = el.querySelector<HTMLElement>("[data-hero-slide='true']");
        const slideWidth = firstSlide?.offsetWidth ?? el.clientWidth;
        const gap = Number.parseFloat(window.getComputedStyle(el).columnGap || "0") || 0;
        const scrollAmount = slideWidth + gap;
        el.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    }, [prefersReducedMotion]);

    const scrollHeroToIndex = useCallback((index: number) => {
        const el = heroScrollRef.current;
        if (!el) return;

        const firstSlide = el.querySelector<HTMLElement>("[data-hero-slide='true']");
        const slideWidth = firstSlide?.offsetWidth ?? el.clientWidth;
        const gap = Number.parseFloat(window.getComputedStyle(el).columnGap || "0") || 0;
        const step = slideWidth + gap;
        const target = Math.min(galleryImages.length - 1, Math.max(0, index)) * step;

        el.scrollTo({
            left: target,
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    }, [galleryImages.length, prefersReducedMotion]);

    if (products.length === 0) {
        return null;
    }

    return (
        <section
            className="relative py-12 sm:py-16 lg:py-20"
            aria-labelledby={titleId}
        >
            {/* Hero Image - Contained, responsive aspect ratio */}
            <div className="px-4 sm:px-6 lg:px-10">
                <div
                    className="relative mx-auto overflow-hidden ui-radius-tight max-w-[120rem] aspect-[1.6/1] lg:aspect-[2.5/1]"
                >
                    {/* Horizontally scrollable hero gallery (snap) */}
                    <div
                        ref={heroScrollRef}
                        className="flex h-full w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
                        role="list"
                        aria-label={locale === "id" ? "Galeri editorial" : "Editorial gallery"}
                        tabIndex={galleryImages.length > 1 ? 0 : -1}
                        onKeyDown={(event) => {
                            if (galleryImages.length <= 1) return;
                            if (event.key === "ArrowLeft") {
                                event.preventDefault();
                                scrollHero("left");
                            }
                            if (event.key === "ArrowRight") {
                                event.preventDefault();
                                scrollHero("right");
                            }
                        }}
                    >
                        {galleryImages.map((src, idx) => (
                            <div
                                key={`${src}-${idx}`}
                                role="listitem"
                                data-hero-slide="true"
                                className="relative h-full w-full flex-shrink-0 snap-start"
                                aria-label={`${idx + 1} / ${galleryImages.length}`}
                            >
                                <Image
                                    src={src}
                                    alt={heroAlt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1920px) 96vw, 1920px"
                                    priority={idx === 0}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Hero navigation arrows (desktop only; swipe on mobile) */}
                    <CarouselArrow
                        direction="left"
                        onClick={() => scrollHero("left")}
                        visible={canHeroScrollLeft}
                        ariaLabel={locale === "id" ? "Sebelumnya" : "Previous"}
                        topClassName="top-1/2 -translate-y-1/2"
                        className="hidden sm:flex"
                    />
                    <CarouselArrow
                        direction="right"
                        onClick={() => scrollHero("right")}
                        visible={canHeroScrollRight}
                        ariaLabel={locale === "id" ? "Berikutnya" : "Next"}
                        topClassName="top-1/2 -translate-y-1/2"
                        className="hidden sm:flex"
                    />

                    {/* Dot indicators - positioned above overlap zone */}
                    <ScrollDots
                        count={galleryImages.length}
                        activeIndex={heroActiveIndex}
                        onSelect={scrollHeroToIndex}
                        tone="onImage"
                        ariaLabel={locale === "id" ? "Navigasi galeri" : "Gallery navigation"}
                        className="absolute bottom-[calc(var(--section-overlap)+1rem)] left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
                    />
                </div>
            </div>

            {/* Content Card - Overlaps hero */}
            <div className="relative px-4 sm:px-6 lg:px-10">
                <div
                    className={`relative mx-auto ui-radius-tight max-w-[68.75rem] ${isDark ? "ui-section-dark" : "bg-subtle"}`}
                    style={{ marginTop: "calc(-1 * var(--section-overlap))" }}
                >
                    <div style={{ padding: "var(--card-padding)" }}>
                        {/* Section Header */}
                        <SectionHeader
                            kicker={kicker}
                            title={title}
                            description={description}
                            badge={badge}
                            isDark={isDark}
                            titleId={titleId}
                            ctaHref={ctaHref}
                            ctaLabel={ctaLabel}
                        />

                        {/* Product Carousel */}
                        <div
                            className="relative"
                            role="region"
                            aria-label={locale === "id" ? "Produk pilihan" : "Featured products"}
                        >
                            {/* Navigation Arrows - positioned at 1/4 height (center of card image) */}
                            <CarouselArrow
                                direction="left"
                                onClick={() => scroll("left")}
                                visible={canScrollLeft}
                                topClassName="top-1/4"
                                className="hidden sm:flex"
                            />
                            <CarouselArrow
                                direction="right"
                                onClick={() => scroll("right")}
                                visible={canScrollRight}
                                topClassName="top-1/4"
                                className="hidden sm:flex"
                            />

                            {/* Scrollable Product List */}
                            <div
                                ref={scrollRef}
                                className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory gap-4"
                                role="list"
                                tabIndex={0}
                                aria-describedby={titleId}
                                onKeyDown={(event) => {
                                    if (event.key === "ArrowLeft") {
                                        event.preventDefault();
                                        scroll("left");
                                    }
                                    if (event.key === "ArrowRight") {
                                        event.preventDefault();
                                        scroll("right");
                                    }
                                }}
                            >
                                {products.map((product, idx) => (
                                    <div key={`${product.slug}-${idx}`} role="listitem">
                                        <ProductCard
                                            product={product}
                                            baseUrl={baseUrl}
                                            isDark={isDark}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Scroll indicator */}
                            {productThumbRatio < 1 ? (
                                <ScrollProgressBar
                                    progress={productProgress}
                                    thumbRatio={productThumbRatio}
                                    tone={isDark ? "dark" : "light"}
                                    ariaLabel={locale === "id" ? "Posisi gulir" : "Scroll position"}
                                    className={isDark ? "mt-4" : "mt-4 bg-foreground/[0.85] p-3"}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
