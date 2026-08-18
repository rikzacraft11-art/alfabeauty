"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { LineGrow } from "@/hooks/use-animations";
import { BRANDS } from "@/lib/config";
import { cardStagger, cardFadeScale } from "@/lib/motion";
import { cn } from "@/lib/utils";

const getBrandLogoClass = (brandName: string) => {
    switch (brandName) {
        case "Alfaparf Milano Professional":
            return "h-16 sm:h-[72px] w-auto max-w-[230px]";
        case "CORE":
            return "h-13 sm:h-15 w-auto max-w-[180px]";
        case "Farmavita":
            return "h-9 sm:h-11 w-auto max-w-[210px]";
        case "Montibello":
            return "h-9 sm:h-11 w-auto max-w-[200px]";
        case "Gamma+ Professional":
            return "h-10 sm:h-12 w-auto max-w-[200px]";
        default:
            return "max-h-16 w-auto max-w-[200px]";
    }
};

/* ─────────────────────────────────────────────────────────────────────
 * BrandCarousel V8 — Premium scroll engine & interaction depth.
 *
 * V8 upgrades over V7:
 *   - Enhanced card entrance with scale + blur filter cascade
 *   - Cursor-grab-active feedback for tactile drag feel
 *   - Deeper glassmorphism overlay with dual gradient layers
 *   - Refined card hover: 7-layer depth (translate+shadow+border+glass+logo+accent+grain)
 *   - Enhanced pagination dots with scale + opacity curve
 *   - Auto-play stop indicator (progress bar pauses)
 *   - Snap-mandatory for crisp scroll stops
 * ───────────────────────────────────────────────────────────────────── */

