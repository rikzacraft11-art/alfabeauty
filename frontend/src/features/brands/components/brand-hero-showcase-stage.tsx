"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Droplets, Wind, ShieldCheck } from "lucide-react";
import { type Brand } from "../data/brands";
import { type Product } from "@/features/catalog/data/products";
import { cn } from "@/shared/lib/utils";

// ─── 4 Official Scent Spectrum Profiles for SMOOVEE ───
export interface ScentProfile {
    id: string;
    code: string;
    name: string;
    characterId: string;
    characterEn: string;
    color: string;
    glowColor: string;
    textColor: string;
    bgBadge: string;
    image100ml: string;
    image15ml: string;
    productId: string;
    topNotes: string;
    heartNotes: string;
    baseNotes: string;
}

export const SMOOVEE_SCENTS: ScentProfile[] = [
    {
        id: "sekar",
        code: "01",
        name: "SEKAR",
        characterId: "Sweet Blossom • Bunga Musim Semi",
        characterEn: "Sweet Blossom • Spring Floral Romance",
        color: "#C76075",
        glowColor: "rgba(199, 96, 117, 0.35)",
        textColor: "#8A2B40",
        bgBadge: "#FDF2F4",
        image100ml: "/images/products/smoovee/sekar-cutout.png",
        image15ml: "/images/products/smoovee/sekar-cutout.png",
        productId: "smoovee-scent-sekar",
        topNotes: "Pink Pepper, Bergamot, Wild Pear",
        heartNotes: "Damask Rose, Peony, White Magnolia",
        baseNotes: "Cashmere Wood, Soft Amber, White Musk"
    },
    {
        id: "teduh",
        code: "02",
        name: "TEDUH",
        characterId: "Botanical Sage • Kesegaran Alami",
        characterEn: "Botanical Sage • Serene Herbal Breeze",
        color: "#4E7A5A",
        glowColor: "rgba(78, 122, 90, 0.35)",
        textColor: "#285233",
        bgBadge: "#F0F6F2",
        image100ml: "/images/products/smoovee/teduh-cutout.png",
        image15ml: "/images/products/smoovee/teduh-cutout.png",
        productId: "smoovee-scent-teduh",
        topNotes: "Crisp Mint, Green Apple, Water Lily",
        heartNotes: "Clary Sage, Bamboo Leaf, Jasmine Petals",
        baseNotes: "Cedarwood, Vetiver, Clean Marine Accord"
    },
    {
        id: "manika",
        code: "03",
        name: "MANIKA",
        characterId: "Enchanted Lilac • Keanggunan Violet",
        characterEn: "Enchanted Lilac • Elegant Violet Bouquet",
        color: "#7E639B",
        glowColor: "rgba(126, 99, 155, 0.35)",
        textColor: "#4B3267",
        bgBadge: "#F5F2F9",
        image100ml: "/images/products/smoovee/manika-cutout.png",
        image15ml: "/images/products/smoovee/manika-cutout.png",
        productId: "smoovee-scent-manika",
        topNotes: "French Lavender, Blackcurrant, Mandarin",
        heartNotes: "Violet Blossom, Iris, Orange Flower",
        baseNotes: "Bourbon Vanilla, Sandalwood, Tonka Bean"
    },
    {
        id: "rimba",
        code: "04",
        name: "RIMBA",
        characterId: "Warm Amber • Kehangatan Hutan Tropis",
        characterEn: "Warm Amber • Earthy Botanical Forest",
        color: "#B3602D",
        glowColor: "rgba(179, 96, 45, 0.35)",
        textColor: "#7C340A",
        bgBadge: "#FAF3EE",
        image100ml: "/images/products/smoovee/rimba-front-clean.png",
        image15ml: "/images/products/smoovee/rimba-front-clean.png",
        productId: "smoovee-scent-rimba",
        topNotes: "Cardamom, Crushed Pine, Sweet Orange",
        heartNotes: "Patchouli, Nutmeg, Tropical Moss",
        baseNotes: "Aged Agarwood, Smoked Amber, Leather Accord"
    }
];

