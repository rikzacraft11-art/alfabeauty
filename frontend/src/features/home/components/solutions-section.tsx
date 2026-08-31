"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * SolutionsSection (1:1 Yucca Packaging .section-solutions)
 *
 * - Immersive cinematic full-width photographic background cross-fade.
 * - Inactive cards: Clean frosted glass cards showing category title.
 * - Active card: Elevated solid white card with large typography,
 *   full description, horizontal rule, and 'Explore Solution' arrow link.
 * - Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function SolutionsSection(): React.JSX.Element {
    const { dict } = useLanguage();
    const [activeIndex, setActiveIndex] = React.useState(0);
    const solutions = dict.solutions?.items ?? [];

    return (
        <section className="section section-solutions relative min-h-[460px] sm:min-h-[520px] lg:min-h-[600px] w-full overflow-hidden bg-[#181816] text-white flex items-center justify-center border-b border-[#E5E5E5]/10">
            {/* Dynamic Cinematic Photographic Background Cross-Fade */}
            <div className="absolute inset-0 z-0">
                {solutions.map((sol, idx) => (
                    <div
                        key={sol.id}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-700 ease-in-out",
                            idx === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                        )}
                    >
                        <Image
                            src={sol.bgImage}
                            alt={sol.title}
                            fill
                            unoptimized
                            className="object-cover brightness-[0.72] contrast-[1.05]"
                            sizes="100vw"
                            priority={idx === 0}
                        />
                    </div>
                ))}
                {/* Subtle dark gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/45" />
            </div>

            {/* Interactive Solution Cards Container */}
            <div className="relative z-10 mx-auto w-full max-w-[1720px] px-5 sm:px-10 lg:px-16 xl:px-20 py-8 sm:py-12 lg:py-16">
                {/* ─── Mobile Viewport (< md): 3 Cards Stacked Vertically from Top to Bottom (1:1 Yucca Mobile, No Hover Required) ─── */}
                <div className="md:hidden flex flex-col gap-3.5 w-full">
                    {solutions.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative flex h-[175px] sm:h-[195px] w-full flex-col justify-between overflow-hidden rounded-none bg-black/60 p-5 sm:p-6 text-white border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/25" />
                            </div>

                            {/* Card Content (Title + Number + Explore Solution Only - No Copywriting on Mobile) */}
                            <div className="relative z-10">
                                <span className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-[#EABD68] mb-1.5 block">
                                    0{index + 1}
                                </span>
                                <h3 className="text-[1.25rem] sm:text-[1.45rem] font-light leading-[1.14] tracking-[-0.02em] text-white">
                                    {item.title}
                                </h3>
                            </div>

                            <div className="relative z-10 pt-2">
                                <div className="mb-2.5 h-px w-full bg-white/20" />

                                <Link
                                    href={item.href}
                                    className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white border-b border-white pb-0.5 transition-colors duration-200 hover:text-[#EABD68] hover:border-[#EABD68]"
                                >
                                    <span>{dict.solutions.exploreSolution}</span>
                                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── Desktop & Tablet Viewport (>= md): 3-Card Interactive Strip (Active Copywriting + Inactive View Details) ─── */}
                <div className="hidden md:grid w-full grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {solutions.map((item, index) => {
                        const isActive = index === activeIndex;

                        if (isActive) {
                            // ─── Active Panel: Elevated Pure Solid White with Copywriting Description ───
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0.9 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative z-20 flex h-[290px] lg:h-[320px] xl:h-[340px] w-full flex-col justify-between rounded-none bg-white p-6 lg:p-7 text-[#111111] shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
                                >
                                    <div>
                                        {/* Number */}
                                        <span className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-brand-crimson mb-2 block">
                                            0{index + 1}
                                        </span>
                                        {/* Title */}
                                        <h3 className="text-[1.5rem] lg:text-[1.8rem] font-light leading-[1.12] tracking-[-0.02em] text-[#111111]">
                                            {item.title}
                                        </h3>
                                        {/* Copywriting Description Paragraph */}
                                        <p className="mt-3 text-[13px] lg:text-[14.5px] font-normal leading-relaxed text-[#555555] line-clamp-3">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <div className="mb-3.5 h-px w-full bg-[#E5E0D8]" />

                                        <Link
                                            href={item.href}
                                            className="group inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#111111] border-b border-[#111111] pb-1 transition-colors duration-200 hover:text-brand-crimson hover:border-brand-crimson"
                                        >
                                            <span>{dict.solutions.exploreSolution}</span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        }

                        // ─── Inactive Panel: Sleek Frosted Glass Card with Number, Title & VIEW DETAILS ───
                        return (
                            <motion.div
                                key={item.id}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => setActiveIndex(index)}
                                className="group relative z-10 flex h-[290px] lg:h-[320px] xl:h-[340px] w-full cursor-pointer flex-col items-center justify-center rounded-none bg-black/45 p-6 lg:p-7 text-center backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-black/65 hover:border-white/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
                            >
                                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/60 mb-2">
                                    0{index + 1}
                                </span>
                                <h3 className="text-[1.35rem] lg:text-[1.65rem] font-light leading-[1.2] tracking-[-0.01em] text-white transition-all duration-200 group-hover:text-white">
                                    {item.title}
                                </h3>
                                <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 group-hover:text-white transition-colors duration-200">
                                    {dict.solutions.viewDetails || "VIEW DETAILS"}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
