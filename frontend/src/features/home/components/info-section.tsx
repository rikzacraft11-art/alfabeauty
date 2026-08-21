"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * InfoSection (Calvin Klein Minimalist Editorial — Excellence, Mission & Vision)
 * ───────────────────────────────────────────────────────────────────── */
export function InfoSection(): React.JSX.Element {
    return (
        <section className="section section-info bg-background bg-tactile-luxury py-20 sm:py-28 lg:py-36 text-foreground border-b border-border-warm/60">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* Top Row: Heading & About CTA */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 items-start pb-16 sm:pb-20 border-b border-border-warm/60">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#ba181b] mb-4">
                            Corporate Heritage
                        </p>
                        <h2 className="text-[2.2rem] sm:text-[3rem] lg:text-[3.6rem] font-light sm:font-normal leading-[1.08] tracking-[-0.03em] text-foreground text-balance">
                            Committed to Excellence, always Innovating
                        </h2>
                    </div>

                    <div className="flex flex-col items-start gap-6 lg:pt-8">
                        <p className="text-[15px] sm:text-[16px] leading-relaxed text-muted-foreground/90 font-normal">
                            Remarkable haircare formulation is our promise to you. What doesn’t meet Alfa standards is refined until it does.
                        </p>
                        <Link
                            href={NAV_LINKS.about}
                            className="group inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-foreground border-b border-foreground pb-1 transition-all duration-200 hover:border-[#ba181b] hover:text-[#ba181b]"
                        >
                            <span>About PT Alfa Beauty</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Middle Row: Our Mission */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 py-12 sm:py-16 border-b border-border-warm/60 items-baseline">
                    <div className="flex items-center gap-3">
                        <span className="h-1.5 w-6 bg-[#ba181b] shrink-0" aria-hidden="true" />
                        <h3 className="text-[1.35rem] sm:text-[1.65rem] font-normal tracking-[-0.01em]">
                            Our Mission
                        </h3>
                    </div>

                    <div>
                        <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-muted-foreground/90 font-normal">
                            We provide world-class, BPOM-certified haircare products and technical mastery from trusted European partners to salons, barbershops, and beauty businesses across Indonesia.
                        </p>
                    </div>
                </div>

                {/* Bottom Row: Our Vision */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 py-12 sm:py-16 items-baseline">
                    <div className="flex items-center gap-3">
                        <span className="h-1.5 w-6 bg-[#ba181b] shrink-0" aria-hidden="true" />
                        <h3 className="text-[1.35rem] sm:text-[1.65rem] font-normal tracking-[-0.01em]">
                            Our Vision
                        </h3>
                    </div>

                    <div>
                        <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-muted-foreground/90 font-normal">
                            To be Indonesia&apos;s most trusted professional haircare ecosystem, renowned for technical excellence, reliable supply, and dedication to sustainable salon industry growth.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
