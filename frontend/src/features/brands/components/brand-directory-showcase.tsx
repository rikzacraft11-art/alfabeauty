"use client";

import * as React from "react";
import { brands } from "../data/brands";
import { BrandCard } from "./brand-card";
import { products } from "@/features/catalog/data/products";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { Sparkles } from "lucide-react";

export function BrandDirectoryShowcase(): React.JSX.Element {
    const { language } = useLanguage();
    const isId = language === "id";

    return (
        <div className="bg-[#FAF9F7] text-foreground min-h-screen">
            {/* ─── Main Directory Header ─── */}
            <section className="py-16 sm:py-24 border-b border-border-warm/60">
                <div className="mx-auto max-w-[1540px] px-6 sm:px-10 lg:px-16">
                    <div className="max-w-3xl mb-14 sm:mb-20">
                        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-crimson mb-4">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>{isId ? "Portofolio Brand Resmi" : "Official Brand Directory"}</span>
                        </span>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light leading-[1.08] tracking-[-0.03em] text-foreground text-balance">
                            {isId
                                ? "Portofolio Brand Kecantikan & Perawatan Rambut Kelas Dunia"
                                : "World-Class Professional Beauty & Haircare Portfolios"}
                        </h1>

                        <p className="mt-6 text-sm sm:text-base text-muted-foreground font-normal leading-relaxed">
                            {isId
                                ? "PT Alfa Beauty Cosmetica mendistribusikan secara eksklusif brand salon terkemuka dari Italia, Spanyol, Jepang, serta formulasi inovatif lokal bersertifikasi BPOM resmi."
                                : "PT Alfa Beauty Cosmetica is the exclusive distributor and manufacturer of premier salon houses from Italy, Spain, Japan, and BPOM-certified domestic formulas."}
                        </p>
                    </div>

                    {/* 6 Brands Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {brands.map((brand) => {
                            const count = products.filter((p) => {
                                const pBrand = p.brand.toLowerCase();
                                const bName = brand.name.toLowerCase();
                                const bFullName = brand.fullName.toLowerCase();
                                return pBrand.includes(bName) || pBrand === bFullName || p.id.startsWith(brand.slug);
                            }).length;

                            return (
                                <BrandCard
                                    key={brand.slug}
                                    brand={brand}
                                    productCount={count}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
