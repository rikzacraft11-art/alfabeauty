"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * BrandShowroom (Section 5 — High-Fashion Editorial Brand Showcase)
 *
 * Typography & Layout System:
 * - Fully bilingual (100% ID in Indonesian mode, 100% EN in English mode)
 * - Uses standardized design system typography and tracked links.
 * ───────────────────────────────────────────────────────────────────── */

export function BrandShowroom(): React.JSX.Element {
    const { dict } = useLanguage();
    const brands = dict.brandShowroom.brands;

    const [activeId, setActiveId] = React.useState<string>("alfaparf");
    const activeBrand = brands.find((b) => b.id === activeId) ?? brands[0];

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = React.useState(0);

    const handleNextBrand = React.useCallback(() => {
        const idx = brands.findIndex((b) => b.id === activeId);
        const nextIdx = (idx + 1) % brands.length;
        setActiveId(brands[nextIdx].id);
    }, [brands, activeId]);

    const handlePrevBrand = React.useCallback(() => {
        const idx = brands.findIndex((b) => b.id === activeId);
        const prevIdx = (idx - 1 + brands.length) % brands.length;
        setActiveId(brands[prevIdx].id);
    }, [brands, activeId]);

    const handleScroll = React.useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) {
            setScrollProgress(0);
            return;
        }
        setScrollProgress(Math.min(Math.max(el.scrollLeft / maxScroll, 0), 1));
    }, []);

    return (
        <section id="brand-showroom" className="relative w-full bg-[#0B0B0B] text-white overflow-hidden border-b border-[#222222]">
            {/* ═══════════════════════════════════════════════════════
                TOP SECTION: 50/50 High-Fashion Editorial Split (Dark Canvas)
            ═══════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] sm:min-h-[580px] lg:min-h-[560px] xl:min-h-[640px] 2xl:min-h-[720px]">

                {/* ─── LEFT HALF: Pure Minimalist Dark Editorial Canvas ─── */}
                <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-10 xl:px-16 2xl:px-24 py-12 sm:py-16 lg:py-14 xl:py-20 z-10 bg-[#0B0B0B]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeBrand.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-[480px] lg:max-w-[480px] xl:max-w-[560px] 2xl:max-w-[640px]"
                        >
                            {/* Main Headline: Sans-Serif Light + Serif Italic (Exact 2-Line Parity Across Laptop & Desktop) */}
                            <h2 className="text-[1.85rem] sm:text-[2.4rem] lg:text-[1.92rem] xl:text-[2.65rem] 2xl:text-[3.6rem] font-light leading-[1.14] tracking-[-0.03em] text-white">
                                <span className="block">
                                    {activeBrand.headline.split("&")[0].trim()}
                                </span>
                                {activeBrand.headline.includes("&") && (
                                    <span className="block font-serif italic text-white/90 font-normal mt-0.5 sm:mt-1">
                                        & {activeBrand.headline.split("&")[1].trim()}
                                    </span>
                                )}
                            </h2>

                            {/* Refined Description */}
                            <p className="mt-5 sm:mt-6 text-[13px] sm:text-[14px] lg:text-[13.5px] xl:text-[14.5px] 2xl:text-[15.5px] font-light leading-relaxed text-white/60 max-w-lg">
                                {activeBrand.description}
                            </p>

                            {/* Left-Aligned Editorial Action Link */}
                            <div className="mt-7 sm:mt-9">
                                <Link
                                    href={activeBrand.href}
                                    className="group inline-flex min-h-[44px] items-center gap-2 text-[12px] sm:text-[13px] lg:text-[12.5px] xl:text-[13.5px] font-medium tracking-wide text-white border-b border-white/70 pb-1 transition-all duration-300 hover:border-white hover:text-white"
                                >
                                    <span className="font-serif italic text-white/95">{activeBrand.subheading}</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ─── RIGHT HALF: Full-Bleed High-Fashion Editorial Stage ─── */}
                <div className="relative w-full h-[460px] sm:h-[560px] lg:h-full overflow-hidden bg-[#141414]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeBrand.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            onPanEnd={(_, info) => {
                                if (info.offset.x < -30) {
                                    handleNextBrand();
                                } else if (info.offset.x > 30) {
                                    handlePrevBrand();
                                }
                            }}
                            className="absolute inset-0 w-full h-full touch-pan-y"
                        >
                            <Image
                                src={activeBrand.editorialImage}
                                alt={activeBrand.name}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-center"
                            />

                            {/* Subtle luxury edge gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none lg:bg-gradient-to-r lg:from-[#0B0B0B]/20 lg:via-transparent lg:to-transparent" />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                BOTTOM SECTION: Clean White Brand Selector Bar
                (Klik untuk Mengganti Brand Aktif)
            ═══════════════════════════════════════════════════════ */}
            <div className="w-full bg-[#FFFFFF] text-[#111111] py-6 sm:py-8 lg:py-9 px-5 sm:px-8 lg:px-10 xl:px-20 border-t border-b border-[#E5E5E5]">
                <div className="w-full max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-10">

                    {/* Left Label (Without Colon, Bilingual) */}
                    <div className="text-center md:text-left shrink-0">
                        <p className="text-tiny font-bold uppercase tracking-[0.22em] text-[#666666] leading-tight max-w-[140px] xl:max-w-[160px]">
                            {dict.brandShowroom.brandPortfolioLabel}
                        </p>
                    </div>

                    {/* Right Interactive Brand Logo Strip with Custom Scroll Indicator */}
                    <div className="w-full flex flex-col items-center md:items-end">
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex items-center justify-start md:justify-end gap-4 sm:gap-5 md:gap-5 lg:gap-5 xl:gap-10 2xl:gap-12 w-full overflow-x-auto no-scrollbar py-2 px-1 pr-6 lg:pr-10 xl:pr-0"
                        >
                            {brands.map((brand) => {
                                const isActive = brand.id === activeId;
                                return (
                                    <button
                                        key={brand.id}
                                        type="button"
                                        onClick={() => setActiveId(brand.id)}
                                        className={`group relative flex min-h-[44px] flex-col items-center justify-center px-1.5 sm:px-2 py-2 shrink-0 transition-all duration-300 cursor-pointer active:scale-95 ${isActive ? "opacity-100 scale-105" : "opacity-40 hover:opacity-85"
                                            }`}
                                        title={`Select ${brand.name}`}
                                    >
                                        <div className="relative h-6 sm:h-7 lg:h-7 xl:h-8 w-18 sm:w-22 lg:w-22 xl:w-28">
                                            <Image
                                                src={brand.logo}
                                                alt={brand.name}
                                                fill
                                                sizes="120px"
                                                className={`object-contain transition-all duration-300 ${isActive
                                                        ? "filter grayscale contrast-125 brightness-0"
                                                        : "filter grayscale contrast-100"
                                                    }`}
                                            />
                                        </div>

                                        {/* Active Underline Gold Indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeWhiteBrandIndicator"
                                                className="absolute -bottom-1 sm:-bottom-2 w-7 sm:w-8 h-[2px] bg-[#D4AF37]"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Minimalist Custom Scroll Track Indicator (Mobile Only) */}
                        <div className="md:hidden mt-2.5 flex items-center justify-center" aria-hidden="true">
                            <div className="w-16 h-[2px] bg-[#EAE6DF] rounded-full overflow-hidden relative">
                                <div
                                    className="h-full w-6 bg-[#111111] rounded-full transition-transform duration-75 ease-out"
                                    style={{
                                        transform: `translateX(${scrollProgress * 40}px)`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
