"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS, BRAND_COLORS } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * ShopCTASection (Calvin Klein Minimalist Statement on Black Tactile Canvas)
 * Incorporating the strict Emerald Green (#1F9849) accent on black canvas
 * ───────────────────────────────────────────────────────────────────── */
export function ShopCTASection(): React.JSX.Element {
    return (
        <section className="section section-shop-cta relative border-b border-white/10 bg-black bg-dark-grain py-20 sm:py-28 lg:py-36 text-center text-white">
            <div className="mx-auto max-w-[980px] px-6 sm:px-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#EABD68] mb-4">
                    Professional Standard
                </p>
                <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.2rem] font-light sm:font-normal leading-[1.18] tracking-[-0.02em] text-white text-balance">
                    Set the standard for haircare excellence in your salon. Let us help you make every client transformation memorable.
                </h2>

                <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-8">
                    <Link
                        href={NAV_LINKS.products}
                        className="group inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-white border-b border-white/90 pb-1.5 transition-all duration-200 hover:border-[#EABD68] hover:text-[#EABD68]"
                    >
                        <span>See All Products</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>

                    {/* Exact Green (#1F9849) touch on Black Canvas */}
                    <Link
                        href={NAV_LINKS.contact}
                        className="group inline-flex items-center gap-1.5 text-[12.5px] font-normal text-white/80 transition-colors"
                    >
                        <span>Not sure what&apos;s possible?</span>
                        <span className="text-[#1F9849] font-medium border-b border-[#1F9849] pb-0.5 transition-colors duration-200 group-hover:text-[#EABD68] group-hover:border-[#EABD68]">
                            Get in touch to find out.
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
