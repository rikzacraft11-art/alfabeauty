"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Brand = {
    name: string;
    logo: string;
    href?: string;
};

type BrandLogoProps = {
    brands: Brand[];
    className?: string;
};

/**
 * BrandLogo: Logo strip with elegant hover effects.
 * TOGAF ARCH-19: Design V2 brand showcase component.
 */
export default function BrandLogo({ brands, className = "" }: BrandLogoProps) {
    return (
        <div className={`flex flex-wrap items-center justify-center gap-8 lg:gap-12 ${className}`}>
            {brands.map((brand) => (
                <motion.div
                    key={brand.name}
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    {brand.href ? (
                        <a
                            href={brand.href}
                            className="block p-4 rounded-xl transition-all duration-[var(--transition-elegant)] hover:bg-subtle"
                            aria-label={`View ${brand.name} products`}
                        >
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={120}
                                height={48}
                                className="h-10 w-auto object-contain grayscale opacity-60 transition-all duration-[var(--transition-elegant)] group-hover:grayscale-0 group-hover:opacity-100"
                            />
                        </a>
                    ) : (
                        <div className="p-4 rounded-xl">
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={120}
                                height={48}
                                className="h-10 w-auto object-contain grayscale opacity-60 transition-all duration-[var(--transition-elegant)] group-hover:grayscale-0 group-hover:opacity-100"
                            />
                        </div>
                    )}

                    {/* Tooltip */}
                    <motion.span
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-foreground text-background type-legal whitespace-nowrap opacity-0 pointer-events-none"
                        initial={{ opacity: 0, y: -10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                    >
                        {brand.name}
                    </motion.span>
                </motion.div>
            ))}
        </div>
    );
}

/**
 * Default brand data for Alfa Beauty
 */
export const ALFA_BEAUTY_BRANDS: Brand[] = [
    { name: "Alfaparf Milano", logo: "/brands/alfaparf.svg", href: "/products?brand=alfaparf" },
    { name: "Farmavita", logo: "/brands/farmavita.svg", href: "/products?brand=farmavita" },
    { name: "Montibello", logo: "/brands/montibello.svg", href: "/products?brand=montibello" },
    { name: "Gamma+", logo: "/brands/gammaplus.svg", href: "/products?brand=gammaplus" },
];
