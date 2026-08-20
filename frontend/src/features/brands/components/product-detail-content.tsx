"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    Check,
    ArrowRight,
    ChevronDown,
    Maximize2,
    X,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    FlaskConical,
    Sparkle
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { ProductWhatsAppCTA } from "./product-whatsapp-cta";
import {
    type Product,
    getProductsByBrand,
    getRelatedProducts,
    products as allProducts
} from "./product-data";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ProductDetailContent({ product }: { product: Product }): React.JSX.Element {
    // ─── Gallery & Image States ───
    const allImages = React.useMemo(() => {
        const list: { src: string; alt: string; type: string }[] = [];
        if (product.image) {
            list.push({ src: product.image, alt: `${product.name} Hero Packshot`, type: "Hero" });
        }
        if (product.gallery) {
            product.gallery.forEach((g, i) => {
                list.push({ src: g, alt: `${product.name} View ${i + 1}`, type: "Gallery" });
            });
        }
        if (product.infoSlides) {
            product.infoSlides.forEach((s, i) => {
                list.push({ src: s.src, alt: `${product.name} Feature ${i + 1}`, type: s.type.toUpperCase() });
            });
        }
        return list;
    }, [product]);

    const [activeImageIndex, setActiveImageIndex] = React.useState(0);
    const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

    // ─── Drop Reveal / Accordion State (All closed by default) ───
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
        description: false,
        howToUse: false,
        keyBenefits: false,
        variants: false,
        pricing: false,
    });

    const toggleSection = (key: string) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // ─── Related Products ───
    const brandProducts = React.useMemo(() => {
        return getProductsByBrand(product.brand)
            .filter((p) => p.id !== product.id)
            .slice(0, 4);
    }, [product]);

    const complementaryProducts = React.useMemo(() => {
        // Find products from other categories/brands to create rich cross-engagement
        return allProducts
            .filter((p) => p.id !== product.id && p.brand !== product.brand)
            .slice(0, 4);
    }, [product]);

    // ─── Lightbox Keyboard Navigation ───
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowRight") {
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allImages.length : 0));
            }
            if (e.key === "ArrowLeft") {
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, allImages.length]);

    const activeImage = allImages[activeImageIndex] ?? allImages[0];

    return (
        <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
            {/* ─── Breadcrumb ─── */}
            <nav aria-label="Breadcrumb" className="mx-auto max-w-[1400px] px-6 py-6 sm:px-8 lg:px-12">
                <Link
                    href="/products"
                    className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                    Back to Products Catalog
                </Link>
            </nav>

            {/* ─── Main Hero Split Studio ─── */}
            <section className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                    {/* LEFT: Interactive Gallery Viewer */}
                    <div className="flex flex-col gap-4">
                        {/* Main Stage Display */}
                        <div
                            className="group relative aspect-square w-full cursor-zoom-in overflow-hidden border border-border-warm/60 bg-surface-elevated/60 transition-all duration-300 hover:border-border-warm"
                            onClick={() => setLightboxIndex(activeImageIndex)}
                        >
                            {activeImage ? (
                                <Image
                                    src={activeImage.src}
                                    alt={activeImage.alt}
                                    fill
                                    className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    No image available
                                </div>
                            )}

                            {/* Zoom prompt badge */}
                            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-border-warm/60 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm transition-all duration-300 group-hover:bg-foreground group-hover:text-white">
                                <Maximize2 className="h-3 w-3" />
                                <span>Click to Expand</span>
                            </div>

                            {/* Type tag */}
                            {activeImage && (
                                <div className="absolute bottom-4 left-4 rounded-full border border-border-warm/60 bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-crimson backdrop-blur-sm">
                                    {activeImage.type}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={cn(
                                            "relative aspect-square h-20 shrink-0 overflow-hidden border bg-surface-elevated/50 transition-all duration-200",
                                            activeImageIndex === idx
                                                ? "border-brand-crimson ring-1 ring-brand-crimson"
                                                : "border-border-warm/60 hover:border-foreground/40 opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            fill
                                            className="object-contain p-2"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Details & Drop Reveal Menu */}
                    <div className="flex flex-col justify-start">
                        {/* Header metadata */}
                        <div className="mb-4 flex items-center gap-3">
                            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-crimson">
                                {product.brand}
                            </span>
                            <span className="h-3 w-px bg-border-warm" />
                            <Badge
                                variant="outline"
                                className="border-border-warm/80 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                            >
                                {product.category}
                            </Badge>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {product.name}
                        </h1>

                        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                            {product.description}
                        </p>

                        {/* ─── DROP REVEAL (ACCORDION) SECTIONS (Yucca Style with Slow Reveal) ─── */}
                        <div className="mt-8 border-t border-border-warm/60">
                            {/* 01. Description & Formulation */}
                            <div className="border-b border-border-warm/60">
                                <button
                                    type="button"
                                    onClick={() => toggleSection("description")}
                                    className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-brand-crimson"
                                >
                                    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground">
                                        01. Description & Technical Overview
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 text-muted-foreground transition-transform duration-400 ease-out",
                                            openSections.description && "rotate-180 text-brand-crimson"
                                        )}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {openSections.description && (
                                        <motion.div
                                            key="desc-content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-5 pt-1 text-[13.5px] leading-relaxed text-muted-foreground/90">
                                                <p>{product.longDescription || product.description}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* 02. How to Use / Professional Salon Protocol */}
                            {product.howToUse && (
                                <div className="border-b border-border-warm/60">
                                    <button
                                        type="button"
                                        onClick={() => toggleSection("howToUse")}
                                        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-brand-crimson"
                                    >
                                        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground">
                                            02. How to Use & Application Protocol
                                        </span>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-transform duration-400 ease-out",
                                                openSections.howToUse && "rotate-180 text-brand-crimson"
                                            )}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {openSections.howToUse && (
                                            <motion.div
                                                key="how-content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-5 pt-1">
                                                    <div className="border-l-2 border-brand-crimson bg-surface-elevated/50 p-4">
                                                        <p className="text-[13px] leading-relaxed text-foreground/90">
                                                            {product.howToUse}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* 03. Key Benefits & Clinical Results */}
                            {product.keyBenefits && product.keyBenefits.length > 0 && (
                                <div className="border-b border-border-warm/60">
                                    <button
                                        type="button"
                                        onClick={() => toggleSection("keyBenefits")}
                                        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-brand-crimson"
                                    >
                                        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground">
                                            03. Key Benefits & Results
                                        </span>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-transform duration-400 ease-out",
                                                openSections.keyBenefits && "rotate-180 text-brand-crimson"
                                            )}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {openSections.keyBenefits && (
                                            <motion.div
                                                key="benefits-content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-5 pt-1">
                                                    <ul className="space-y-2.5">
                                                        {product.keyBenefits.map((benefit, i) => (
                                                            <li key={i} className="flex items-start gap-2.5">
                                                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-crimson" />
                                                                <span className="text-[13px] leading-relaxed text-muted-foreground/90">
                                                                    {benefit}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* 04. Available Formats & Variants */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="border-b border-border-warm/60">
                                    <button
                                        type="button"
                                        onClick={() => toggleSection("variants")}
                                        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-brand-crimson"
                                    >
                                        <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground">
                                            04. Formats, Sizes & Specifications
                                        </span>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-transform duration-400 ease-out",
                                                openSections.variants && "rotate-180 text-brand-crimson"
                                            )}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {openSections.variants && (
                                            <motion.div
                                                key="variants-content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-5 pt-1">
                                                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                                                        Available Options:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.variants.map((v) => (
                                                            <Badge
                                                                key={v}
                                                                variant="outline"
                                                                className="border-border-warm/80 bg-surface-elevated px-3 py-1 text-[12px] font-medium text-foreground"
                                                            >
                                                                {v}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    {product.recommendedFor && product.recommendedFor.length > 0 && (
                                                        <div className="mt-4">
                                                            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                                                                Recommended For:
                                                            </p>
                                                            <ul className="space-y-1">
                                                                {product.recommendedFor.map((rec, i) => (
                                                                    <li key={i} className="text-[12px] text-muted-foreground/90">
                                                                        • {rec}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* 05. B2B Salon Inquiry & Wholesale */}
                            <div className="border-b border-border-warm/60">
                                <button
                                    type="button"
                                    onClick={() => toggleSection("pricing")}
                                    className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-brand-crimson"
                                >
                                    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground">
                                        05. Professional Salon Pricing & Partnership
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 text-muted-foreground transition-transform duration-400 ease-out",
                                            openSections.pricing && "rotate-180 text-brand-crimson"
                                        )}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {openSections.pricing && (
                                        <motion.div
                                            key="pricing-content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-5 pt-1 text-[13px] leading-relaxed text-muted-foreground/90 space-y-2">
                                                <p>
                                                    As an exclusive distributor, Alfa Beauty provides tiered wholesale pricing, technical masterclasses, and dedicated account management for registered salon and barbershop partners.
                                                </p>
                                                <p className="text-[12px] text-brand-crimson font-medium">
                                                    Contact our salon specialists below to request wholesale price lists or starter trial packages.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* CTA Action */}
                        <div className="mt-8">
                            <ProductWhatsAppCTA
                                productName={product.name}
                                brandName={product.brand}
                            />
                            <p className="mt-3 text-[12px] text-muted-foreground">
                                Direct consultation with Alfa Beauty official brand specialists.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── INFOGRAPHICS & TECHNICAL FEATURE DOSSIER ─── */}
            {product.infoSlides && product.infoSlides.length > 0 && (
                <section className="mt-20 border-t border-border-warm/50 bg-surface-elevated/40 py-16">
                    <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                        <div className="mb-10 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-crimson">
                                    Technical Infographics
                                </p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Product Features & Formulation Science
                                </h2>
                            </div>
                            <p className="text-[12px] text-muted-foreground">
                                Click any slide below to expand in high resolution
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {product.infoSlides.map((slide, i) => {
                                const globalIndex = allImages.findIndex((img) => img.src === slide.src);
                                return (
                                    <div
                                        key={i}
                                        onClick={() => setLightboxIndex(globalIndex >= 0 ? globalIndex : 0)}
                                        className="group relative aspect-[3/4] cursor-pointer overflow-hidden border border-border-warm/60 bg-background shadow-sm transition-all duration-300 hover:border-brand-crimson hover:shadow-md"
                                    >
                                        <Image
                                            src={slide.src}
                                            alt={`${product.name} feature ${i + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3.5 text-white">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-crimson">
                                                {slide.type}
                                            </p>
                                            <p className="text-[11px] font-medium opacity-80">
                                                Tap to view detail →
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── ENGAGEMENT SECTION 1: MORE FROM THIS BRAND ─── */}
            {brandProducts.length > 0 && (
                <section className="border-t border-border-warm/50 py-16">
                    <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                        <div className="mb-10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-crimson">
                                    Brand Portfolio
                                </p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    More from {product.brand}
                                </h2>
                            </div>
                            <Link
                                href={`/products?brand=${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
                                className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-brand-crimson"
                            >
                                <span>View Brand Lineup</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-brand-crimson" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {brandProducts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.id}`}
                                    className="group relative flex flex-col justify-between overflow-hidden border border-border-warm/60 bg-surface-elevated/70 p-4 transition-all duration-300 hover:border-border-warm hover:bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden bg-surface/50 mb-3">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-brand-crimson">
                                            {item.category}
                                        </span>
                                        <h4 className="mt-1 text-[14px] font-bold tracking-tight text-foreground line-clamp-1">
                                            {item.name}
                                        </h4>
                                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/75 line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-border-warm/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                                        <span>View Product</span>
                                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 text-brand-crimson" />
                                    </div>

                                    {/* Red hover underline */}
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-crimson transition-[width] duration-500 ease-out group-hover:w-full" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── ENGAGEMENT SECTION 2: COMPLEMENTARY SALON RITUALS (Cross-Brand) ─── */}
            {complementaryProducts.length > 0 && (
                <section className="border-t border-border-warm/50 bg-surface-elevated/30 py-16">
                    <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                        <div className="mb-10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-crimson">
                                    Curated Recommendations
                                </p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Complementary Salon Pairings
                                </h2>
                            </div>
                            <Link
                                href="/products"
                                className="group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-brand-crimson"
                            >
                                <span>Explore All Categories</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-brand-crimson" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {complementaryProducts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.id}`}
                                    className="group relative flex flex-col justify-between overflow-hidden border border-border-warm/60 bg-surface-elevated/70 p-4 transition-all duration-300 hover:border-border-warm hover:bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden bg-surface/50 mb-3">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-crimson">
                                                {item.brand}
                                            </span>
                                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">
                                                {item.category}
                                            </span>
                                        </div>
                                        <h4 className="mt-1.5 text-[14px] font-bold tracking-tight text-foreground line-clamp-1">
                                            {item.name}
                                        </h4>
                                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/75 line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-border-warm/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                                        <span>Discover Lineup</span>
                                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 text-brand-crimson" />
                                    </div>

                                    {/* Red hover underline */}
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-crimson transition-[width] duration-500 ease-out group-hover:w-full" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── FULLSCREEN LIGHTBOX MODAL ─── */}
            {lightboxIndex !== null && allImages[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Top bar */}
                    <div
                        className="absolute left-6 right-6 top-6 flex items-center justify-between text-white z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-crimson">
                                {allImages[lightboxIndex]?.type} · {product.name}
                            </p>
                            <p className="text-[13px] text-white/70">
                                Image {lightboxIndex + 1} of {allImages.length}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLightboxIndex(null)}
                            className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                            aria-label="Close Fullscreen"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Left & Right Nav */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0));
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 z-10"
                                aria-label="Previous Image"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allImages.length : 0));
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 z-10"
                                aria-label="Next Image"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* Image display container */}
                    <div
                        className="relative h-[80vh] w-[90vw] max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={allImages[lightboxIndex]?.src ?? ""}
                            alt={allImages[lightboxIndex]?.alt ?? ""}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                        />
                    </div>
                </div>
            )}

            <Separator className="bg-border-warm/40" />
        </main>
    );
}
