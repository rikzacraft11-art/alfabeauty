"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * SolutionsSection — Option 1: In-Card Editorial Gallery Architecture
 *
 * Visual & Ergonomic Solution:
 * 1. Serene & Unified Section Canvas: Pure velvet obsidian background (#0A0A0A)
 *    with subtle atmospheric studio lighting. Eliminates background visual clashes
 *    and stroboscopic screen flashes.
 * 2. In-Card Product Imagery: High-definition studio product photos live directly
 *    INSIDE each inactive card with smoked dark scrims and instant hover clarity.
 * 3. Active Card: Elevated sharp white architectural monolith with top crimson
 *    accent, large editorial title, 100% preserved description, and tracked CTA.
 * 4. 100% Persistent DOM with smooth hardware-accelerated GPU transitions.
 * ───────────────────────────────────────────────────────────────────── */
export function SolutionsSection(): React.JSX.Element {
    const { dict } = useLanguage();
    const [activeIndex, setActiveIndex] = React.useState(0);
    const solutions = dict.solutions?.items ?? [];

    return (
        <section className="section section-solutions relative min-h-[720px] sm:min-h-[800px] lg:min-h-[880px] xl:min-h-[940px] 2xl:min-h-[1000px] w-full overflow-hidden bg-[#0A0A0A] text-white flex items-center justify-center border-b border-white/10 py-16 sm:py-20 lg:py-28 xl:py-32">
            
            {/* ═══════════════════════════════════════════════════════
                1. SERENE VELVET OBSIDIAN STUDIO BACKGROUND
            ═══════════════════════════════════════════════════════ */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Deep Luxury Studio Gradient Canvas */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0E0E10] to-[#0A0A0A]" />
                
                {/* Subtle Amber/Golden Studio Ambient Spotlights */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(234,189,104,0.035)_0%,transparent_70%)] blur-2xl" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(186,24,27,0.025)_0%,transparent_70%)] blur-2xl" />
                
                {/* Ultra-fine Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
            </div>

            {/* ═══════════════════════════════════════════════════════
                2. INTERACTIVE IN-CARD EDITORIAL GALLERY
            ═══════════════════════════════════════════════════════ */}
            <div className="relative z-10 mx-auto w-full max-w-[1540px] px-6 sm:px-10 lg:px-16 xl:px-20">
                
                {/* ─── Mobile Viewport (< md): Stacked Sharp Luxury Gallery Cards ─── */}
                <div className="md:hidden flex flex-col gap-4 w-full">
                    {solutions.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative flex h-[210px] sm:h-[240px] w-full flex-col justify-between overflow-hidden rounded-none bg-black/75 p-6 text-white border border-white/20 shadow-[0_16px_36px_rgba(0,0,0,0.5)]"
                        >
                            {/* In-Card Product Image with Dark Scrim */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={item.bgImage}
                                    alt={item.title}
                                    fill
                                    unoptimized
                                    className="object-cover brightness-[0.55] contrast-[1.05]"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/35" />
                            </div>

                            {/* Card Content */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#EABD68]">
                                        0{index + 1}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-[#EABD68]" />
                                </div>
                                <h3 className="text-[1.35rem] sm:text-[1.6rem] font-light leading-[1.15] tracking-[-0.02em] text-white">
                                    {item.title}
                                </h3>
                            </div>

                            <div className="relative z-10 pt-2">
                                <div className="mb-3 h-px w-full bg-white/20" />

                                <Link
                                    href={item.href}
                                    className="group inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.18em] text-white border-b border-[#EABD68] pb-0.5 transition-colors duration-200 hover:text-[#EABD68]"
                                >
                                    <span>{dict.solutions.exploreSolution}</span>
                                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1 text-[#EABD68]" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── Desktop & Tablet Viewport (>= md): In-Card Editorial Gallery ─── */}
                <div className="hidden md:flex w-full items-center justify-center gap-6 lg:gap-8 xl:gap-10">
                    {solutions.map((item, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={item.id}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => setActiveIndex(index)}
                                className={cn(
                                    "relative flex flex-col cursor-pointer overflow-hidden rounded-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                    isActive
                                        ? "z-20 w-full max-w-[480px] lg:max-w-[500px] xl:max-w-[520px] h-[440px] lg:h-[475px] xl:h-[495px] shadow-[0_28px_80px_rgba(0,0,0,0.7)]"
                                        : "z-10 w-full max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] h-[340px] lg:h-[375px] xl:h-[395px] shadow-[0_16px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
                                )}
                            >
                                {/* ─── Layer A: Active Solid White Canvas Base ─── */}
                                <div
                                    className={cn(
                                        "absolute inset-0 bg-[#FFFFFF] border-t-[3px] border-t-brand-crimson border-x border-b border-[#EAE6DF] transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                        isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                    )}
                                />

                                {/* ─── Layer B: Inactive In-Card Studio Photography Base ─── */}
                                <div
                                    className={cn(
                                        "absolute inset-0 overflow-hidden transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                        isActive ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
                                    )}
                                >
                                    {/* Dedicated In-Card Product Image */}
                                    <Image
                                        src={item.bgImage}
                                        alt={item.title}
                                        fill
                                        unoptimized
                                        className="object-cover brightness-[0.48] contrast-[1.1] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:brightness-[0.58]"
                                        sizes="33vw"
                                    />
                                    {/* Smoked Obsidian Glass Scrim */}
                                    <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] border border-white/15 transition-all duration-300 group-hover:border-white/35 group-hover:bg-black/45" />
                                </div>

                                {/* ─── Content 1: Inactive Centered Title Layer (Smooth In-Card Dissolve) ─── */}
                                <div
                                    className={cn(
                                        "absolute inset-0 z-10 flex flex-col items-center justify-center p-8 lg:p-10 text-center transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                        isActive
                                            ? "opacity-0 scale-95 pointer-events-none"
                                            : "opacity-100 scale-100 pointer-events-auto"
                                    )}
                                >
                                    <span className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#EABD68] mb-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                        0{index + 1}
                                    </span>
                                    <h3 className="text-[1.4rem] lg:text-[1.7rem] xl:text-[1.9rem] font-light leading-[1.2] tracking-[-0.015em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                                        {item.title}
                                    </h3>
                                    <span className="mt-3.5 inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/60 border-b border-transparent transition-colors duration-200 group-hover:text-white group-hover:border-white/60 pb-0.5">
                                        <span>{dict.solutions.viewDetails || "VIEW DETAILS"}</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </span>
                                </div>

                                {/* ─── Content 2: Active Detailed Editorial Content Layer (Smooth In-Card Dissolve) ─── */}
                                <div
                                    className={cn(
                                        "relative z-20 flex h-full w-full flex-col justify-between p-8 lg:p-10 xl:p-12 text-[#111111] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                        isActive
                                            ? "opacity-100 translate-y-0 pointer-events-auto"
                                            : "opacity-0 translate-y-3 pointer-events-none"
                                    )}
                                >
                                    <div>
                                        {/* Number & Indicator */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-crimson">
                                                0{index + 1}
                                            </span>
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#EABD68]" />
                                        </div>

                                        {/* Headline Title */}
                                        <h3 className="text-[1.85rem] lg:text-[2.2rem] xl:text-[2.45rem] font-light leading-[1.12] tracking-[-0.025em] text-[#111111]">
                                            {item.title}
                                        </h3>

                                        {/* Narrative Description Copywriting */}
                                        <p className="mt-4 text-[13.5px] lg:text-[15px] xl:text-[15.5px] font-normal leading-relaxed text-[#555555]">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="mb-4 h-px w-full bg-[#E5E0D8]" />

                                        <Link
                                            href={item.href}
                                            className="group inline-flex items-center gap-2.5 text-[12px] lg:text-[13px] font-semibold uppercase tracking-[0.18em] text-[#111111] border-b border-[#111111] pb-1 transition-all duration-200 hover:text-brand-crimson hover:border-brand-crimson"
                                        >
                                            <span>{dict.solutions.exploreSolution}</span>
                                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5 text-brand-crimson" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
