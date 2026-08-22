"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Brand } from "../data/brands";
import { useLanguage } from "@/shared/components/providers/language-provider";

interface BrandCardProps {
    brand: Brand;
    productCount?: number;
}

export function BrandCard({ brand }: BrandCardProps): React.JSX.Element {
    const { language } = useLanguage();
    const isId = language === "id";

    return (
        <Link
            href={`/brands/${brand.slug}`}
            aria-label={`${brand.fullName} — ${isId ? "Jelajahi Brand" : "Explore Brand"}`}
            className="group relative flex flex-col justify-between border border-border-warm/60 bg-white p-8 sm:p-12 min-h-[260px] sm:min-h-[300px] transition-all duration-400 hover:border-brand-crimson/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1"
        >
            {/* Centered Brand Logo Stage */}
            <div className="flex-1 flex items-center justify-center py-6 sm:py-10">
                <div className="relative h-20 sm:h-24 w-full max-w-[260px]">
                    <Image
                        src={brand.theme.wordmarkAsset.colored || brand.logo.dark || brand.logo.primary}
                        alt={brand.fullName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                </div>
            </div>

            {/* Bottom Action Link */}
            <div className="pt-6 border-t border-border-warm/40 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-foreground group-hover:text-brand-crimson transition-colors">
                <span>{isId ? "Jelajahi Brand" : "Explore Brand"}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>

            {/* Bottom accent color hover line */}
            <div
                className="absolute bottom-0 left-0 h-[2px] w-0 transition-[width] duration-400 ease-out group-hover:w-full"
                style={{ backgroundColor: brand.theme.primaryColor }}
            />
        </Link>
    );
}

