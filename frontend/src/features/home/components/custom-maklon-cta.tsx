"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * CustomMaklonCTA (Calvin Klein Editorial Statement on Dark Maroon)
 * Featuring the strict Green (#259E4A) accent on "Get in touch to find out."
 * ───────────────────────────────────────────────────────────────────── */
export function CustomMaklonCTA(): React.JSX.Element {
    return (
        <section className="section section-cta section-cta-main bg-[#660708] text-white py-16 sm:py-24 lg:py-28 overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F2D9A0]">
                        Custom Formulations & Maklon OEM
                    </p>
                    <h2 className="mt-4 max-w-4xl text-[2rem] sm:text-[3rem] lg:text-[3.8rem] font-light sm:font-normal leading-[1.08] tracking-[-0.03em] text-white text-balance">
                        Salons and beauty leaders that thrive invest in custom-developed haircare. Let us help bring your vision to life.
                    </h2>
                </div>

                {/* Minimalist Underline Action Link */}
                <div className="mt-12 sm:mt-16 pt-8 border-t border-white/20">
                    <Link
                        href={NAV_LINKS.contact}
                        className="group flex items-center justify-between py-2 text-[1.2rem] sm:text-[1.7rem] font-light tracking-[-0.01em] text-white/90 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <span>Not sure what&apos;s possible?</span>
                            <span className="text-[#259E4A] font-medium border-b border-[#259E4A] pb-0.5 transition-colors duration-200 group-hover:text-[#F2D9A0] group-hover:border-[#F2D9A0]">
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
