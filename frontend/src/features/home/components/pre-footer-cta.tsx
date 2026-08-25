"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { staggerMedium, fadeInUp } from "@/shared/lib/motion";

/**
 * PreFooterCTA — Minimalist High-Fashion Solid Black CTA Banner
 *
 * - Pure solid black background (#000000) with zero red tints.
 * - Elegant luxury typography hierarchy with lightweight modern fonts.
 * - Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 */
export function PreFooterCTA(): React.JSX.Element {
    const { dict } = useLanguage();
    const preFooter = dict.preFooter;

    return (
        <section className="pre-footer-cta relative py-16 sm:py-24 lg:py-32 bg-[#000000] text-white border-t border-white/10 overflow-hidden">
            {/* Subtle monochrome ambient depth gradient */}
            <div
                className="pointer-events-none absolute inset-0 z-[1]"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
                }}
            />

            <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 text-center flex flex-col items-center">
                {/* Eyebrow */}
                <FadeIn>
                    <p className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/50 mb-3.5 sm:mb-5 font-semibold">
                        {preFooter?.eyebrow ?? "READY TO ELEVATE YOUR SALON?"}
                    </p>
                </FadeIn>

                {/* Main Headline (Refined Luxury Light Typography) */}
                <FadeIn delay={0.1}>
                    <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.2rem] font-light leading-[1.12] tracking-[-0.03em] text-white text-balance max-w-3xl mx-auto">
                        {preFooter?.headingLine1 ?? "Elevate Your Craft With"}{" "}
                        <span className="font-light text-white/95">
                            {preFooter?.headingLine2 ?? "Premium Professional Products"}
                        </span>
                    </h2>
                </FadeIn>

                {/* Narrative Description */}
                <FadeIn delay={0.2}>
                    <p className="text-[13px] sm:text-[15px] font-normal leading-relaxed text-white/60 max-w-xl mx-auto mt-4 sm:mt-5 mb-8 sm:mb-11">
                        {preFooter?.description ??
                            "Join hundreds of salon professionals who trust Alfa Beauty for world-class brands, expert education, and dedicated partnership."}
                    </p>
                </FadeIn>

                {/* Dual Action Buttons */}
                <motion.div
                    variants={staggerMedium}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto"
                >
                    <motion.div variants={fadeInUp} className="w-full sm:w-auto">
                        <Link
                            href="/products"
                            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-none bg-white px-7 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#0A0A0A] transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
                        >
                            <span>{preFooter?.exploreProducts ?? "Explore Products"}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="w-full sm:w-auto">
                        <Link
                            href="/partnership"
                            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-none border border-white/25 bg-transparent px-7 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:border-white hover:bg-white/10"
                        >
                            <span>{preFooter?.becomePartner ?? "Become a Partner"}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
