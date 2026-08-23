"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { type CatalogProduct } from "../data/products";
import { useUserRole } from "@/shared/components/providers/role-provider";
import { resolveProductRoleAccess } from "../lib/role-pricing";

interface ProductCardProps {
    product: CatalogProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { role, config, isSalon, isDistributor } = useUserRole();
    const pricing = resolveProductRoleAccess(product, role, config);

    // Deterministic rating & sales indicator based on product id
    const rating = 4.9;
    const reviewCount = ((product.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 8) + 3) * 50;

    return (
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
            <Link
                href={`/products/${product.id}`}
                className="flex h-full flex-col justify-between"
            >
                {/* 1:1 Aspect Ratio Media Stage */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#FAF8F5] p-2 flex items-center justify-center">
                    {/* NEW / Indent Status Badge (Top Right) */}
                    <div className="absolute right-2.5 top-2.5 z-10 flex flex-col items-end gap-1">
                        {product.stockStatus === "indent" ? (
                            <span className="inline-block rounded-sm bg-amber-600 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-white shadow-xs">
                                INDENT
                            </span>
                        ) : product.isNew ? (
                            <span className="inline-block rounded-sm bg-foreground px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider text-background shadow-xs">
                                NEW
                            </span>
                        ) : null}
                    </div>

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
                    <div className="mt-3.5 pt-2 flex flex-col gap-1.5">
                        {/* Role-based price display */}
                        <div className="flex flex-col">
                            {pricing.canViewNetPrice && pricing.netPrice ? (
                                <div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-sm font-bold text-brand-crimson tracking-tight">
                                            {pricing.formattedNetPrice}
                                        </span>
                                        {pricing.discountPercent && (
                                            <span className="rounded bg-brand-crimson/10 px-1.5 py-0.2 text-[9.5px] font-bold text-brand-crimson">
                                                -{pricing.discountPercent}%
                                            </span>
                                        )}
                                    </div>
                                    {pricing.msrpPrice && (
                                        <span className="text-[10px] text-muted-foreground/60 line-through">
                                            MSRP: {pricing.formattedMsrp}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm font-bold text-foreground tracking-tight">
                                        {pricing.formattedEffectivePrice}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Social Proof Rating & Sales */}
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5 text-amber-500 font-semibold text-[11px]">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                                    <span>{rating}</span>
                                </div>
                                <span className="text-black/20 text-[9px]">•</span>
                                <span className="text-[10.5px] text-muted-foreground/80 font-normal">
                                    {reviewCount}+ Terjual
                                </span>
                            </div>

                            {/* Stock status indicator */}
                            <span className={`text-[9.5px] font-medium ${product.stockStatus === "indent" ? "text-amber-600" : "text-emerald-600"}`}>
                                {product.stockStatus === "indent" ? "Indent" : "Ready"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom accent color hover line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-brand-crimson transition-[width] duration-400 ease-out group-hover:w-full" />
            </Link>
        </article>
    );
};
