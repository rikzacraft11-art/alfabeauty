"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * CustomMaklonCTA (Section 6 — Minimalist Pure Black Canvas #000000)
 *
 * - Pure luxury solid black background (#000000) without background images.
 * - Left-Aligned Headline, Right-Aligned Button (Balanced Editorial Cadence).
 * - Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function CustomMaklonCTA(): React.JSX.Element {
    const { dict } = useLanguage();

    return (
        <section className="section section-cta section-cta-main relative z-10 border-b border-white/10 bg-[#000000] text-white py-20 sm:py-28 lg:py-32 overflow-hidden">
            <div className="relative z-10 mx-auto max-w-[1540px] px-6 sm:px-10 lg:px-16">
                {/* ─── Left-Aligned Headline ─── */}
                <div className="mr-auto max-w-[880px] text-left">
                    <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.3rem] font-light sm:font-normal leading-[1.18] tracking-[-0.02em] text-white text-balance">
                        {dict.customMaklon.heading}
                    </h2>
                </div>

                {/* ─── Right-Aligned Button (Balanced Editorial Composition) ─── */}
                <div className="mt-10 sm:mt-14 flex items-center justify-end w-full">
                    <Link
                        href={NAV_LINKS.contact}
                        className="group inline-flex items-center gap-2.5 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-white border-b border-white/90 pb-1.5 transition-all duration-200 hover:border-[#EABD68] hover:text-[#EABD68]"
                    >
                        <span>{dict.customMaklon.seeAllProducts || "CONSULT WITH OUR EXPERTS"}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
