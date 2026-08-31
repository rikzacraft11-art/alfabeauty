"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * SolutionsSection — High-Fashion Editorial: Smooth, Sharp & Authoritative
 *
 * Engineering & Interaction Principles:
 * - Butter-smooth 60/120fps hardware-accelerated CSS GPU transitions (no JS layout thrashing).
 * - Instantaneous, sharp, authoritative response on hover (zero sluggish stagger delays).
 * - Monolithic razor-edge geometry with high-contrast luxury typography.
 * - 100% Preserved Copywriting.
 * ───────────────────────────────────────────────────────────────────── */
export function SolutionsSection(): React.JSX.Element {
    const { dict } = useLanguage();
    const [activeIndex, setActiveIndex] = React.useState(0);
    const solutions = dict.solutions?.items ?? [];

    return (
        <section className="section section-solutions relative min-h-[720px] sm:min-h-[800px] lg:min-h-[880px] xl:min-h-[940px] 2xl:min-h-[1000px] w-full overflow-hidden bg-[#0A0A0A] text-white flex items-center justify-center border-b border-white/10 py-16 sm:py-20 lg:py-28 xl:py-32">
            
            {/* ═══════════════════════════════════════════════════════
                1. HARDWARE-ACCELERATED BUTTER-SMOOTH BACKGROUND
            ═══════════════════════════════════════════════════════ */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {solutions.map((sol, idx) => {
                    const isCurrent = idx === activeIndex;
                    return (
                        <div
                            key={sol.id}
                            className={cn(
                                "absolute inset-0 transition-all duration-700 ease-out will-change-transform",
                                isCurrent
                                    ? "opacity-100 scale-100 brightness-[0.72] contrast-[1.08]"
                                    : "opacity-0 scale-[1.04] brightness-[0.5] pointer-events-none"
                            )}
                        >
                            <Image
                                src={sol.bgImage}
                                alt={sol.title}
                                fill
                                unoptimized
                                priority={idx === 0}
                                className="object-cover object-center"
                                sizes="100vw"
                            />
                        </div>
                    );
                })}

                {/* Atmospheric Vignette Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/55" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
            </div>

            {/* ═══════════════════════════════════════════════════════
                2. INTERACTIVE SOLUTIONS CONTAINER
            ═══════════════════════════════════════════════════════ */}
            <div className="relative z-10 mx-auto w-full max-w-[1540px] px-6 sm:px-10 lg:px-16 xl:px-20">
                
                {/* ─── Mobile Viewport (< md): Stacked Sharp Luxury Cards ─── */}
                <div className="md:hidden flex flex-col gap-4 w-full">
                    {solutions.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative flex h-[210px] sm:h-[240px] w-full flex-col justify-between overflow-hidden rounded-none bg-black/75 p-6 text-white border border-white/20 shadow-[0_16px_36px_rgba(0,0,0,0.5)]"
                        >
                            {/* Card Background Image with Dark Vignette Scrim */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={item.bgImage}
                                    alt={item.title}
                                    fill
                                    unoptimized
                                    className="object-cover brightness-[0.55] contrast-[1.05]"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
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

                {/* ─── Desktop & Tablet Viewport (>= md): Crisp, Authoritative & Snappy 3-Card Array ─── */}
                <div className="hidden md:flex w-full items-center justify-center gap-6 lg:gap-8 xl:gap-10">
                    {solutions.map((item, index) => {
                        const isActive = index === activeIndex;

                        if (isActive) {
                            // ─── Active Panel: Elevated Sharp White Monolith with Instant Bold Presence ───
                            return (
                                <div
                                    key={item.id}
                                    className="relative z-20 flex w-full max-w-[480px] lg:max-w-[500px] xl:max-w-[520px] h-[440px] lg:h-[475px] xl:h-[495px] flex-col justify-between rounded-none bg-[#FFFFFF] p-8 lg:p-10 xl:p-12 text-[#111111] shadow-[0_28px_80px_rgba(0,0,0,0.7)] border-t-[3px] border-t-brand-crimson border-x border-b border-[#EAE6DF] transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
                                >
                                    <div>
                                        {/* Number & Indicator */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-crimson">
                                                0{index + 1}
                                            </span>
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#EABD68]" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-[1.85rem] lg:text-[2.2rem] xl:text-[2.45rem] font-light leading-[1.12] tracking-[-0.025em] text-[#111111]">
                                            {item.title}
                                        </h3>

                                        {/* Narrative Copywriting Description */}
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
                            );
                        }

                        // ─── Inactive Panel: Sharp Smoked Glass with Immediate Snappy Hover Response ───
                        return (
                            <div
                                key={item.id}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => setActiveIndex(index)}
                                className="group relative z-10 flex w-full max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] h-[340px] lg:h-[375px] xl:h-[395px] cursor-pointer flex-col items-center justify-center rounded-none bg-black/60 p-8 lg:p-10 text-center backdrop-blur-md border border-white/15 transition-all duration-300 ease-out hover:bg-black/80 hover:border-white/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                            >
                                <span className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-white/50 mb-2.5 group-hover:text-[#EABD68] transition-colors duration-200">
                                    0{index + 1}
                                </span>

                                <h3 className="text-[1.4rem] lg:text-[1.7rem] xl:text-[1.9rem] font-light leading-[1.2] tracking-[-0.015em] text-white transition-all duration-200 group-hover:text-white">
                                    {item.title}
                                </h3>

                                <span className="mt-3.5 inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/40 group-hover:text-white transition-colors duration-200 border-b border-transparent group-hover:border-white/60 pb-0.5">
                                    <span>{dict.solutions.viewDetails || "VIEW DETAILS"}</span>
                                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                </span>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
