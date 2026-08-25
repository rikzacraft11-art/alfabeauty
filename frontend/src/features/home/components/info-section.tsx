"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * InfoSection (Calvin Klein Minimalist Dark Editorial — Excellence, Mission & Vision)
 * Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function InfoSection(): React.JSX.Element {
    const { dict } = useLanguage();

    return (
        <section className="section section-info bg-[#000000] py-12 sm:py-20 lg:py-32 text-white border-b border-white/10">
            <div className="mx-auto w-full max-w-[1720px] px-6 sm:px-10 lg:px-16 xl:px-20">
                {/* Top Row: Heading & About CTA */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16 items-start pb-10 sm:pb-14 border-b border-white/10">
                    <div className="lg:col-span-6">
                        <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.4rem] font-light sm:font-normal leading-[1.1] tracking-[-0.03em] text-white text-balance">
                            {dict.infoSection.heading}
                        </h2>
                    </div>

                    <div className="lg:col-span-6 flex flex-col items-start gap-4 lg:gap-6 lg:pt-3">
                        <p className="text-[14.5px] sm:text-[16px] leading-relaxed text-white/70 font-normal">
                            {dict.infoSection.description}
                        </p>
                        <Link
                            href={NAV_LINKS.about}
                            className="group inline-flex items-center gap-2 text-[11.5px] sm:text-[12.5px] font-semibold uppercase tracking-[0.18em] text-white border-b border-white pb-1 transition-all duration-200 hover:border-[#EABD68] hover:text-[#EABD68]"
                        >
                            <span>{dict.infoSection.aboutCTA}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Middle Row: Our Mission */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-16 py-8 sm:py-12 border-b border-white/10 items-baseline">
                    <div className="lg:col-span-6 flex items-center gap-3">
                        <span className="h-1.5 w-5 bg-brand-crimson shrink-0" aria-hidden="true" />
                        <h3 className="text-[1.2rem] sm:text-[1.5rem] font-normal tracking-[-0.01em] text-white">
                            {dict.infoSection.missionTitle}
                        </h3>
                    </div>

                    <div className="lg:col-span-6">
                        <p className="text-[14px] sm:text-[15.5px] leading-relaxed text-white/70 font-normal">
                            {dict.infoSection.missionDesc}
                        </p>
                    </div>
                </div>

                {/* Bottom Row: Our Vision */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-16 py-8 sm:py-12 items-baseline">
                    <div className="lg:col-span-6 flex items-center gap-3">
                        <span className="h-1.5 w-5 bg-brand-crimson shrink-0" aria-hidden="true" />
                        <h3 className="text-[1.2rem] sm:text-[1.5rem] font-normal tracking-[-0.01em] text-white">
                            {dict.infoSection.visionTitle}
                        </h3>
                    </div>

                    <div className="lg:col-span-6">
                        <p className="text-[14px] sm:text-[15.5px] leading-relaxed text-white/70 font-normal">
                            {dict.infoSection.visionDesc}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
