"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SolutionItem {
    id: string;
    title: string;
    description: string;
    href: string;
    bgImage: string;
}

const SOLUTIONS: SolutionItem[] = [
    {
        id: "rebonding",
        title: "Solusi Rebonding & Pelurusan",
        description: "Transformasi pelurusan kimiawi presisi tinggi yang melindungi struktur rambut. Diformulasikan dengan alkali remover dan kontrol pH eksklusif untuk hasil lembut tanpa frizzy.",
        href: "/products?category=treatments",
        bgImage: "/images/solutions/rebonding.jpg",
    },
    {
        id: "colouring",
        title: "Solusi Pewarnaan & Bleaching",
        description: "Teknologi micro-pigment Italia dan Spanish botanical oil yang menjaga ikatan disulfida selama proses bleaching dan coloring, menghasilkan pantulan warna kaya yang tahan lama.",
        href: "/products?category=hair-colour",
        bgImage: "/images/solutions/colouring.jpg",
    },
    {
        id: "barber",
        title: "Solusi Barber & Hardware Presisi",
        description: "Hardware salon dan barber engineered in Italy dengan motor digital ultra-ringan 120.000 RPM, mata pisau titanium presisi, dan daya tahan ekstrem untuk salon berkecepatan tinggi.",
        href: "/products?category=tools",
        bgImage: "/images/solutions/barber.jpg",
    },
];

/* ─────────────────────────────────────────────────────────────────────
 * SolutionsSection (1:1 Yucca Packaging .section-solutions)
 *
 * - Immersive cinematic full-width photographic background cross-fade.
 * - Inactive cards: Clean frosted glass cards showing category title.
 * - Active card: Elevated solid white card with large typography,
 *   full description, horizontal rule, and 'Tell me more' arrow link.
 * ───────────────────────────────────────────────────────────────────── */
export function SolutionsSection(): React.JSX.Element {
    const [activeIndex, setActiveIndex] = React.useState(0);

    return (
        <section className="section section-solutions relative min-h-[700px] lg:min-h-[820px] w-full overflow-hidden bg-[#1D1D1B] text-foreground flex items-center justify-center">
            {/* Dynamic Cinematic Photographic Background Cross-Fade */}
            <div className="absolute inset-0 z-0">
                {SOLUTIONS.map((sol, idx) => (
                    <div
                        key={sol.id}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-700 ease-in-out",
                            idx === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                        )}
                    >
                        <Image
                            src={sol.bgImage}
                            alt={sol.title}
                            fill
                            className="object-cover brightness-[0.65] contrast-[1.05]"
                            sizes="100vw"
                            priority={idx === 0}
                        />
                    </div>
                ))}
                {/* Subtle dark gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>

            {/* Interactive Solution Cards Container */}
            <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 items-center">
                    {SOLUTIONS.map((item, index) => {
                        const isActive = index === activeIndex;

                        if (isActive) {
                            // ─── Active Card (Solid White, Elevated & Expanded) ───
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ scale: 0.98, opacity: 0.9 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="relative z-20 flex min-h-[400px] sm:min-h-[440px] lg:min-h-[480px] flex-col justify-between rounded-[24px] bg-white p-8 sm:p-10 lg:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.45)] text-[#1D1D1B]"
                                >
                                    <div>
                                        <h3 className="text-[1.85rem] sm:text-[2.2rem] lg:text-[2.6rem] font-normal leading-[1.12] tracking-[-0.02em] text-[#1D1D1B]">
                                            {item.title}
                                        </h3>

                                        <p className="mt-5 text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#4A4A48]">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-4">
                                        <div className="mb-6 h-px w-full bg-[#E5E0D8]" />

                                        <Link
                                            href={item.href}
                                            className="group inline-flex w-full items-center justify-between text-[15px] font-medium text-[#1D1D1B] transition-colors hover:text-brand-crimson"
                                        >
                                            <span>Tell me more</span>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1">
                                                <ArrowRight className="h-5 w-5" />
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        }

                        // ─── Inactive Card (Frosted Glass with Centered Title) ───
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => setActiveIndex(index)}
                                className="group relative z-10 flex min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] cursor-pointer flex-col items-center justify-center rounded-[24px] bg-white/20 p-8 sm:p-10 text-center backdrop-blur-xl border border-white/25 transition-all duration-500 hover:bg-white/30 hover:border-white/40 shadow-[0_15px_35px_rgba(0,0,0,0.20)]"
                            >
                                <h3 className="text-[1.65rem] sm:text-[1.95rem] lg:text-[2.25rem] font-normal leading-[1.18] tracking-[-0.01em] text-white transition-transform duration-300 group-hover:scale-105">
                                    {item.title}
                                </h3>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
