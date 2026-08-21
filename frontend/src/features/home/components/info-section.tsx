"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * InfoSection (1:1 Yucca Packaging .section-info — Excellence, Mission & Vision)
 * ───────────────────────────────────────────────────────────────────── */
export function InfoSection(): React.JSX.Element {
    return (
        <section className="section section-info bg-background py-20 sm:py-28 lg:py-36 text-foreground">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* Top Row: Heading & About CTA */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 items-start pb-16 sm:pb-20 border-b border-border-warm/60">
                    <h2 className="text-[2.2rem] sm:text-[3rem] lg:text-[3.8rem] font-normal leading-[1.08] tracking-[-0.03em] text-foreground text-balance">
                        Committed to Excellence, always Innovating
                    </h2>

                    <div className="flex flex-col items-start gap-6 lg:pt-2">
                        <p className="text-[15px] sm:text-[16px] leading-relaxed text-muted-foreground/90">
                            Remarkable haircare formulation is our promise to you. What doesn’t meet Alfa standards is refined until it does.
                        </p>
                        <Link
                            href={NAV_LINKS.about}
                            className="inline-flex items-center justify-center rounded-sm bg-foreground px-6 py-2.5 text-[12.5px] font-semibold text-white transition-colors duration-300 hover:bg-foreground/90"
                        >
                            <span>About us</span>
                        </Link>
                    </div>
                </div>

                {/* Middle Row: Our Mission */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 py-12 sm:py-16 border-b border-border-warm/60 items-baseline">
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-foreground shrink-0" aria-hidden="true" />
                        <h3 className="text-[1.35rem] sm:text-[1.65rem] font-normal tracking-[-0.01em]">
                            Our Mission
                        </h3>
                    </div>

                    <div>
                        <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-muted-foreground/90">
                            We provide world-class, BPOM-certified haircare products and technical mastery from trusted European partners to salons, barbershops, and beauty businesses across Indonesia.
                        </p>
                    </div>
                </div>

                {/* Bottom Row: Our Vision */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 py-12 sm:py-16 border-b border-border-warm/60 items-baseline">
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-foreground shrink-0" aria-hidden="true" />
                        <h3 className="text-[1.35rem] sm:text-[1.65rem] font-normal tracking-[-0.01em]">
                            Our Vision
                        </h3>
                    </div>

                    <div>
                        <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-muted-foreground/90">
                            To be Indonesia&apos;s most trusted professional haircare ecosystem, renowned for technical excellence, reliable supply, and dedication to sustainable salon industry growth.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
