"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { type CatalogProduct } from "../data/products";

interface ProductCardProps {
    product: CatalogProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Deterministic rating & sales indicator based on product id
    const rating = 4.9;
    const reviewCount = ((product.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 8) + 3) * 50;

    return (
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white border border-black/[0.06] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
            <Link
                href={`/products/${product.id}`}
                className="flex h-full flex-col justify-between"
            >
                {/* 1:1 Aspect Ratio Media Stage */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#FAF8F5] p-2 flex items-center justify-center">
                    {/* Official Premium Badge (Top Left - 1:1 Kérastase Inspiration) */}
                    <div className="absolute left-2.5 top-2.5 z-10">
                        <span className="inline-flex items-center gap-1 rounded bg-[#B38E5D]/10 border border-[#B38E5D]/30 px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#8A6635]">
                            PREMIUM
                        </span>
                    </div>

                    {/* NEW Status Badge (Top Right) */}
                    {product.isNew && (
                        <div className="absolute right-2.5 top-2.5 z-10">
                            <span className="inline-block rounded-sm bg-foreground px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider text-background shadow-xs">
                                NEW
                            </span>
                        </div>
                    )}

                    {/* Packshot Image */}
                    {product.image ? (
                        <div className="relative h-full w-full">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted/40 text-xs text-muted-foreground">
                            <span>No Image</span>
                        </div>
                    )}
                </div>

                {/* Product Content Info */}
                <div className="flex flex-1 flex-col justify-between p-4 pt-3.5">
                    <div>
                        {/* Brand / Series Overline */}
                        <span className="block text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-muted-foreground/75 truncate">
                            {product.brand}
                        </span>

                        {/* Product Title */}
                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-brand-crimson">
                            {product.name}
                        </h3>
                    </div>

                    {/* Price & Social Proof Rating Line */}
                    <div className="mt-3.5 pt-2.5 border-t border-black/[0.05] flex flex-col gap-1.5">
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm font-bold text-foreground tracking-tight">
                                {product.formattedPrice || `Rp ${product.price?.toLocaleString("id-ID") || "150.000"}`}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/60">
                                / unit
                            </span>
                        </div>

                        {/* Social Proof Rating & Sales (1:1 Kérastase Style) */}
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-0.5 text-amber-500 font-semibold text-[11px]">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                                <span>{rating}</span>
                            </div>
                            <span className="text-black/20 text-[9px]">•</span>
                            <span className="text-[10.5px] text-muted-foreground/80 font-normal">
                                {reviewCount}+ Terjual
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom accent color hover line (Matching Brand Card) */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-crimson transition-[width] duration-400 ease-out group-hover:w-full" />
            </Link>
        </article>
    );
};
