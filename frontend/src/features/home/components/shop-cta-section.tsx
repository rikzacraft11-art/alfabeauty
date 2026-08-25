"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
 * ShopCTASection (Section 2 — Locked Sticky Runway matching Section 1)
 *
 * - Locked Sticky Scroll Runway (h-[175vh] with sticky top-0 h-screen):
 *   Locks the user in place while the golden silk hair wave progressively
 *   sweeps across the screen.
 * - Desktop: Sweeps across canvas, draws underline under "SEE ALL PRODUCTS"
 *   and completes with glowing arrow head.
 * - Mobile: Free-flowing organic atmospheric silk wave drifting gracefully
 *   across the dark canvas, paired with a crisp luxury CTA button.
 * - Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function ShopCTASection(): React.JSX.Element {
    const { dict } = useLanguage();
    const sectionRef = React.useRef<HTMLElement>(null);
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const linkRef = React.useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    // Dynamic responsive layout measurements inside sticky viewport
    const [layout, setLayout] = React.useState<{
        w: number;
        h: number;
        linkX: number;
        linkY: number;
        textWidth: number;
    }>({
        w: 1600,
        h: 800,
        linkX: 1250,
        linkY: 535,
        textWidth: 170,
    });

    const updateCoordinates = React.useCallback(() => {
        if (!viewportRef.current || !linkRef.current) return;
        const vRect = viewportRef.current.getBoundingClientRect();
        const lRect = linkRef.current.getBoundingClientRect();

        const w = vRect.width;
        const h = vRect.height;
        const linkX = lRect.left - vRect.left;
        // Elegant airy spacing right underneath the text (7px below baseline)
        const linkY = lRect.bottom - vRect.top + 7;
        // Text width excluding the arrow spacer
        const textWidth = Math.max(lRect.width - 22, 130);

        setLayout({
            w,
            h,
            linkX,
            linkY,
            textWidth,
        });
    }, []);

    React.useEffect(() => {
        updateCoordinates();
        window.addEventListener("resize", updateCoordinates);
        const t = setTimeout(updateCoordinates, 300);
        return () => {
            window.removeEventListener("resize", updateCoordinates);
            clearTimeout(t);
        };
    }, [updateCoordinates, dict.shopCTA.seeAllProducts]);

    // Locked scroll runway matching Section 1 logic
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // Paced progressive drawing across the locked runway:
    // 0.0 -> 0.50: Wave flows across and completes
    // 0.50 -> 1.0: Locked in full view before scrolling to Section 3
    const pathDraw = useTransform(scrollYProgress, [0.02, 0.52], [0, 1], { clamp: true });
    const waveX = useTransform(scrollYProgress, [0, 1], [-10, 10]);
    const waveY = useTransform(scrollYProgress, [0, 1], [6, -6]);
    const waveOpacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0.4, 1, 1, 0.7], { clamp: true });

    // Mathematical Spline Geometry
    const { w, h, linkX, linkY, textWidth } = layout;

    const underlineStartX = Math.round(linkX);
    const underlineEndX = Math.round(linkX + textWidth);
    const arrowTipX = Math.round(underlineEndX + 16);
    const arrowBarbX = Math.round(arrowTipX - 5);

    const isMobile = w < 640;

    let spinePath = "";
    let strandA = "";
    let strandB = "";
    let whispStrand = "";

    if (isMobile) {
        // ─── Mobile Organic Atmospheric Silk Wave (Liberated from rigid underline) ───
        // Pure, sensual, harmonic S-waves drifting naturally across the lower-middle dark canvas
        const p1x = Math.round(w * 0.28);
        const p1y = Math.round(h * 0.76);
        const p2x = Math.round(w * 0.68);
        const p2y = Math.round(h * 0.65);
        const endX = Math.round(w + 35);
        const endY = Math.round(h * 0.74);

        spinePath = `M -35,${Math.round(h * 0.68)} C ${p1x},${p1y} ${p2x},${p2y} ${endX},${endY}`;
        strandA = `M -35,${Math.round(h * 0.64)} C ${p1x + 12},${p1y - 14} ${p2x - 12},${p2y - 12} ${endX},${endY - 12}`;
        strandB = `M -35,${Math.round(h * 0.72)} C ${p1x - 12},${p1y + 14} ${p2x + 12},${p2y + 12} ${endX},${endY + 12}`;
        whispStrand = `M ${Math.round(w * 0.05)},${Math.round(h * 0.70)} C ${p1x + 25},${p1y + 6} ${p2x - 5},${p2y - 8} ${endX},${endY - 4}`;
    } else {
        // ─── Desktop Sweeping Cinematic Wave (100% Intact with Underline & Arrow) ───
        spinePath = `M -30,${Math.round(h * 0.22)} C ${Math.round(w * 0.10)},${Math.round(h * 0.26)} ${Math.round(w * 0.18)},${Math.round(h * 0.42)} ${Math.round(w * 0.26)},${Math.round(h * 0.54)} C ${Math.round(w * 0.34)},${Math.round(h * 0.66)} ${Math.round(w * 0.42)},${Math.round(h * 0.76)} ${Math.round(w * 0.52)},${Math.round(h * 0.76)} C ${Math.round(w * 0.64)},${Math.round(h * 0.76)} ${Math.round(underlineStartX - w * 0.12)},${linkY} ${underlineStartX},${linkY} L ${underlineEndX},${linkY} L ${arrowTipX},${linkY} L ${arrowBarbX},${linkY - 4} L ${arrowTipX},${linkY} L ${arrowBarbX},${linkY + 4}`;

        strandA = `M -30,${Math.round(h * 0.18)} C ${Math.round(w * 0.09)},${Math.round(h * 0.22)} ${Math.round(w * 0.19)},${Math.round(h * 0.46)} ${Math.round(w * 0.27)},${Math.round(h * 0.50)} C ${Math.round(w * 0.35)},${Math.round(h * 0.56)} ${Math.round(w * 0.43)},${Math.round(h * 0.74)} ${Math.round(w * 0.53)},${Math.round(h * 0.74)} C ${Math.round(w * 0.65)},${Math.round(h * 0.75)} ${Math.round(underlineStartX - w * 0.08)},${linkY - 2} ${underlineStartX},${linkY}`;

        strandB = `M -30,${Math.round(h * 0.26)} C ${Math.round(w * 0.11)},${Math.round(h * 0.30)} ${Math.round(w * 0.17)},${Math.round(h * 0.38)} ${Math.round(w * 0.25)},${Math.round(h * 0.58)} C ${Math.round(w * 0.33)},${Math.round(h * 0.76)} ${Math.round(w * 0.41)},${Math.round(h * 0.80)} ${Math.round(w * 0.51)},${Math.round(h * 0.79)} C ${Math.round(w * 0.63)},${Math.round(h * 0.78)} ${Math.round(underlineStartX - w * 0.10)},${linkY + 2} ${underlineStartX},${linkY}`;

        whispStrand = `M ${Math.round(w * 0.08)},${Math.round(h * 0.24)} C ${Math.round(w * 0.18)},${Math.round(h * 0.34)} ${Math.round(w * 0.30)},${Math.round(h * 0.62)} ${Math.round(w * 0.45)},${Math.round(h * 0.76)} C ${Math.round(w * 0.58)},${Math.round(h * 0.77)} ${Math.round(underlineStartX - w * 0.06)},${linkY} ${underlineStartX},${linkY}`;
    }

    return (
        <section
            ref={sectionRef}
            id="shop-cta"
            className="section section-shop-cta relative z-10 w-full bg-[#000000] text-white h-[175vh]"
        >
            {/* ─── Sticky 100vh Viewport (Locks until hair wave animation completes) ─── */}
            <div
                ref={viewportRef}
                className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden border-b border-white/10"
            >
                {/* ─── Scroll-Interactive Fluid Golden Silk Filaments ─── */}
                <motion.div 
                    style={{
                        opacity: waveOpacity,
                        x: waveX,
                        y: waveY,
                    }}
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                >
                    <svg
                        className="h-full w-full"
                        viewBox={`0 0 ${w} ${h}`}
                        preserveAspectRatio="none"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Linear Golden Gradient for the Hair Strands */}
                            <linearGradient id="silkGoldLinearSticky" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8A6B2D" stopOpacity="0.3" />
                                <stop offset="25%" stopColor="#C99738" stopOpacity="0.75" />
                                <stop offset="60%" stopColor="#EABD68" stopOpacity="1" />
                                <stop offset="85%" stopColor="#FFF2B8" stopOpacity="1" />
                                <stop offset="100%" stopColor="#EABD68" stopOpacity="1" />
                            </linearGradient>

                            {/* Warm Golden Glow Filter for Luxury Atmospheric Presence */}
                            <filter id="silkGlowSticky" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3.5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>

                            {/* Ultra-sharp Crisp Filter for the Primary Drawn Line */}
                            <filter id="silkDelicateGlowSticky" x="-10%" y="-10%" width="120%" height="120%">
                                <feGaussianBlur stdDeviation="1.5" result="subtleBlur" />
                                <feComposite in="SourceGraphic" in2="subtleBlur" operator="over" />
                            </filter>
                        </defs>

                        {/* 1. Ambient Glow Underlay (Deep background radiance) */}
                        <motion.path
                            style={{ pathLength: pathDraw }}
                            d={spinePath}
                            stroke="#EABD68"
                            strokeWidth={isHovered ? "4" : "3"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.35"
                            filter="url(#silkGlowSticky)"
                            className="transition-all duration-300"
                        />
                        
                        {/* 2. Primary Silk Hair Strand Spine & Live Arrow */}
                        <motion.path
                            style={{ pathLength: pathDraw }}
                            d={spinePath}
                            stroke="url(#silkGoldLinearSticky)"
                            strokeWidth={isHovered ? "1.9" : "1.5"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.95"
                            filter="url(#silkDelicateGlowSticky)"
                            className="transition-all duration-300"
                        />

                        {/* 3. Interweaving Harmonic Strand A */}
                        <motion.path
                            style={{ pathLength: pathDraw }}
                            d={strandA}
                            stroke="#EABD68"
                            strokeWidth="0.9"
                            strokeLinecap="round"
                            opacity="0.65"
                        />

                        {/* 4. Interweaving Harmonic Strand B */}
                        <motion.path
                            style={{ pathLength: pathDraw }}
                            d={strandB}
                            stroke="#EABD68"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            opacity="0.5"
                        />

                        {/* 5. Delicate Whispy Flyaway Hair Fiber */}
                        <motion.path
                            style={{ pathLength: pathDraw }}
                            d={whispStrand}
                            stroke="#FFE8A3"
                            strokeWidth="0.6"
                            strokeLinecap="round"
                            opacity="0.4"
                        />
                    </svg>
                </motion.div>

                <div className="relative z-10 mx-auto w-full max-w-[1720px] px-6 sm:px-10 lg:px-16 xl:px-20">
                    {/* ─── Centered on Mobile / Right-Aligned on Desktop Editorial Statement Box ─── */}
                    <div className="w-full sm:ml-auto max-w-[880px] text-center sm:text-right flex flex-col items-center sm:items-end">
                        <h2 className="text-[1.65rem] sm:text-[2.6rem] lg:text-[3.3rem] font-light sm:font-normal leading-[1.25] sm:leading-[1.18] tracking-[-0.02em] text-white text-balance">
                            {dict.shopCTA.heading}
                        </h2>

                        <div className="mt-8 sm:mt-12 flex items-center justify-center sm:justify-end">
                            {/* Primary Action Button (Clean luxury underline & icon on mobile, drawn SVG on desktop) */}
                            <Link
                                ref={linkRef}
                                href={NAV_LINKS.products}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="group relative inline-flex items-center gap-2 text-[11px] sm:text-[12.5px] font-semibold uppercase tracking-[0.22em] sm:tracking-[0.18em] text-white border-b border-[#EABD68] sm:border-transparent pb-1.5 sm:pb-3 transition-colors duration-200 hover:text-[#EABD68]"
                            >
                                <span>{dict.shopCTA.seeAllProducts}</span>
                                {/* Arrow on mobile (clean icon), desktop uses drawn SVG arrow */}
                                <ArrowRight className="h-3 w-3 sm:hidden text-[#EABD68] transition-transform duration-200 group-hover:translate-x-1" />
                                <span className="hidden sm:inline-block w-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
