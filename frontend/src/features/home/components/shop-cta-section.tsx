"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
 * ShopCTASection (Right-Aligned Zigzag Layout on Pure Black #000000)
 *
 * - Golden silk wave follows the user's hand-drawn red line trajectory:
 *   starts high on the top-left, curves gently across the upper-left,
 *   descends into a graceful valley, runs horizontally below the headline,
 *   and swoops elegantly down to the bottom right.
 * - Refined with haute-couture multi-strand silk filaments & delicate flyaways.
 * - Interactive with scroll physics (path length draw, parallax float, shimmer).
 * - Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function ShopCTASection(): React.JSX.Element {
    const { dict } = useLanguage();
    const sectionRef = React.useRef<HTMLElement>(null);

    // Scroll-driven interaction across Section 2
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Dynamic fluid motion: path draw, subtle parallax drift, and luminous shimmer
    const pathDraw = useTransform(scrollYProgress, [0.1, 0.75], [0.2, 1], { clamp: true });
    const waveX = useTransform(scrollYProgress, [0, 1], [-20, 20]);
    const waveY = useTransform(scrollYProgress, [0, 1], [14, -14]);
    const waveOpacity = useTransform(scrollYProgress, [0.08, 0.4, 0.85, 1], [0.35, 0.95, 0.95, 0.4], { clamp: true });

    return (
        <section
            ref={sectionRef}
            className="section section-shop-cta relative z-10 border-b border-white/10 bg-[#000000] pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 lg:pb-28 text-white overflow-hidden"
        >
            {/* ─── Scroll-Interactive Golden Silk Hair Wave (Exact 1:1 Red Line Trajectory) ─── */}
            <motion.div 
                style={{
                    x: waveX,
                    y: waveY,
                    opacity: waveOpacity,
                }}
                className="pointer-events-none absolute inset-0 w-full h-full select-none z-0 overflow-hidden"
                aria-hidden="true"
            >
                <svg 
                    viewBox="0 0 1600 700" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-full h-full object-cover"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="silkWaveGradExact" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#EABD68" stopOpacity="0" />
                            <stop offset="10%" stopColor="#EABD68" stopOpacity="0.7" />
                            <stop offset="35%" stopColor="#FFF8E0" stopOpacity="0.95" />
                            <stop offset="65%" stopColor="#EABD68" stopOpacity="0.8" />
                            <stop offset="88%" stopColor="#EABD68" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#5D221C" stopOpacity="0" />
                        </linearGradient>
                        <filter id="silkWaveGlowExact" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="12" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Ambient Atmospheric Light Halos along the wave crests */}
                    <circle cx="220" cy="210" r="140" fill="#EABD68" fillOpacity="0.05" filter="url(#silkWaveGlowExact)" />
                    <circle cx="500" cy="490" r="150" fill="#EABD68" fillOpacity="0.04" filter="url(#silkWaveGlowExact)" />
                    <circle cx="920" cy="460" r="130" fill="#EABD68" fillOpacity="0.03" filter="url(#silkWaveGlowExact)" />

                    {/* 1. Voluminous Silk Ribbon (Soft Ambient Halo) */}
                    <motion.path
                        style={{ pathLength: pathDraw }}
                        d="M -30,80 C 80,180 180,210 280,220 C 380,230 420,380 470,470 C 530,550 620,520 720,480 C 820,440 940,460 1040,470 C 1140,480 1200,580 1350,680"
                        stroke="url(#silkWaveGradExact)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        opacity="0.28"
                        filter="url(#silkWaveGlowExact)"
                    />
                    
                    {/* 2. Luminous Hair Core (Semi-Solid Silk Body) */}
                    <motion.path
                        style={{ pathLength: pathDraw }}
                        d="M -30,80 C 80,180 180,210 280,220 C 380,230 420,380 470,470 C 530,550 620,520 720,480 C 820,440 940,460 1040,470 C 1140,480 1200,580 1350,680"
                        stroke="url(#silkWaveGradExact)"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        opacity="0.7"
                    />

                    {/* 3. Ultra-Crisp Center Light Filament (Glossy Highlight) */}
                    <motion.path
                        style={{ pathLength: pathDraw }}
                        d="M -30,80 C 80,180 180,210 280,220 C 380,230 420,380 470,470 C 530,550 620,520 720,480 C 820,440 940,460 1040,470 C 1140,480 1200,580 1350,680"
                        stroke="#FFFDF7"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        opacity="0.92"
                    />

                    {/* 4. Upper Fine Braided Hair Strand */}
                    <motion.path
                        style={{ pathLength: pathDraw }}
                        d="M -30,60 C 90,160 190,190 290,195 C 390,205 430,350 480,440 C 540,520 630,490 730,455 C 830,420 950,440 1050,450 C 1150,460 1220,560 1370,660"
                        stroke="#EABD68"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.65"
                    />

                    {/* 5. Lower Fine Braided Hair Strand */}
                    <motion.path
                        style={{ pathLength: pathDraw }}
                        d="M -30,105 C 70,200 170,230 270,245 C 370,255 410,410 460,500 C 520,580 610,550 710,505 C 810,460 930,480 1030,490 C 1130,500 1180,600 1330,700"
                        stroke="#EABD68"
                        strokeWidth="1.0"
                        strokeLinecap="round"
                        opacity="0.5"
                    />

                    {/* 6. Delicate Whispy Flyaway Strand */}
                    <motion.path
                        style={{ pathLength: pathDraw }}
                        d="M 100,160 C 200,190 300,240 430,430 C 490,510 640,470 790,440 C 910,420 1050,470 1210,600"
                        stroke="#FFF8E0"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        opacity="0.4"
                    />
                </svg>
            </motion.div>

            <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* ─── Right-Aligned Editorial Statement Box (Zigzag Cadence) ─── */}
                <div className="ml-auto max-w-[820px] text-right flex flex-col items-end">
                    <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.2rem] font-light sm:font-normal leading-[1.18] tracking-[-0.02em] text-white text-balance">
                        {dict.shopCTA.heading}
                    </h2>

                    <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-end justify-end gap-6 sm:gap-8">
                        {/* Primary Underline Action */}
                        <Link
                            href={NAV_LINKS.products}
                            className="group inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-white border-b border-white/90 pb-1.5 transition-all duration-200 hover:border-[#EABD68] hover:text-[#EABD68]"
                        >
                            <span>{dict.shopCTA.seeAllProducts}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        {/* Exact Green (#1F9849) touch on Black Canvas */}
                        <Link
                            href={NAV_LINKS.contact}
                            className="group inline-flex items-center gap-1.5 text-[12.5px] font-normal text-white/80 transition-colors"
                        >
                            <span>{dict.shopCTA.notSurePrefix}</span>
                            <span className="text-[#1F9849] font-medium border-b border-[#1F9849] pb-0.5 transition-colors duration-200 group-hover:text-[#EABD68] group-hover:border-[#EABD68]">
                                {dict.shopCTA.notSureCTA}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
