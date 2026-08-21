"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * ShopCTASection (Calvin Klein Minimalist Editorial Statement)
 * ───────────────────────────────────────────────────────────────────── */
export function ShopCTASection(): React.JSX.Element {
    return (
        <section className="section section-shop-cta border-b border-white/10 bg-black py-20 sm:py-28 lg:py-36 text-center text-white">
            <div className="mx-auto max-w-[980px] px-6 sm:px-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#F2D9A0] mb-4">
                    Professional Standard
                </p>
                <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.2rem] font-light sm:font-normal leading-[1.18] tracking-[-0.02em] text-white text-balance">
                    Set the standard for haircare excellence in your salon. Let us help you make every client transformation memorable.
                </h2>

                <div className="mt-8 sm:mt-12 flex justify-center">
                    <Link
                        href={NAV_LINKS.products}
                        className="group inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-white border-b border-white/90 pb-1.5 transition-all duration-200 hover:border-[#F2D9A0] hover:text-[#F2D9A0]"
                    >
                        <span>See All Products</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
