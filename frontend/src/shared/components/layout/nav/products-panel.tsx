"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavigationMenuLink } from "@/shared/components/ui/navigation-menu";
import { PRODUCT_CATEGORIES } from "@/shared/lib/config";

const CATEGORIES_DATA: Record<string, { subline: string; image: string; description: string }> = {
    "Hair Colour": {
        subline: "Permanent & Gloss Systems",
        image: "/images/products/montibello-hop/COLOUR LAST SHAMPOO/hero.webp",
        description: "Professional permanent colouring, tonal balancers, and pigment protection systems.",
    },
    "Hair Care": {
        subline: "Botanical Nutrition & Elixir",
        image: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/hero.webp",
        description: "Prestige salon shampoos, restorative hair masks, and botanical gold oil elixirs.",
    },
    "Styling": {
        subline: "Volume, Form & Finishing",
        image: "/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/hero.webp",
        description: "Precision texturizers, volumizing dry sprays, and editorial styling essentials.",
    },
    "Treatments": {
        subline: "Scalp Therapy & Perm Systems",
        image: "/images/products/core/CORE HEAT PERM/hero.webp",
        description: "Advanced chemical reconstruction, heat perm formulation, and scalp detox rituals.",
    },
    "Tools & Equipment": {
        subline: "Italian Engineered Tools",
        image: "/images/products/gamma-plus/XCELL S/hero.webp",
        description: "Ultralight digital dryers, titanium styling irons, and precision salon hardware.",
    },
    "Barber Essentials": {
        subline: "Precision Grooming & Detailing",
        image: "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/hero.webp",
        description: "Professional artisan clippers, detail trimmers, and luxury foil shavers.",
    },
};

const DEFAULT_IMAGE = "/images/products/gamma-plus/XCELL CLIPPER/hero.webp";
const DEFAULT_TITLE = "Explore Our\nProduct Collection";
const DEFAULT_SUBLABEL = "Curated professional-grade products from the world's most trusted salon brands.";

export function ProductsPanel() {
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

    const currentImage = activeCategory ? CATEGORIES_DATA[activeCategory]?.image ?? DEFAULT_IMAGE : DEFAULT_IMAGE;
    const currentTitle = activeCategory ?? DEFAULT_TITLE;
    const currentSubline = activeCategory ? CATEGORIES_DATA[activeCategory]?.description : DEFAULT_SUBLABEL;

    return (
        <div className="mx-auto grid h-[440px] max-w-[1400px] grid-cols-[1.1fr_1.9fr] gap-4 px-8 py-10 lg:px-12">
            {/* Left: Dynamic Master Showcase Card */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-charcoal border border-border-warm/30 p-8 lg:p-10 pr-12 text-white">
                {/* Ambient background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(164,22,26,0.08)_0%,transparent_60%)] pointer-events-none" />

                {/* Seamless blend product image with mix-blend-screen and linear feathering mask */}
                <div className="absolute right-4 top-4 bottom-4 w-[54%] pointer-events-none flex items-center justify-end">
                    <div className="relative h-full w-full">
                        <Image
                            key={currentImage}
                            src={currentImage}
                            alt=""
                            fill
                            sizes="30vw"
                            className="object-contain object-right opacity-45 mix-blend-screen transition-all duration-500 ease-out"
                            style={{
                                maskImage: "linear-gradient(to right, transparent 0%, black 25%)",
                                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%)",
                            }}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-crimson">
                        {activeCategory ? `Category · ${activeCategory}` : "Professional Range"}
                    </p>
                    <h3 className="mt-2.5 text-[1.65rem] font-bold leading-tight tracking-tight text-white whitespace-pre-line">
                        {currentTitle}
                    </h3>
                    <p className="mt-3 max-w-[300px] text-[13px] leading-relaxed text-white/60 transition-all duration-300">
                        {currentSubline}
                    </p>
                </div>

                <div className="relative z-10 mt-auto pt-6">
                    <div className="mb-4 h-px bg-white/15" />
                    <NavigationMenuLink asChild>
                        <Link
                            href={activeCategory ? `/products?category=${activeCategory.toLowerCase().replace(/\s+&?\s*/g, "-")}` : "/products"}
                            className="group/link flex flex-row items-center justify-between gap-0 rounded-none p-0 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-white"
                        >
                            <span>{activeCategory ? `Explore ${activeCategory}` : "View All Products"}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                    </NavigationMenuLink>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-brand-crimson via-brand-crimson/50 to-transparent" />
            </div>

            {/* Right: Editorial Category Grid (2 columns x 3 rows with gap) */}
            <div className="grid grid-cols-2 gap-3.5">
                {PRODUCT_CATEGORIES.map((cat) => {
                    const data = CATEGORIES_DATA[cat];
                    return (
                        <NavigationMenuLink key={cat} asChild>
                            <Link
                                href={`/products?category=${cat.toLowerCase().replace(/\s+&?\s*/g, "-")}`}
                                className="group relative flex min-h-[116px] flex-col justify-between overflow-hidden bg-surface-elevated/75 border border-border-warm/60 p-5 transition-all duration-300 hover:bg-white hover:border-border-warm hover:shadow-[0_10px_28px_rgba(0,0,0,0.04)] text-foreground"
                                onMouseEnter={() => setActiveCategory(cat)}
                                onMouseLeave={() => setActiveCategory(null)}
                            >
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-crimson">
                                        {data?.subline ?? "Professional Series"}
                                    </p>
                                    <h4 className="mt-1 text-[15px] font-bold tracking-tight text-foreground transition-colors duration-300">
                                        {cat}
                                    </h4>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                                        Explore Category
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-muted-foreground/50 group-hover:text-brand-crimson" />
                                    </span>
                                </div>

                                {/* Red accent hover underline */}
                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-crimson transition-[width] duration-500 ease-out group-hover:w-full" />
                            </Link>
                        </NavigationMenuLink>
                    );
                })}
            </div>
        </div>
    );
}