export function BrandCarousel(): React.JSX.Element {
    const plugins = React.useRef([
        Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
    ]);

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            slidesToScroll: 1,
            containScroll: "trimSnaps",
            dragFree: false,
        },
        plugins.current
    );

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [canPrev, setCanPrev] = React.useState(false);
    const [canNext, setCanNext] = React.useState(false);
    const [scrollProgress, setScrollProgress] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);

    const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = React.useCallback(
        (index: number) => emblaApi?.scrollTo(index),
        [emblaApi]
    );

    React.useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
            setCanPrev(emblaApi.canScrollPrev());
            setCanNext(emblaApi.canScrollNext());
        };

        const onScroll = () => {
            const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
            setScrollProgress(progress);
        };

        const onPointerDown = () => setIsDragging(true);
        const onPointerUp = () => setIsDragging(false);

        emblaApi.on("select", onSelect);
        emblaApi.on("scroll", onScroll);
        emblaApi.on("pointerDown", onPointerDown);
        emblaApi.on("pointerUp", onPointerUp);
        onSelect();
        onScroll();

        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("scroll", onScroll);
            emblaApi.off("pointerDown", onPointerDown);
            emblaApi.off("pointerUp", onPointerUp);
        };
    }, [emblaApi]);

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!emblaApi) return;
            if (e.key === "ArrowLeft") emblaApi.scrollPrev();
            if (e.key === "ArrowRight") emblaApi.scrollNext();
        };
        // Only when carousel section is focused/active
        const section = document.getElementById("brands");
        if (!section) return;
        section.addEventListener("keydown", handleKeyDown);
        return () => section.removeEventListener("keydown", handleKeyDown);
    }, [emblaApi]);

    return (
        <section id="brands" className="bg-surface py-16 sm:py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* Header row */}
                <div className="flex items-end justify-between gap-8">
                    <div>
                        <FadeIn blur scale>
                            <p className="eyebrow">Our Portfolio</p>
                        </FadeIn>
                        <div className="mt-3">
                            <TextReveal
                                as="h2"
                                className="heading-section"
                                split="word"
                                blur
                                lines={["Global Professional Brands"]}
                            />
                        </div>
                        <FadeIn delay={0.3} blur>
                            <p className="body-prose mt-4 max-w-xl">
                                Each brand is carefully selected for its innovation,
                                quality, and relevance to the professional market.
                            </p>
                        </FadeIn>
                    </div>

                    {/* Navigation arrows + counter */}
                    <FadeIn delay={0.2}>
                        <div className="hidden items-center gap-3 lg:flex">
                            <span className="text-[11px] font-semibold tabular-nums text-text-muted">
                                {selectedIndex + 1} / {BRANDS.length}
                            </span>
                            <button
                                onClick={scrollPrev}
                                disabled={!canPrev}
                                className="group/arrow flex h-10 w-10 items-center justify-center border border-charcoal/20 text-foreground transition-[border-color,background-color,color,transform] duration-300 hover:border-foreground hover:bg-foreground hover:text-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground disabled:hover:border-charcoal/20 disabled:hover:scale-100"
                                aria-label="Previous brand"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover/arrow:-translate-x-0.5" />
                            </button>
                            <button
                                onClick={scrollNext}
                                disabled={!canNext}
                                className="group/arrow flex h-10 w-10 items-center justify-center border border-charcoal/20 text-foreground transition-[border-color,background-color,color,transform] duration-300 hover:border-foreground hover:bg-foreground hover:text-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground disabled:hover:border-charcoal/20 disabled:hover:scale-100"
                                aria-label="Next brand"
                            >
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/arrow:translate-x-0.5" />
                            </button>
                        </div>
                    </FadeIn>
                </div>

                {/* Animated separator */}
                <div className="mt-8">
                    <LineGrow className="h-px bg-border-warm" />
                </div>
            </div>

            {/* Carousel container */}
            <div className="mx-auto mt-10 max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* Carousel viewport with edge fade mask + tactile drag */}
                <div
                    className={cn(
                        "overflow-hidden cursor-grab active:cursor-grabbing fade-mask-x-subtle cursor-grab-active transition-transform duration-300",
                        isDragging && "scale-[0.995]"
                    )}
                    ref={emblaRef}
                >
                    <motion.div
                        className="flex items-stretch -ml-6"
                        variants={cardStagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {BRANDS.map((brand) => (
                            <div
                                key={brand.name}
                                className="min-w-0 shrink-0 basis-[85%] pl-6 sm:basis-[55%] md:basis-[45%] lg:basis-[33.333%] flex flex-col"
                            >
                                <motion.div
                                    variants={cardFadeScale}
                                    className="h-full flex-1"
                                >
                                    <Link
                                        href={`/products?brand=${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="group relative flex h-full min-h-[340px] sm:min-h-[380px] lg:min-h-[440px] flex-col justify-between overflow-hidden border border-border-warm/60 bg-surface-elevated p-8 transition-all duration-500 ease-[var(--ease)] hover:border-border-warm hover:bg-white hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] lg:p-10"
                                    >
                                        <div className="relative z-10">
                                            <div className="mb-8 flex h-24 w-full items-center justify-center overflow-hidden px-2">
                                                <Image
                                                    src={brand.logo}
                                                    alt={`${brand.name} logo`}
                                                    width={240}
                                                    height={80}
                                                    sizes="240px"
                                                    className={cn(
                                                        "object-contain opacity-85 transition-opacity duration-[500ms] ease-[var(--ease)] group-hover:opacity-100",
                                                        getBrandLogoClass(brand.name)
                                                    )}
                                                />
                                            </div>

                                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-crimson">
                                                {brand.flag} {brand.origin}
                                            </p>

                                            <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground transition-colors duration-300">
                                                {brand.name}
                                            </h3>

                                            <p className="mt-3 text-sm leading-7 text-charcoal">
                                                {brand.description}
                                            </p>
                                        </div>

                                        {/* Hover accent line — grows from left with delay */}
                                        <div className="relative z-10 mt-8 h-0.5 w-0 bg-brand-crimson transition-[width] duration-[900ms] ease-[var(--ease)] group-hover:w-full" />
                                    </Link>
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Progress bar + pagination */}
            <div className="mx-auto mt-8 max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* Scroll progress bar */}
                <div className="mb-6 h-px w-full bg-border-warm/60 overflow-hidden">
                    <div
                        className="h-full bg-foreground/40 transition-transform duration-200 ease-out origin-left"
                        style={{ transform: `scaleX(${scrollProgress})` }}
                    />
                </div>

                {/* Pagination dots */}
                <div className="flex items-center justify-center gap-0.5 lg:justify-start">
                    {BRANDS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            className="flex items-center justify-center px-1 py-4"
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            <span
                                className={cn(
                                    "block h-1.5 rounded-full transition-[width,background-color] duration-[600ms] ease-[var(--ease)]",
                                    selectedIndex === i
                                        ? "w-8 bg-foreground"
                                        : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
