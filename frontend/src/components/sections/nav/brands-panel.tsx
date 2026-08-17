"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { BRANDS } from "@/lib/config";

export function BrandsPanel() {
    return (
        <div className="mx-auto grid h-[440px] max-w-[1400px] grid-cols-[repeat(5,1fr)_180px] gap-3 px-6 py-8 lg:px-8">
            {BRANDS.map((brand) => (
                <NavigationMenuLink key={brand.name} asChild>
                    <Link
                        href={`/products?brand=${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-charcoal text-white"
                    >
                        <div className="absolute inset-0">
                            <Image
                                src={brand.logo}
                                alt=""
                                fill
                                sizes="(max-width: 1400px) 20vw, 250px"
                                className="object-cover opacity-15 transition-opacity duration-300 group-hover:opacity-20"
                                aria-hidden="true"
                            />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

                        <div className="relative z-10 p-5">
                            <div className="mb-3 flex h-9 items-center">
                                <Image
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    width={110}
                                    height={32}
                                    className="h-7 w-auto object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                                />
                            </div>

                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors duration-300 group-hover:text-white/60">
                                {brand.origin} {brand.flag}
                            </p>
                            <h4 className="mt-1 text-[0.9rem] font-bold leading-snug group-hover:underline underline-offset-4 decoration-white/30">
                                {brand.name}
                            </h4>
                            <p className="mt-1.5 text-[11px] leading-relaxed text-white/45 transition-colors duration-300 group-hover:text-white/60 line-clamp-2">
                                {brand.category}
                            </p>
                        </div>

                        <div className="relative z-10 p-5 pt-0">
                            <div className="mb-3 h-px bg-white/15" />
                            <span className="inline-flex w-full items-center justify-between text-[10px] font-bold text-white/50 transition-colors duration-300 group-hover:text-white">
                                Explore Brand
                                <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>

                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-crimson transition-[width] duration-500 group-hover:w-full" />
                    </Link>
                </NavigationMenuLink>
            ))}

            {/* CTA column */}
            <div className="flex flex-col justify-between border-l border-border-warm/30 pl-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                        Looking for Something?
                    </p>
                    <h4 className="mt-2 text-[15px] font-bold leading-snug">
                        Need Help Choosing?
                    </h4>
                    <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground/60">
                        Our team can help you find the right brand and products for your salon.
                    </p>
                </div>

                <div className="mt-6">
                    <div className="mb-4 h-px bg-border-warm/40" />
                    <NavigationMenuLink asChild>
                        <Link
                            href="/contact"
                            className="flex flex-row items-center justify-between gap-0 rounded-none p-0 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/60 transition-colors duration-300 hover:text-foreground"
                        >
                            Contact Us
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </NavigationMenuLink>
                </div>
            </div>
        </div>
    );
}
