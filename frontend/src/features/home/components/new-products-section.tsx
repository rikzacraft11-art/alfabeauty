"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/shared/lib/config";
import { catalogProducts } from "@/features/catalog/data/products";

/* ─────────────────────────────────────────────────────────────────────
 * NewProductsSection (Calvin Klein Minimalist Fashion Product Grid)
 * ───────────────────────────────────────────────────────────────────── */
export function NewProductsSection(): React.JSX.Element {
    const showcaseProducts = catalogProducts.slice(0, 4);

    return (
        <section className="section section-products bg-background bg-tactile-luxury py-20 sm:py-28 lg:py-36 text-foreground border-b border-border-warm/60">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* Header: Title + Shop now Underline CTA */}
                <div className="flex items-end justify-between pb-10 sm:pb-12 border-b border-border-warm/40">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#ba181b] mb-2">
                            Curated Collection
                        </p>
                        <h2 className="text-[1.85rem] sm:text-[2.4rem] lg:text-[2.8rem] font-light sm:font-normal tracking-[-0.02em] text-foreground">
                            New Products
                        </h2>
                    </div>

                    <Link
                        href={NAV_LINKS.products}
                        className="group inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground border-b border-foreground pb-1 transition-all duration-200 hover:border-[#ba181b] hover:text-[#ba181b]"
                    >
                        <span>Shop Catalog</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* 4-Column Minimalist Calvin Klein Product Cards Grid */}
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {showcaseProducts.map((prod) => (
                        <Link
                            key={prod.id}
                            href={`/products/${prod.id}`}
                            className="group flex flex-col"
                        >
                            {/* Frameless Sharp Image Box */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-none bg-[#F7F6F2] border border-neutral-200/60 transition-all duration-300">
                                {/* Clean NEW Tag */}
                                <span className="absolute top-3 left-3 z-10 rounded-none bg-black px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                                    NEW
                                </span>

                                <Image
                                    src={prod.image || "/images/products/core/CORE HEAT PERM/hero.webp"}
                                    alt={prod.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Product Info with Minimalist Typography */}
                            <div className="mt-4 flex flex-col">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                    {prod.brand}
                                </p>
                                <h3 className="mt-1 text-[14.5px] font-normal leading-snug tracking-tight text-foreground transition-colors group-hover:text-[#ba181b]">
                                    {prod.name}
                                </h3>
                                <p className="mt-2 text-[13px] font-semibold text-foreground/90">
                                    From {prod.formattedPrice || "Rp 145.000"} <span className="text-[11px] font-normal text-muted-foreground">/ unit</span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
