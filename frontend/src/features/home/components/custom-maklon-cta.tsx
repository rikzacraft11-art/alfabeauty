"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * CustomMaklonCTA (1:1 Yucca Packaging .section-cta .section-cta-main)
 * ───────────────────────────────────────────────────────────────────── */
export function CustomMaklonCTA(): React.JSX.Element {
    return (
        <section className="section section-cta section-cta-main bg-[#660708] text-white py-16 sm:py-24 lg:py-28 overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                        Custom Formulations & Maklon
                    </p>
                    <h2 className="mt-4 max-w-4xl text-[2rem] sm:text-[3rem] lg:text-[4rem] font-normal leading-[1.08] tracking-[-0.03em] text-white text-balance">
                        Salons and beauty leaders that thrive invest in custom-developed haircare. Let us help bring your vision to life.
                    </h2>
                </div>

                {/* Bottom Running Marquee CTA Link */}
                <div className="mt-12 sm:mt-16 pt-8 border-t border-white/20">
                    <Link
                        href={NAV_LINKS.contact}
                        className="group flex items-center justify-between py-2 text-[1.25rem] sm:text-[1.85rem] font-light tracking-[-0.01em] text-white/90 transition-colors hover:text-white"
                    >
                        <span className="flex items-center gap-4">
                            <span>Not sure what&apos;s possible? Get in touch to find out.</span>
                        </span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:border-white group-hover:bg-white group-hover:text-[#660708]">
                            <ArrowUpRight className="h-6 w-6" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
