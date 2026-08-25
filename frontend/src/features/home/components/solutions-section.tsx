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
        <section className="section section-solutions relative min-h-[440px] sm:min-h-[500px] lg:min-h-[580px] w-full overflow-hidden bg-[#FFFFFF] text-[#111111] flex items-center justify-center border-b border-[#E5E5E5]">
            {/* Dynamic Cinematic Photographic Background Cross-Fade with Luminous Light Overlay */}
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
                            className="object-cover brightness-[0.95] contrast-[1.02]"
                            sizes="100vw"
                            priority={idx === 0}
                        />
                    </div>
                ))}
                {/* Luminous light scrim for editorial white harmony */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-white/70" />
            </div>

            {/* Interactive Solution Cards Container */}
            <div className="relative z-10 mx-auto w-full max-w-[1720px] px-5 sm:px-10 lg:px-16 xl:px-20 py-6 sm:py-10 lg:py-16">
                {/* ─── Mobile Viewport (< md): 3 Cards Stacked Vertically from Top to Bottom (1:1 Yucca Mobile) ─── */}
                <div className="md:hidden flex flex-col gap-3.5 w-full">
                    {solutions.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative flex h-[175px] sm:h-[195px] w-full flex-col justify-between overflow-hidden rounded-none bg-white/90 p-5 sm:p-6 text-[#111111] border border-[#E5E0D8] shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm"
                        >
                            {/* Card Content (Title + Number + Explore Solution Only) */}
                            <div className="relative z-10">
                                <span className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-brand-crimson mb-1.5 block">
                                    0{index + 1}
                                </span>
                                <h3 className="text-[1.25rem] sm:text-[1.45rem] font-light leading-[1.14] tracking-[-0.02em] text-[#111111]">
                                    {item.title}
                                </h3>
                            </div>

                            <div className="relative z-10 pt-2">
                                <div className="mb-2.5 h-px w-full bg-[#E5E0D8]" />

                                <Link
                                    href={item.href}
                                    className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#111111] border-b border-[#111111] pb-0.5 transition-colors duration-200 hover:text-brand-crimson hover:border-brand-crimson"
                                >
                                    <span>{dict.solutions.exploreSolution}</span>
                                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── Desktop & Tablet Viewport (>= md): 3-Card Side-by-Side Strip (1:1 Yucca Desktop) ─── */}
                <div className="hidden md:grid w-full grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {solutions.map((item, index) => {
                        const isActive = index === activeIndex;

                        if (isActive) {
                            // ─── Active Panel (Elevated Pure Solid White) ───
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0.9 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative z-20 flex h-[260px] lg:h-[290px] xl:h-[310px] w-full flex-col justify-between rounded-none bg-white p-6 lg:p-7 text-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#E5E0D8]"
                                >
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-crimson mb-2.5 block">
                                            0{index + 1}
                                        </span>
                                        <h3 className="text-[1.5rem] lg:text-[1.8rem] font-light leading-[1.14] tracking-[-0.02em] text-[#111111]">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="pt-3">
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

                        // ─── Inactive Panel (Sleek Frosted Light Card with Title Only) ───
                        return (
                            <motion.div
                                key={item.id}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => setActiveIndex(index)}
                                className="group relative z-10 flex h-[260px] lg:h-[290px] xl:h-[310px] w-full cursor-pointer flex-col items-center justify-center rounded-none bg-white/70 p-6 lg:p-7 text-center backdrop-blur-md border border-[#E5E0D8] transition-all duration-300 hover:bg-white hover:border-[#111111]/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                            >
                                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#888888] mb-2.5">
                                    0{index + 1}
                                </span>
                                <h3 className="text-[1.4rem] lg:text-[1.65rem] font-light leading-[1.2] tracking-[-0.01em] text-[#111111] transition-all duration-200 group-hover:text-brand-crimson">
                                    {item.title}
                                </h3>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
