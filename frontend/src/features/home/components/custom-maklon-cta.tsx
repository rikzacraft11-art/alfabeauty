"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * CustomMaklonCTA (Calvin Klein Editorial Statement on Dark Maroon #660708)
 * Strict Palette: Maroon Canvas with White Typography & Champagne Gold #F2D9A0 Accents
 * ───────────────────────────────────────────────────────────────────── */
export function CustomMaklonCTA(): React.JSX.Element {
    return (
        <section className="section section-cta section-cta-main relative bg-[#660708] text-white py-20 sm:py-28 lg:py-32 overflow-hidden">
            {/* Subtle atmospheric luxury lighting on maroon */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(242,217,160,0.06)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F2D9A0]">
                        Custom Formulations & Maklon OEM
                    </p>
                    <h2 className="mt-4 max-w-4xl text-[2.2rem] sm:text-[3.2rem] lg:text-[4rem] font-light sm:font-normal leading-[1.08] tracking-[-0.03em] text-white text-balance">
                        Salons and beauty leaders that thrive invest in custom-developed haircare. Let us help bring your vision to life.
                    </h2>
                </div>

                {/* Minimalist Action Link with Champagne Gold Underline */}
                <div className="mt-14 sm:mt-20 pt-8 border-t border-white/20">
                    <Link
                        href={NAV_LINKS.contact}
                        className="group flex items-center justify-between py-2 text-[1.2rem] sm:text-[1.7rem] font-light tracking-[-0.01em] text-white transition-colors"
                    >
                        <span className="flex items-center gap-3">
                            <span className="text-white/85">Not sure what&apos;s possible?</span>
                            <span className="text-[#F2D9A0] font-normal border-b border-[#F2D9A0]/70 pb-0.5 transition-colors duration-200 group-hover:text-white group-hover:border-white">
                                Get in touch to find out.
                            </span>
                        </span>
                        <div className="flex h-11 w-11 items-center justify-center rounded-none border border-white/30 transition-all duration-300 group-hover:border-[#F2D9A0] group-hover:bg-[#F2D9A0] group-hover:text-black">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
