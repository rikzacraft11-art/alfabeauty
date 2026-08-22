"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * Section 5: Shop by Category (1:1 Reference Layout & Editorial Styling)
 * Left column: Title & View All Products CTA
 * Right column: 4 Rounded Luxury Category Cards with Lifestyle Imagery
 * Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function NewProductsSection(): React.JSX.Element {
    const { dict } = useLanguage();
    const categories = dict.shopByCategory?.categories ?? [];

    return (
        <section className="section section-products bg-background bg-tactile-luxury py-20 sm:py-28 lg:py-36 text-foreground border-b border-border-warm/60">
            <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    
                    {/* ─── Left Column (lg:col-span-3): Editorial Headline & CTA ─── */}
                    <div className="lg:col-span-3 flex flex-col items-start pr-0 lg:pr-4">
                        <h2 className="text-[2rem] sm:text-[2.5rem] lg:text-[2.85rem] font-light leading-[1.1] tracking-[-0.02em] text-foreground">
                            {dict.shopByCategory.title}
                        </h2>
                        
                        <p className="mt-3.5 text-[14.5px] leading-relaxed text-muted-foreground/90 max-w-xs font-normal">
                            {dict.shopByCategory.subtitle}
                        </p>

                        <div className="mt-6 sm:mt-8">
                            <Link
                                href={NAV_LINKS.products}
                                className="group inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.02em] text-foreground border-b border-foreground pb-1 transition-all duration-200 hover:text-brand-crimson hover:border-brand-crimson"
                            >
                                <span>{dict.shopByCategory.viewAllProducts}</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* ─── Right Column (lg:col-span-9): 4 Minimalist Rounded Category Cards ─── */}
                    <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={cat.href}
                                className="group relative overflow-hidden flex flex-col bg-white rounded-2xl p-2.5 sm:p-3 pb-5 border border-border-warm/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-brand-crimson/50"
                            >
                                {/* Rounded Top Lifestyle Image Container */}
                                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface/50">
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 22vw"
                                        className="object-cover"
                                    />
                                </div>

                                {/* Category Title & Shop Now Underline Link */}
                                <div className="mt-3.5 flex flex-col items-center text-center px-1">
                                    <h3 className="text-[14.5px] sm:text-[15.5px] font-medium tracking-tight text-foreground transition-colors group-hover:text-brand-crimson">
                                        {cat.title}
                                    </h3>
                                    
                                    <span className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-normal text-muted-foreground transition-all group-hover:text-brand-crimson group-hover:underline underline-offset-2">
                                        {dict.shopByCategory.shopNow}
                                        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </span>
                                </div>

                                {/* Bottom accent color hover line (Matching Brand Card) */}
                                <div className="absolute bottom-0 left-0 h-[2.5px] w-0 bg-brand-crimson transition-[width] duration-400 ease-out group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
