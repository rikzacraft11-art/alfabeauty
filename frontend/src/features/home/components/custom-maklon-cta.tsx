"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * CustomMaklonCTA (Calvin Klein Editorial Statement on Deep Maroon #5D221C)
 * Official Brand Dictionary Palette: Maroon #5D221C, White, Gold #EABD68
 * Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function CustomMaklonCTA(): React.JSX.Element {
    const { dict } = useLanguage();

    return (
        <section className="section section-cta section-cta-main relative bg-[#5D221C] text-white py-20 sm:py-28 lg:py-32 overflow-hidden">
            {/* Subtle atmospheric luxury lighting on maroon */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(234,189,104,0.08)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div>
                    <h2 className="max-w-4xl text-[2.2rem] sm:text-[3.2rem] lg:text-[4rem] font-light sm:font-normal leading-[1.08] tracking-[-0.03em] text-white text-balance">
                        {dict.customMaklon.heading}
                    </h2>
                </div>

                {/* Minimalist Action Link with Champagne Gold Underline */}
                <div className="mt-14 sm:mt-20 pt-8 border-t border-white/20">
                    <Link
                        href={NAV_LINKS.contact}
                        className="group flex items-center justify-between py-2 text-[1.2rem] sm:text-[1.7rem] font-light tracking-[-0.01em] text-white transition-colors"
                    >
                        <span className="flex items-center gap-3">
                            <span className="text-white/85">{dict.customMaklon.notSurePrefix}</span>
                            <span className="text-[#EABD68] font-normal border-b border-[#EABD68]/70 pb-0.5 transition-colors duration-200 group-hover:text-white group-hover:border-white">
                                {dict.customMaklon.notSureCTA}
                            </span>
                        </span>
                        <div className="flex h-11 w-11 items-center justify-center rounded-none border border-white/30 transition-all duration-300 group-hover:border-[#EABD68] group-hover:bg-[#EABD68] group-hover:text-black">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
