"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { BRANDS } from "@/lib/config";
import { cn } from "@/lib/utils";

export function BrandsPanel() {
    return (
        <div className="mx-auto grid h-[440px] max-w-[1400px] grid-cols-[repeat(5,1fr)_220px] gap-3.5 px-6 py-8 lg:px-8">
            {/* 5 Brand Cards in a single horizontal row */}
            {BRANDS.map((brand) => (
                <NavigationMenuLink key={brand.name} asChild>
                    <Link
                        href={`/products?brand=${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-surface-elevated/75 border border-border-warm/60 p-5 transition-all duration-300 hover:bg-white hover:border-border-warm hover:shadow-[0_10px_28px_rgba(0,0,0,0.04)] text-foreground"
                    >
                        <div>
                            {/* Brand Logo Container */}
                            <div className="mb-4 flex h-10 items-center justify-start">
                                <Image
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    width={140}
                                    height={40}
                                    className={cn(
                                        "w-auto object-contain transition-all duration-300 group-hover:scale-105",
                                        brand.name === "CORE" ? "h-8 sm:h-9" : "h-6 sm:h-7"
                                    )}
                                />
                            </div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-crimson">
                                {brand.origin} {brand.flag}
                            </p>
                            <h4 className="mt-1 text-[15px] font-bold leading-snug tracking-tight text-foreground transition-colors duration-300">
                                {brand.name}
                            </h4>
                            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground/75 transition-colors duration-300 group-hover:text-foreground/85 line-clamp-3">
                                {brand.category}
                            </p>
                        </div>

                        <div className="pt-4">
                            <div className="mb-3.5 h-px bg-border-warm/40" />
                            <span className="inline-flex w-full items-center justify-between text-[11px] font-semibold text-muted-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                                <span>Explore Brand</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-muted-foreground/50 group-hover:text-brand-crimson" />
                            </span>
                        </div>

                        {/* Red accent hover line */}
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-crimson transition-[width] duration-500 ease-out group-hover:w-full" />
                    </Link>
                </NavigationMenuLink>
            ))}

            {/* 6th Column: Vertical Service CTA Column */}
            <div className="flex flex-col justify-between border-l border-border-warm/40 pl-6 py-2">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-crimson">
                        Looking for something?
                    </p>
                    <h4 className="mt-2 text-[16px] font-bold leading-snug text-foreground">
                        Need Help Choosing?
                    </h4>
                    <p className="mt-2.5 text-[12px] leading-relaxed text-muted-foreground/75">
                        Our curation team can help source and recommend exclusive lineups for your salon needs.
                    </p>
                </div>

                <div className="mt-auto pt-6">
                    <div className="mb-4 h-px bg-border-warm/40" />
                    <NavigationMenuLink asChild>
                        <Link
                            href="/contact"
                            className="group/link flex flex-row items-center justify-between gap-0 rounded-none p-0 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-300 hover:text-foreground"
                        >
                            <span>Contact Us</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1 text-muted-foreground/60 group-hover/link:text-brand-crimson" />
                        </Link>
                    </NavigationMenuLink>
                </div>
            </div>
        </div>
    );
}