interface BrandHeroShowcaseStageProps {
    brand: Brand;
    spotlightProduct?: Product;
    isId: boolean;
}

export function BrandHeroShowcaseStage({
    brand,
    spotlightProduct,
    isId
}: BrandHeroShowcaseStageProps): React.JSX.Element {
    const isSmoovee = brand.slug.toLowerCase() === "smoovee";
    const isCore = brand.slug.toLowerCase() === "core";

    // SMOOVEE Specific Interactive States
    const [selectedScentIndex, setSelectedScentIndex] = React.useState(0);
    const currentScent = SMOOVEE_SCENTS[selectedScentIndex];

    // ─── 3D Parallax Mouse Tracking Engine (Silky Smooth Spring Physics) ───
    const cardRef = React.useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 180, mass: 0.8 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5.5, -5.5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5.5, 5.5]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // Active Colors & Theme Tokens
    const activeColor = isSmoovee ? currentScent.color : brand.theme.primaryColor;
    const activeGlow = isSmoovee ? currentScent.glowColor : `${brand.theme.primaryColor}30`;
    const targetProductHref = isSmoovee
        ? `/shop/${currentScent.productId}`
        : spotlightProduct
        ? `/shop/${spotlightProduct.id}`
        : "/shop";

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-[500px] flex flex-col items-center relative select-none"
            style={{ perspective: 1200 }}
        >
            {/* Atmospheric Chromatic 2.5D Depth Glow */}
            <motion.div
                className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-3xl opacity-30"
                animate={{
                    background: `radial-gradient(circle at center, ${activeGlow} 0%, transparent 70%)`
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* ─── CASE 1: SMOOVEE INTERACTIVE CHROMATIC SCENT STAGE ─── */}
            {isSmoovee && (
                <div className="w-full flex flex-col items-center">
                    {/* 3D Parallax Floating Packshot Layer (Non-Clickable, Smooth Hover) */}
                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d"
                        }}
                        className="relative w-full h-[300px] sm:h-[350px] flex items-center justify-center pointer-events-none select-none z-20"
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentScent.id}
                                    initial={{ opacity: 0, scale: 0.96, y: 6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative w-full h-full flex items-center justify-center"
                                >
                                    <Image
                                        src={currentScent.image100ml}
                                        alt={`SMOOVEE ${currentScent.name} Scent Packaging`}
                                        fill
                                        priority
                                        className={cn(
                                            "object-contain transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                            "drop-shadow-[0_25px_35px_rgba(0,0,0,0.16)]"
                                        )}
                                        sizes="(max-width: 768px) 340px, 480px"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Ground Contact Shadow */}
                    <motion.div
                        className="w-[260px] sm:w-[300px] h-5 rounded-[100%] bg-black/10 blur-md -mt-2 mb-6 pointer-events-none"
                        animate={{
                            scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Scent Variant Selector: Ultra-Clean Minimalist Typographic Tabs */}
                    <div className="flex items-center justify-center gap-6 sm:gap-8 mt-2 z-20">
                        {SMOOVEE_SCENTS.map((scent, idx) => {
                            const isSelected = selectedScentIndex === idx;
                            return (
                                <button
                                    key={scent.id}
                                    type="button"
                                    onClick={() => setSelectedScentIndex(idx)}
                                    className="group relative flex flex-col items-center gap-1.5 py-1 transition-all duration-300 cursor-pointer"
                                >
                                    <span
                                        className={cn(
                                            "text-xs font-mono tracking-[0.22em] uppercase transition-all duration-300",
                                            isSelected
                                                ? "text-foreground font-semibold"
                                                : "text-muted-foreground/50 hover:text-muted-foreground"
                                        )}
                                        style={{
                                            color: isSelected ? scent.textColor : undefined
                                        }}
                                    >
                                        {scent.name}
                                    </span>
                                    {/* Minimalist Color Dot Indicator */}
                                    <span
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full transition-all duration-300",
                                            isSelected
                                                ? "scale-100 opacity-100 shadow-sm"
                                                : "scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-40"
                                        )}
                                        style={{ backgroundColor: scent.color }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ─── CASE 2: CORE DUAL POUCH 2.5D TECHNICAL SHOWCASE ─── */}
            {isCore && spotlightProduct && (
                <div className="w-full flex flex-col items-center">
                    {/* 3D Parallax Floating Pouches Layer (Non-Clickable) */}
                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d"
                        }}
                        className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center pointer-events-none select-none z-20"
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src="/images/products/core/core-heat-pouches.png"
                                alt="CORE HEAT PERM 1 HARD & 1 SOFT Japanese Pouches"
                                fill
                                priority
                                className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] scale-110 sm:scale-120 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                sizes="(max-width: 768px) 340px, 480px"
                            />

                            {/* Floating 2.5D Technical Indicator Badges */}
                            <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-left hidden sm:block pointer-events-none">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-900 bg-amber-50/95 border border-amber-200/80 px-2.5 py-1 rounded-md shadow-sm backdrop-blur-sm">
                                    1 HARD • Virgin
                                </span>
                            </div>
                            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-right hidden sm:block pointer-events-none">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-800 bg-slate-100/95 border border-slate-300/80 px-2.5 py-1 rounded-md shadow-sm backdrop-blur-sm">
                                    1 SOFT • Sensitized
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Ground Contact Shadow */}
                    <div className="w-[240px] sm:w-[280px] h-5 rounded-[100%] bg-black/10 blur-md -mt-2 mb-6 pointer-events-none" />

                    {/* Minimalist Editorial Metadata */}
                    <div className="w-full text-center z-20">
                        <p className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.22em] text-muted-foreground/75 mb-1">
                            {spotlightProduct.category} • JAPANESE CYSTEAMINE PERM
                        </p>
                        <h3 className="text-xl sm:text-2xl font-light tracking-tight text-foreground mb-3">
                            {spotlightProduct.name}
                        </h3>

                        {/* Dual Formula Tagline */}
                        <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
                            {isId
                                ? "Sistem pengeritingan digital heat perm dengan formula ganda (HARD untuk rambut resisten & SOFT untuk rambut diwarnai)."
                                : "Dual-strength digital heat perm system engineered with low-alkaline cysteamine chemistry."}
                        </p>
                    </div>
                </div>
            )}

            {/* ─── CASE 3: STANDARD BRAND SINGLE HERO STAGING ─── */}
            {!isSmoovee && !isCore && spotlightProduct && (
                <div className="w-full flex flex-col items-center">
                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d"
                        }}
                        className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center pointer-events-none select-none z-20"
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            {spotlightProduct.image ? (
                                <Image
                                    src={spotlightProduct.image}
                                    alt={spotlightProduct.name}
                                    fill
                                    priority
                                    className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] scale-90 sm:scale-95 rounded-2xl transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                    sizes="(max-width: 768px) 340px, 460px"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-sm font-medium opacity-50">
                                    {brand.name}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Ground Contact Shadow */}
                    <div className="w-[240px] sm:w-[280px] h-5 rounded-[100%] bg-black/10 blur-md -mt-2 mb-6 pointer-events-none" />

                    {/* Minimalist Editorial Metadata */}
                    <div className="w-full text-center z-20">
                        <p className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.22em] text-muted-foreground/75 mb-1">
                            {spotlightProduct.category}
                        </p>
                        <h3 className="text-xl sm:text-2xl font-light tracking-tight text-foreground mb-4">
                            {spotlightProduct.name}
                        </h3>
                    </div>
                </div>
            )}
        </div>
    );
}
