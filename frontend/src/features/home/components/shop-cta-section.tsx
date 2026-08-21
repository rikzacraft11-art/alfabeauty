"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * ShopCTASection (1:1 Yucca Packaging .section-shop-cta)
 * ───────────────────────────────────────────────────────────────────── */
export function ShopCTASection(): React.JSX.Element {
    return (
        <section className="section section-shop-cta border-b border-border-warm/40 bg-background py-20 sm:py-28 lg:py-36 text-center">
            <div className="mx-auto max-w-[980px] px-6 sm:px-8">
                <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.2rem] font-normal leading-[1.18] tracking-[-0.02em] text-foreground text-balance">
                    Set the standard for haircare excellence in your salon. Let us help you make every client transformation memorable.
                </h2>

                <div className="mt-8 sm:mt-10 flex justify-center">
                    <Link
                        href={NAV_LINKS.products}
                        className="inline-flex items-center justify-center rounded-sm bg-foreground px-8 py-3.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-foreground/90 hover:shadow-sm"
                    >
                        <span>See products</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
