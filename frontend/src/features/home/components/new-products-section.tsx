"use client";

import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/shared/lib/config";
import { catalogProducts } from "@/features/catalog/data/products";

/* ─────────────────────────────────────────────────────────────────────
 * NewProductsSection (1:1 Yucca Packaging .section-products)
 * ───────────────────────────────────────────────────────────────────── */
export function NewProductsSection(): React.JSX.Element {
    // Select 4 showcase products
    const showcaseProducts = catalogProducts.slice(0, 4);

    return (
        <section className="section section-products bg-background py-16 sm:py-24 lg:py-32 text-foreground">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* Header: Title + Shop now CTA */}
                <div className="flex items-center justify-between pb-10 sm:pb-12">
                    <h2 className="text-[1.85rem] sm:text-[2.4rem] lg:text-[2.8rem] font-normal tracking-[-0.02em] text-foreground">
                        New Products
                    </h2>

                    <Link
                        href={NAV_LINKS.products}
                        className="inline-flex items-center justify-center rounded-sm border border-foreground/30 bg-transparent px-5 py-2 text-[12px] font-semibold text-foreground transition-colors duration-300 hover:bg-foreground hover:text-white"
                    >
                        <span>Shop now</span>
                    </Link>
                </div>

                {/* 4-Column Product Cards Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {showcaseProducts.map((prod) => (
                        <Link
                            key={prod.id}
                            href={`/products/${prod.id}`}
                            className="group flex flex-col"
                        >
                            {/* Product Media Box */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F5F2EC] p-6 transition-all duration-300 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
                                {/* NEW Badge top-right vertical */}
                                <span className="absolute top-3 right-3 z-10 rounded-xs bg-[#2D312E] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.15em] text-white">
                                    NEW
                                </span>

                                <Image
                                    src={prod.image || "/images/products/core/CORE HEAT PERM/hero.webp"}
                                    alt={prod.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="mt-4 flex flex-col">
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    {prod.brand}
                                </p>
                                <h3 className="mt-1 text-[15px] font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand-crimson">
                                    {prod.name}
                                </h3>
                                <p className="mt-1 text-[13px] font-medium text-foreground/80">
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
