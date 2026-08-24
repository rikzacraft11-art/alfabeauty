"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * InfoSection (Calvin Klein Minimalist Editorial — Excellence, Mission & Vision)
 * Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function InfoSection(): React.JSX.Element {
    const { dict } = useLanguage();

    return (
        <section className="section section-info bg-background bg-tactile-luxury py-12 sm:py-20 lg:py-32 text-foreground border-b border-border-warm/60">
            <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
                {/* Top Row: Heading & About CTA */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 items-start pb-10 sm:pb-14 border-b border-border-warm/60">
                    <div>
                        <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.4rem] font-light sm:font-normal leading-[1.1] tracking-[-0.03em] text-foreground text-balance">
                            {dict.infoSection.heading}
                        </h2>
                    </div>

                    <div className="flex flex-col items-start gap-4 lg:gap-6 lg:pt-4">
                        <p className="text-[14px] sm:text-[15.5px] leading-relaxed text-muted-foreground/90 font-normal">
                            {dict.infoSection.description}
                        </p>
                        <Link
                            href={NAV_LINKS.about}
                            className="group inline-flex items-center gap-2 text-[11.5px] sm:text-[12.5px] font-semibold uppercase tracking-[0.18em] text-foreground border-b border-foreground pb-1 transition-all duration-200 hover:border-brand-crimson hover:text-brand-crimson"
                        >
                            <span>{dict.infoSection.aboutCTA}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Middle Row: Our Mission */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 py-8 sm:py-12 border-b border-border-warm/60 items-baseline">
                    <div className="flex items-center gap-3">
                        <span className="h-1.5 w-5 bg-brand-crimson shrink-0" aria-hidden="true" />
                        <h3 className="text-[1.2rem] sm:text-[1.5rem] font-normal tracking-[-0.01em]">
                            {dict.infoSection.missionTitle}
                        </h3>
                    </div>

                    <div>
                        <p className="text-[13.5px] sm:text-[15px] leading-relaxed text-muted-foreground/90 font-normal">
                            {dict.infoSection.missionDesc}
                        </p>
                    </div>
                </div>

                {/* Bottom Row: Our Vision */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 py-8 sm:py-12 items-baseline">
                    <div className="flex items-center gap-3">
                        <span className="h-1.5 w-5 bg-brand-crimson shrink-0" aria-hidden="true" />
                        <h3 className="text-[1.2rem] sm:text-[1.5rem] font-normal tracking-[-0.01em]">
                            {dict.infoSection.visionTitle}
                        </h3>
                    </div>

                    <div>
                        <p className="text-[13.5px] sm:text-[15px] leading-relaxed text-muted-foreground/90 font-normal">
                            {dict.infoSection.visionDesc}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
