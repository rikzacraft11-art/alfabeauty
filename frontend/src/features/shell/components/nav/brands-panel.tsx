"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavigationMenuLink } from "@/shared/components/ui/navigation-menu";
import { BRANDS } from "@/shared/lib/config";
import { cn } from "@/shared/lib/utils";

export function BrandsPanel(): React.JSX.Element {
    return (
        <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_3.5fr] gap-10 px-8 py-10 lg:px-12 bg-white text-black">
            {/* Left Column: Calvin Klein Teaser Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F5F2] group">
                <Image
                    src="/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/hero.webp"
                    alt="Brand Showcase"
                    fill
                    sizes="25vw"
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4">
                    <NavigationMenuLink asChild>
                        <Link
                            href="/brands"
                            className="flex items-center justify-between bg-black px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-[#D9403A]"
                        >
                            <span>All Brands</span>
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </NavigationMenuLink>
                </div>
            </div>

            {/* Right Columns: Calvin Klein 5-Column Clean Brand Lists */}
            <div className="grid grid-cols-5 gap-6 py-2">
                {BRANDS.map((brand) => (
                    <div key={brand.name} className="flex flex-col justify-between border-r border-neutral-100 pr-4 last:border-r-0">
                        <div>
                            {/* Logo */}
                            <div className="h-8 mb-4 flex items-center">
                                <Image
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    width={120}
                                    height={32}
                                    className="h-6 w-auto object-contain"
                                />
                            </div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D9403A] mb-1">
                                {brand.origin} {brand.flag}
                            </p>
                            <h4 className="text-[13.5px] font-bold text-black leading-snug">
                                {brand.name}
                            </h4>
                            <p className="mt-2 text-[12px] leading-relaxed text-neutral-500 line-clamp-3">
                                {brand.category}
                            </p>
                        </div>

                        <div className="mt-6 pt-3 border-t border-neutral-100">
                            <NavigationMenuLink asChild>
                                <Link
                                    href={`/products?brand=${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                                    className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black hover:text-[#D9403A] hover:underline decoration-1 underline-offset-4 transition-all"
                                >
                                    Explore Brand
                                </Link>
                            </NavigationMenuLink>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
