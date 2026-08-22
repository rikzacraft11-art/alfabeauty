"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/shared/lib/config";
import { motion } from "framer-motion";

interface BrandTotemItem {
    id: string;
    name: string;
    origin: string;
    category: string;
    totemImage: string;
    href: string;
}

const BRAND_TOTEMS: BrandTotemItem[] = [
    {
        id: "montibello",
        name: "Montibello",
        origin: "Spain",
        category: "Botanical Haircare & Color",
        totemImage: "/images/totems/totem-montibello.webp",
        href: "/brands",
    },
    {
        id: "alfaparf",
        name: "Alfaparf Milano",
        origin: "Italy",
        category: "Complete Professional Haircare",
        totemImage: "/images/totems/totem-alfaparf.webp",
        href: "/brands",
    },
    {
        id: "farmavita",
        name: "Farmavita",
        origin: "Italy",
        category: "Color & Treatment Science",
        totemImage: "/images/totems/totem-farmavita.webp",
        href: "/brands",
    },
    {
        id: "gammaplus",
        name: "Gamma+ Professional",
        origin: "Italy",
        category: "Precision Tools & Equipment",
        totemImage: "/images/totems/totem-gammaplus.webp",
        href: "/brands",
    },
    {
        id: "core",
        name: "CORE Professional",
        origin: "Japan",
        category: "Perm Systems & Restoration",
        totemImage: "/images/totems/totem-core.webp",
        href: "/brands",
    },
];

/* ─────────────────────────────────────────────────────────────────────
 * BrandTotemShowroom (1:1 Yucca Architecture & Editorial Consistency)
 *
 * - Unified sans-serif typography matching Section 2 & Section 4.
 * - Removed cheap card boxes, colored badges, and cluttered panels.
 * - Photorealistic 2.5D Standing Kiosks positioned directly on the clean
 *   architectural floor with natural contact shadows.
 * ───────────────────────────────────────────────────────────────────── */
export function BrandTotemShowroom(): React.JSX.Element {
    return (
        <section className="section section-brand-totems border-b border-border-warm/40 bg-background py-20 sm:py-28 lg:py-36 text-foreground">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                
                {/* ─── Section Header (Consistent with Section 2 & Section 4) ─── */}
                <div className="mx-auto max-w-[980px] text-center">
                    <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.2rem] font-normal leading-[1.18] tracking-[-0.02em] text-foreground text-balance">
                        Global Master Brand Portfolio
                    </h2>

                    <p className="mt-4 sm:mt-6 text-[15px] sm:text-[16.5px] leading-relaxed text-muted-foreground/90 max-w-2xl mx-auto">
                        Exclusive Indonesian distribution of 5 world-class Italian, Spanish, and Japanese professional salon houses.
                    </p>
                </div>

                {/* ─── 2.5D Standing Totems Display (Clean Architectural Stage, No Cheap Cards) ─── */}
                <div className="mt-14 sm:mt-20 lg:mt-24">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 items-end">
                        {BRAND_TOTEMS.map((totem) => (
                            <Link
                                key={totem.id}
                                href={totem.href}
                                className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300"
                            >
                                {/* 2.5D Standing Digital Totem Kiosk */}
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                    className="relative h-[340px] sm:h-[400px] lg:h-[460px] w-full flex items-center justify-center"
                                >
                                    <Image
                                        src={totem.totemImage}
                                        alt={`${totem.name} 2.5D Digital Display`}
                                        fill
                                        className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.16)]"
                                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                                    />
                                </motion.div>

                                {/* Clean Editorial Brand Label */}
                                <div className="mt-5 w-full">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                        {totem.origin}
                                    </p>
                                    <h3 className="mt-1 text-[15px] sm:text-[16px] font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground/80">
                                        {totem.name}
                                    </h3>
                                    <p className="mt-0.5 text-[12.5px] text-muted-foreground/80">
                                        {totem.category}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ─── Bottom Action Button (Consistent 1:1 Yucca Button) ─── */}
                <div className="mt-12 sm:mt-16 flex justify-center">
                    <Link
                        href={NAV_LINKS.brands}
                        className="inline-flex items-center justify-center rounded-sm bg-foreground px-8 py-3.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-foreground/90 hover:shadow-sm"
                    >
                        <span>Explore all brands</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
