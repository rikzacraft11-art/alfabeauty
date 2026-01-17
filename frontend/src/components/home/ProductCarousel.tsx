"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";
import { listProducts } from "@/lib/catalog";
import { ScrollProgressBar } from "@/components/ui/ScrollIndicators";
import {
    IconChevronLeft,
    IconChevronRight,
    IconArrowRight,
} from "@/components/ui/icons";

type Props = {
    title?: string;
    subtitle?: string;
    maxItems?: number;
};

export default function ProductCarousel({ title, subtitle, maxItems = 10 }: Props) {
    const { locale } = useLocale();
    const tx = t(locale);
    const base = `/${locale}`;

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [progress, setProgress] = useState(0);
    const [thumbRatio, setThumbRatio] = useState(1);

    const products = listProducts().slice(0, maxItems);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

        const maxScroll = el.scrollWidth - el.clientWidth;
        const ratio = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
        const p = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
        setThumbRatio(Math.min(1, Math.max(0, ratio)));
        setProgress(Math.min(1, Math.max(0, p)));
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);
        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = el.querySelector("a")?.offsetWidth ?? 220;
        const scrollAmount = cardWidth * 3;
        el.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-10">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div className="space-y-2">
                        {subtitle && <p className="type-kicker">{subtitle}</p>}
                        <h2 className="type-h2">{title || tx.home.productsHighlight.title}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Circular Navigation Arrows (like reference) */}
                        <button
                            type="button"
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background
                         disabled:opacity-30 disabled:cursor-not-allowed
                         hover:bg-foreground hover:text-background hover:border-foreground transition-all
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-foreground/60"
                            aria-label="Previous"
                        >
                            <IconChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background
                         disabled:opacity-30 disabled:cursor-not-allowed
                         hover:bg-foreground hover:text-background hover:border-foreground transition-all
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-foreground/60"
                            aria-label="Next"
                        >
                            <IconChevronRight className="h-5 w-5" />
                        </button>
                        {/* View All Link */}
                        <AppLink
                            href={`${base}/products`}
                            className="hidden sm:inline-flex items-center gap-2 type-data-strong text-foreground ml-4
                         hover:underline underline-offset-4"
                        >
                            {tx.cta.viewAll}
                            <IconArrowRight className="h-4 w-4" />
                        </AppLink>
                    </div>
                </div>

                {/* Carousel - 5 items visible, edge-to-edge */}
                <div className="relative -mx-4 sm:-mx-6 lg:-mx-10">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                    >
                        {products.map((p) => (
                            <AppLink
                                key={p.slug}
                                href={`${base}/products/${p.slug}`}
                                underline="none"
                                className="group flex-shrink-0 w-[50%] sm:w-[33.333%] md:w-[25%] lg:w-[20%] snap-start 
                           border-r border-border last:border-r-0
                           bg-background overflow-hidden"
                            >
                                {/* Product Image - 90% focus (like reference) */}
                                <div className="relative aspect-[4/5] bg-subtle overflow-hidden">
                                    <Image
                                        src="/images/products/product-placeholder.jpg"
                                        alt={`${p.brand} ${p.name}`}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                {/* Product Info - Minimal (like reference: brand + name only) */}
                                <div className="p-4 space-y-0.5 border-t border-border">
                                    <p className="type-kicker text-muted group-hover:text-muted-strong transition-colors">
                                        {p.brand}
                                    </p>
                                    <h3 className="type-body text-foreground line-clamp-1">
                                        {p.name}
                                    </h3>
                                </div>
                            </AppLink>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                {thumbRatio < 1 ? (
                    <ScrollProgressBar
                        progress={progress}
                        thumbRatio={thumbRatio}
                        tone="light"
                        ariaLabel={locale === "id" ? "Posisi gulir" : "Scroll position"}
                        className="mt-4 bg-foreground/[0.85] p-3"
                    />
                ) : null}

                {/* Mobile View All */}
                <div className="mt-8 sm:hidden text-center">
                    <AppLink
                        href={`${base}/products`}
                        className="inline-flex items-center gap-2 type-body-strong text-foreground"
                    >
                        {tx.cta.viewAll}
                        <IconArrowRight className="h-4 w-4" />
                    </AppLink>
                </div>
            </div>
        </section>
    );
}
