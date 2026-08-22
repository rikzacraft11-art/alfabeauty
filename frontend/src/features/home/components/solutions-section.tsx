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
        <section className="section section-solutions relative min-h-[700px] lg:min-h-[820px] w-full overflow-hidden bg-[#1D1D1B] text-foreground flex items-center justify-center">
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
                            className="object-cover brightness-[0.65] contrast-[1.05]"
                            sizes="100vw"
                            priority={idx === 0}
                        />
                    </div>
                ))}
                {/* Subtle dark gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>

            {/* Interactive Solution Cards Container */}
            <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 items-center">
                    {solutions.map((item, index) => {
                        const isActive = index === activeIndex;

                        if (isActive) {
                            // ─── Active Panel (Calvin Klein Minimalist Solid White with Underline CTA) ───
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ scale: 0.98, opacity: 0.9 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="relative z-20 flex min-h-[400px] sm:min-h-[440px] lg:min-h-[480px] flex-col justify-between rounded-none bg-white p-8 sm:p-10 lg:p-12 text-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                                >
                                    <div>
                                        <div className="mb-4 inline-block border-b-2 border-[#D9403A] pb-1 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#D9403A]">
                                            {dict.solutions.badge} 0{index + 1}
                                        </div>
                                        <h3 className="text-[1.85rem] sm:text-[2.2rem] lg:text-[2.5rem] font-light sm:font-normal leading-[1.12] tracking-[-0.02em] text-[#111111]">
                                            {item.title}
                                        </h3>

                                        <p className="mt-5 text-[14.5px] sm:text-[15px] leading-relaxed text-[#4A4A48] font-normal">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-4">
                                        <div className="mb-6 h-px w-full bg-[#E5E0D8]" />

                                        <Link
                                            href={item.href}
                                            className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#111111] border-b border-[#111111] pb-1 transition-colors duration-200 hover:text-[#D9403A] hover:border-[#D9403A]"
                                        >
                                            <span>{dict.solutions.exploreSolution}</span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        }

                        // ─── Inactive Panel (Calvin Klein Sleek Frameless Glass with Underline Hover) ───
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => setActiveIndex(index)}
                                className="group relative z-10 flex min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] cursor-pointer flex-col items-center justify-center rounded-none bg-black/40 p-8 sm:p-10 text-center backdrop-blur-md border border-white/15 transition-all duration-300 hover:bg-black/60 hover:border-white/40"
                            >
                                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60 mb-3">
                                    0{index + 1}
                                </span>
                                <h3 className="text-[1.5rem] sm:text-[1.8rem] lg:text-[2rem] font-light leading-[1.2] tracking-[-0.01em] text-white transition-all duration-200 group-hover:text-[#EABD68]">
                                    {item.title}
                                </h3>
                                <span className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50 border-b border-transparent group-hover:border-white/80 group-hover:text-white transition-all">
                                    {dict.solutions.viewDetails}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
