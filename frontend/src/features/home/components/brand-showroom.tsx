"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
 * BrandShowroom (Section 5 — High-Fashion Editorial Brand Showcase)
 *
 * Typography & Layout System:
 * - Menggunakan font sistem standar yang konsisten dengan seluruh website.
 * - Tombol di pojok kanan bawah menggunakan gaya uppercase tracked link
 *   bergaris bawah yang konsisten dengan section lainnya.
 * ───────────────────────────────────────────────────────────────────── */

interface BrandItem {
    id: string;
    slug: string;
    name: string;
    headline: string;
    subheading: string;
    description: string;
    editorialImage: string;
    logo: string;
    href: string;
}

export function BrandShowroom(): React.JSX.Element {
    const brands: BrandItem[] = [
        {
            id: "alfaparf",
            slug: "alfaparf",
            name: "Alfaparf Milano",
            headline: "Creating captivating salon transformations & Italian master formulations.",
            subheading: "Explore Alfaparf Milano",
            description: "The global gold standard for instant crystal shine, thermal protection, and weightless silk fiber finish.",
            editorialImage: "/images/home/editorial-alfaparf.jpg",
            logo: "/images/brands/alfaparf-milano.webp",
            href: "/brands/alfaparf",
        },
        {
            id: "montibello",
            slug: "montibello",
            name: "Montibello",
            headline: "Mediterranean botanical science & bespoke luxury hair elixirs.",
            subheading: "Explore Montibello",
            description: "Pure amber argan and tsubaki flower nectar providing deep lipid renewal and cuticle sealing.",
            editorialImage: "/images/home/editorial-montibello.jpg",
            logo: "/images/brands/montibello.webp",
            href: "/brands/montibello",
        },
        {
            id: "gammaplus",
            slug: "gamma-plus",
            name: "Gamma+ Professional",
            headline: "High-precision Italian engineering & acoustic digital styling tools.",
            subheading: "Explore Gamma+ Professional",
            description: "Whisper-quiet 110,000 RPM brushless digital micro-motor with ion active conditioning.",
            editorialImage: "/images/home/editorial-gammaplus.jpg",
            logo: "/images/brands/gamma-plus.webp",
            href: "/brands/gamma-plus",
        },
        {
            id: "farmavita",
            slug: "farmavita",
            name: "Farmavita",
            headline: "Vibrant permanent salon color & Mediterranean oil infusions.",
            subheading: "Explore Farmavita",
            description: "Enriched with argan oil and botanical pigments for luminous, high-definition salon coloring.",
            editorialImage: "/images/home/editorial-alfaparf.jpg",
            logo: "/images/brands/farmavita.webp",
            href: "/brands/farmavita",
        },
        {
            id: "core",
            slug: "core",
            name: "Core Professional",
            headline: "Essential salon workstation precision & ergonomic daily reliability.",
            subheading: "Explore Core Professional",
            description: "Built for high-volume master stylists demanding durable, unyielding salon performance.",
            editorialImage: "/images/home/editorial-gammaplus.jpg",
            logo: "/images/brands/core.webp",
            href: "/brands/core",
        },
    ];

    const [activeId, setActiveId] = React.useState<string>("alfaparf");
    const activeBrand = brands.find((b) => b.id === activeId) ?? brands[0];

    return (
        <section id="brand-showroom" className="relative w-full bg-[#0B0B0B] text-white overflow-hidden">
            {/* ═══════════════════════════════════════════════════════
                TOP SECTION: 50/50 High-Fashion Editorial Split
            ═══════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px] lg:min-h-[720px] xl:min-h-[780px]">
                
                {/* ─── LEFT HALF: Pure Minimalist Dark Editorial Canvas ─── */}
                <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-18 xl:p-24 z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeBrand.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-[580px]"
                        >
                            {/* Main Serif Headline */}
                            <h2 className="text-[2.2rem] sm:text-[3rem] lg:text-[3.4rem] xl:text-[4rem] font-light leading-[1.12] tracking-[-0.03em] text-white">
                                {activeBrand.headline.split("&")[0]}
                                {activeBrand.headline.includes("&") && (
                                    <span className="font-serif italic text-white/80 font-normal">
                                        & {activeBrand.headline.split("&")[1]}
                                    </span>
                                )}
                            </h2>

                            {/* Refined Description */}
                            <p className="mt-6 text-[14px] sm:text-[15.5px] font-light leading-relaxed text-white/60">
                                {activeBrand.description}
                            </p>
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
                            className="absolute inset-0 w-full h-full"
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

                    {/* ─── Tombol Aksi di Pojok Kanan Bawah (Font Konsisten dengan Desain Web) ─── */}
                    <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20">
                        <Link
                            href={activeBrand.href}
                            className="group inline-flex items-center gap-2 text-[11.5px] sm:text-[12.5px] font-semibold uppercase tracking-[0.18em] text-white border-b border-white/70 pb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] transition-all duration-300 hover:border-white hover:text-white"
                        >
                            <span>{activeBrand.subheading}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                BOTTOM SECTION: Clean White Brand Selector Bar
                (Klik untuk Mengganti Brand Aktif)
            ═══════════════════════════════════════════════════════ */}
            <div className="w-full bg-[#FFFFFF] text-[#111111] py-8 sm:py-10 px-6 sm:px-12 lg:px-18 border-t border-b border-[#E5E5E5]">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                    
                    {/* Left Label */}
                    <div className="text-center md:text-left shrink-0">
                        <p className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#666666] leading-tight">
                            OUR EXCLUSIVE<br />BRAND PORTFOLIO:
                        </p>
                    </div>

                    {/* Right Interactive Brand Logo Buttons */}
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-7 sm:gap-10 lg:gap-14 w-full">
                        {brands.map((brand) => {
                            const isActive = brand.id === activeId;
                            return (
                                <button
                                    key={brand.id}
                                    type="button"
                                    onClick={() => setActiveId(brand.id)}
                                    className={`group relative flex flex-col items-center py-2 transition-all duration-300 cursor-pointer ${
                                        isActive ? "opacity-100 scale-105" : "opacity-40 hover:opacity-85"
                                    }`}
                                    title={`Select ${brand.name}`}
                                >
                                    <div className="relative h-7 sm:h-8 w-24 sm:w-30">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            fill
                                            sizes="130px"
                                            className={`object-contain transition-all duration-300 ${
                                                isActive
                                                    ? "filter grayscale contrast-125 brightness-0"
                                                    : "filter grayscale contrast-100"
                                            }`}
                                        />
                                    </div>

                                    {/* Active Underline Gold Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeWhiteBrandIndicator"
                                            className="absolute -bottom-2 w-8 h-[2px] bg-[#D4AF37]"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
