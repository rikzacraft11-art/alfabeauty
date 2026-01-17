"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { IconArrowRightSmall as IconArrowRight } from "@/components/ui/icons";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";
import type { Product } from "@/lib/types";

/**
 * Props for ProductCard component
 * 
 * Supports two patterns:
 * 1. Individual props: slug, brand, name, summary, imageUrl, href
 * 2. Product object: product, href
 */
export interface ProductCardProps {
    /** Brand name */
    brand?: string;
    /** Product name */
    name?: string;
    /** Product summary/description */
    summary?: string;
    /** Product image URL */
    imageUrl?: string;
    /** Link destination */
    href: string;
    /** Animation delay index */
    index?: number;
    /** Product object (alternative to individual props) */
    product?: Product;
    /** Custom view details label (for i18n) */
    viewDetailsLabel?: string;
}

/**
 * ProductCard Component
 * 
 * Displays a product in card format with image, info, and hover CTA.
 * Supports both individual props and Product object pattern.
 * 
 * HCI Principles:
 * - Clear visual hierarchy (image > title > description)
 * - Hover feedback with scale and CTA reveal
 * - Consistent spacing with design tokens
 */
export default function ProductCard({
    brand: brandProp,
    name: nameProp,
    summary: summaryProp,
    imageUrl = "/images/products/product-placeholder.jpg",
    href,
    index = 0,
    product,
    viewDetailsLabel,
}: ProductCardProps) {
    const { locale } = useLocale();
    const tx = t(locale);

    // Support both patterns: individual props or product object
    const brand = product?.brand ?? brandProp ?? "";
    const name = product?.name ?? nameProp ?? "";
    const summary = product?.summary ?? summaryProp ?? "";
    const ctaLabel = viewDetailsLabel ?? tx.cta.viewDetails;

    return (
        <AppLink
            href={href}
            underline="none"
            className="group block border border-border bg-background overflow-hidden 
                 ui-interactive-card ui-fade-in
                 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Product Image */}
            <div className="relative aspect-square bg-subtle overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={`${brand} ${name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index > 3 ? "lazy" : "eager"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay with CTA */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 
                        transition-colors duration-300 flex items-end justify-center pb-4">
                    <span className="type-data-strong text-foreground bg-background/90 backdrop-blur-sm
                          px-4 py-2 opacity-0 translate-y-2 
                          group-hover:opacity-100 group-hover:translate-y-0 
                          transition-all duration-300 flex items-center gap-1">
                        {ctaLabel}
                        <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5 space-y-2">
                <p className="type-kicker text-muted group-hover:text-muted-strong transition-colors">
                    {brand}
                </p>
                <h3 className="type-body-strong text-foreground line-clamp-1">
                    {name}
                </h3>
                <p className="type-body line-clamp-2 min-h-[2.5em]">
                    {summary}
                </p>
            </div>
        </AppLink>
    );
}
