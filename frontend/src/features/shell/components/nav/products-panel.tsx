"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavigationMenuLink } from "@/shared/components/ui/navigation-menu";

const CATEGORY_GROUPS = [
    {
        title: "Hair Colour & Lightening",
        href: "/products?category=hair-colour",
        items: [
            { label: "Permanent Colouring", href: "/products?category=hair-colour" },
            { label: "Ammonia-Free Gloss", href: "/products?category=hair-colour" },
            { label: "Bleaching & Lighteners", href: "/products?category=hair-colour" },
            { label: "Developers & Oxidants", href: "/products?category=hair-colour" },
        ],
    },
    {
        title: "Care & Treatments",
        href: "/products?category=treatments",
        items: [
            { label: "Digital Heat Perm Systems", href: "/products?category=treatments" },
            { label: "Rebonding & Straightening", href: "/products?category=treatments" },
            { label: "Botanical Elixirs & Oils", href: "/products?category=hair-care" },
            { label: "Scalp Therapy & Detox", href: "/products?category=hair-care" },
        ],
    },
    {
        title: "Hardware & Tools",
        href: "/products?category=tools",
        items: [
            { label: "Digital Hair Dryers (120k RPM)", href: "/products?category=tools" },
            { label: "Barber Clippers & Trimmers", href: "/products?category=barber" },
            { label: "Titanium Styling Irons", href: "/products?category=tools" },
            { label: "Artisan Foil Shavers", href: "/products?category=barber" },
        ],
    },
];

export function ProductsPanel(): React.JSX.Element {
    return (
        <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_3fr] gap-10 px-8 py-10 lg:px-12 bg-white text-black">
            {/* Left Column: Calvin Klein Teaser Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F5F2] group">
                <Image
                    src="/images/products/gamma-plus/XCELL CLIPPER/hero.webp"
                    alt="Products Collection"
                    fill
                    sizes="25vw"
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4">
                    <NavigationMenuLink asChild>
                        <Link
                            href="/products"
                            className="flex items-center justify-between bg-black px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-[#ba181b]"
                        >
                            <span>Explore Catalog</span>
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </NavigationMenuLink>
                </div>
            </div>

            {/* Right Columns: Calvin Klein Clean Multi-Column Text Lists */}
            <div className="grid grid-cols-3 gap-8 py-2">
                {CATEGORY_GROUPS.map((group) => (
                    <div key={group.title} className="flex flex-col">
                        <NavigationMenuLink asChild>
                            <Link
                                href={group.href}
                                className="text-[12px] font-bold uppercase tracking-[0.16em] text-black border-b border-black/20 pb-2 mb-4 hover:border-[#ba181b] hover:text-[#ba181b] transition-colors"
                            >
                                {group.title}
                            </Link>
                        </NavigationMenuLink>

                        <ul className="flex flex-col space-y-3">
                            {group.items.map((item) => (
                                <li key={item.label}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className="text-[13.5px] font-normal text-neutral-600 hover:text-[#ba181b] hover:underline decoration-1 underline-offset-4 transition-all"
                                        >
                                            {item.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
