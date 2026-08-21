"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type CatalogProduct } from "../data/products";

interface ProductCardProps {
    product: CatalogProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <article className="s-product group relative flex flex-col justify-between overflow-hidden rounded-xl bg-card transition-all duration-300 hover:shadow-lg">
            <Link
                href={`/products/${product.id}`}
                className="p-inner flex h-full flex-col justify-between"
            >
                {/* 1:1 Aspect Ratio Media Container */}
                <div className="p-media relative aspect-square w-full overflow-hidden bg-muted/20 p-4">
                    {/* NEW Status Badge (1:1 Yucca style on top right) */}
                    {product.isNew && (
                        <div className="absolute right-3 top-3 z-10">
                            <span className="inline-block rounded-sm bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                                NEW
                            </span>
                        </div>
                    )}

                    {/* Product Image */}
                    {product.image ? (
                        <div className="relative h-full w-full">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted/40 text-xs text-muted-foreground">
                            <span>No Image</span>
                        </div>
                    )}
                </div>

                {/* Product Content info */}
                <div className="p-content flex flex-1 flex-col justify-between p-4 pt-3">
                    <div>
                        {/* Brand overline */}
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                            {product.brand}
                        </span>

                        {/* Title */}
                        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-foreground/70 sm:text-base">
                            {product.name}
                        </h3>
                    </div>

                    {/* Price Line (1:1 Yucca "From Rp... incl. tax") */}
                    <div className="mt-3 border-t border-border/20 pt-2.5">
                        <span className="text-xs font-semibold text-foreground sm:text-sm">
                            {product.formattedPrice || `Rp ${product.price?.toLocaleString("id-ID") || "150.000"}`}
                        </span>
                        <span className="ml-1.5 text-[10px] text-muted-foreground">
                            / unit
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
};
