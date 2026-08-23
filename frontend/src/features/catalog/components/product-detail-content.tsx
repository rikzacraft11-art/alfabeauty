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
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { ProductWhatsAppCTA } from "./product-whatsapp-cta";
import {
    type Product,
    getProductsByBrand,
    products as allProducts,
} from "../data/products";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AddToCartPanel } from "@/features/commerce/components/add-to-cart-panel";
import type { CommerceOffer } from "@/shared/lib/commerce/types";

import { useUserRole } from "@/shared/components/providers/role-provider";
import { resolveProductRoleAccess } from "../lib/role-pricing";
import { ShieldCheck, FileCheck, AlertTriangle, Download, Building2, UserCheck, Sparkles } from "lucide-react";

export function ProductDetailContent({
    product,
    catalogProducts = allProducts,
    catalogPath = "/shop",
    offers = [],
}: {
    product: Product;
    catalogProducts?: Product[];
    catalogPath?: string;
    offers?: CommerceOffer[];
}): React.JSX.Element {
    const { role, config, isSalon, isDistributor, isConsumer, isGuest } = useUserRole();
    const pricing = resolveProductRoleAccess(product, role, config);

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
        return catalogProducts
            .filter((candidate) => candidate.brand === product.brand)
            .filter((p) => p.id !== product.id)
            .slice(0, 4);
    }, [catalogProducts, product]);

    const complementaryProducts = React.useMemo(() => {
        return catalogProducts
            .filter((p) => p.id !== product.id && p.brand !== product.brand)
            .slice(0, 4);
    }, [catalogProducts, product]);

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
                    href={catalogPath}
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
                        <button
                            type="button"
                            className="group relative aspect-square w-full cursor-zoom-in overflow-hidden border border-border-warm/60 bg-surface-elevated/60 transition-all duration-300 hover:border-border-warm"
                            onClick={() => setLightboxIndex(activeImageIndex)}
                            aria-label={`Open ${activeImage?.alt ?? product.name} in fullscreen`}
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
                        </button>

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
                        {/* Header metadata & BPOM verification */}
                        <div className="mb-4 flex flex-wrap items-center gap-3">
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
                            {product.bpomNumber && (
                                <>
                                    <span className="h-3 w-px bg-border-warm" />
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground/80">
                                        <FileCheck className="h-3 w-3 text-emerald-600" />
                                        BPOM: {product.bpomNumber}
                                    </span>
                                </>
                            )}
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {product.name}
                        </h1>

                        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                            {product.description}
                        </p>

                        {/* ─── DYNAMIC ROLE PRICING BOX (Blueprint.md Bagian B1 & D2) ─── */}
                        <div className="mt-6 rounded-lg border border-border-warm/70 bg-surface-elevated/70 p-4.5 sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-crimson">
                                    {isSalon && <ShieldCheck className="h-3.5 w-3.5" />}
                                    {isDistributor && <Building2 className="h-3.5 w-3.5" />}
                                    {isConsumer && <UserCheck className="h-3.5 w-3.5" />}
                                    {pricing.tierLabel}
                                </span>
                                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${product.stockStatus === "indent" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                                    {product.stockStatus === "indent" ? "STATUS: INDENT" : "STATUS: READY"}
                                </span>
                            </div>

                            {/* Price values */}
                            <div className="mt-3 flex flex-wrap items-baseline gap-3">
                                {pricing.canViewNetPrice && pricing.netPrice ? (
                                    <>
                                        <span className="text-2xl font-bold tracking-tight text-brand-crimson sm:text-3xl">
                                            {pricing.formattedNetPrice}
                                        </span>
                                        {pricing.msrpPrice && (
                                            <span className="text-sm font-medium text-muted-foreground/70 line-through">
                                                MSRP: {pricing.formattedMsrp}
                                            </span>
                                        )}
                                        {pricing.discountPercent && (
                                            <span className="rounded bg-brand-crimson/10 px-2 py-0.5 text-xs font-bold text-brand-crimson">
                                                Hemat {pricing.discountPercent}%
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                        {pricing.formattedEffectivePrice}
                                    </span>
                                )}
                            </div>

                            {/* Loyalty points preview for verified partners */}
                            {pricing.pointsEarnedPreview > 0 && (
                                <p className="mt-2.5 flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-700">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Dapatkan estimasi +Rp {pricing.pointsEarnedPreview.toLocaleString("id-ID")} Poin Loyalitas Mitra setelah order lunas.
                                </p>
                            )}

                            {/* Guest prompt to login */}
                            {isGuest && (
                                <p className="mt-2 text-[12px] text-muted-foreground">
                                    Daftarkan salon Anda untuk melihat daftar harga net mitra resmi dan akses pemesanan grosir.
                                </p>
                            )}
                        </div>

                        {/* ─── CHEMICAL SAFETY CALLOUT ("Kapan Anda Butuh Profesional" - M1 & B7) ─── */}
                        {pricing.isRestrictedForRole && (
                            <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-amber-900">
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                <div className="text-[12.5px] leading-relaxed">
                                    <p className="font-bold text-amber-800">
                                        Perawatan Khusus Profesional Salon
                                    </p>
                                    <p className="mt-1 text-amber-700/90">
                                        {pricing.restrictionReason}
                                    </p>
                                </div>
                            </div>
                        )}

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
                                            <div className="pb-5 pt-1 text-[13.5px] leading-relaxed text-muted-foreground/90 space-y-2">
                                                <p>{product.longDescription || product.description}</p>
                                                {product.technicalAttributes && (
                                                    <div className="mt-3 rounded border border-border-warm/60 bg-surface-elevated/40 p-3 text-[12px] space-y-1">
                                                        {product.technicalAttributes.developerRatio && (
                                                            <p><span className="font-semibold text-foreground">Mixing Ratio:</span> {product.technicalAttributes.developerRatio}</p>
                                                        )}
                                                        {product.technicalAttributes.processingTime && (
                                                            <p><span className="font-semibold text-foreground">Processing Time:</span> {product.technicalAttributes.processingTime}</p>
                                                        )}
                                                        {product.technicalAttributes.pHLevel && (
                                                            <p><span className="font-semibold text-foreground">pH Level:</span> {product.technicalAttributes.pHLevel}</p>
                                                        )}
                                                    </div>
                                                )}
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
                                                <div className="pb-5 pt-1 space-y-3">
                                                    <div className="border-l-2 border-brand-crimson bg-surface-elevated/50 p-4">
                                                        <p className="text-[13px] leading-relaxed text-foreground/90">
                                                            {product.howToUse}
                                                        </p>
                                                    </div>

                                                    {/* Official SOP Access for Verified Partners (N9) */}
                                                    {(isSalon || isDistributor) && (
                                                        <div className="flex items-center justify-between rounded border border-border-warm/60 bg-surface-elevated/60 p-3">
                                                            <div className="flex items-center gap-2 text-[12px] font-medium text-foreground">
                                                                <FileCheck className="h-4 w-4 text-brand-crimson" />
                                                                <span>Official Salon SOP & Technical Chart (PDF)</span>
                                                            </div>
                                                            <a
                                                                href={pricing.sopUrl || "#"}
                                                                className="inline-flex items-center gap-1 rounded bg-foreground px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-brand-crimson"
                                                            >
                                                                <Download className="h-3 w-3" />
                                                                Unduh SOP
                                                            </a>
                                                        </div>
                                                    )}
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
                                                    Daftarkan salon Anda untuk mendapatkan fasilitas tempo pembayaran, plafon kredit kemitraan, dan sertifikasi resmi Alfa Beauty Academy.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* CTA Action Matrix (Blueprint.md D2) */}
                        <div className="mt-8">
                            {pricing.canDirectBuy ? (
                                <AddToCartPanel offers={offers} />
                            ) : pricing.ctaType === "login_required" ? (
                                <div className="space-y-3">
                                    <Link
                                        href="/partnership"
                                        className="flex w-full items-center justify-center gap-2 rounded bg-foreground py-3.5 text-center text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-crimson"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Masuk / Daftar Akun Salon
                                    </Link>
                                    <p className="text-center text-[11px] text-muted-foreground">
                                        Pendaftaran salon diverifikasi dalam ≤ 4 jam kerja.
                                    </p>
                                </div>
                            ) : pricing.ctaType === "professional_service_only" ? (
                                <div className="space-y-3">
                                    <Link
                                        href="/partnership"
                                        className="flex w-full items-center justify-center gap-2 rounded bg-brand-crimson py-3.5 text-center text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-dark"
                                    >
                                        <Building2 className="h-4 w-4" />
                                        Temukan Salon Mitra Terdekat
                                    </Link>
                                    <p className="text-center text-[11px] text-muted-foreground">
                                        Perawatan kimia profesional hanya tersedia melalui salon bersertifikasi.
                                    </p>
                                </div>
                            ) : (
                                <Link
                                    href={pricing.ctaHref || "/contact"}
                                    className="flex w-full items-center justify-center gap-2 rounded bg-foreground py-3.5 text-center text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-crimson"
                                >
                                    {pricing.ctaLabel}
                                </Link>
                            )}

                            <div className="mt-4">
                                <ProductWhatsAppCTA
                                    productName={product.name}
                                    brandName={product.brand}
                                />
                            </div>
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
                                    <button
                                        type="button"
                                        key={i}
                                        onClick={() => setLightboxIndex(globalIndex >= 0 ? globalIndex : 0)}
                                        className="group relative aspect-[3/4] cursor-pointer overflow-hidden border border-border-warm/60 bg-background shadow-sm transition-all duration-300 hover:border-brand-crimson hover:shadow-md"
                                        aria-label={`Open ${product.name} feature ${i + 1} in fullscreen`}
                                    >
                                        <Image
                                            src={slide.src}
                                            alt={`${product.name} feature ${i + 1}`}
                                            fill
                                            className="object-cover"
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
                                    </button>
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
                                href={`${catalogPath}?brand=${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
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
                                    href={`${catalogPath}/${item.id}`}
                                    className="group relative flex flex-col justify-between overflow-hidden border border-border-warm/60 bg-surface-elevated/70 p-4 transition-all duration-300 hover:border-border-warm hover:bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden bg-surface/50 mb-3">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-4"
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
                                href={catalogPath}
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
                                    href={`${catalogPath}/${item.id}`}
                                    className="group relative flex flex-col justify-between overflow-hidden border border-border-warm/60 bg-surface-elevated/70 p-4 transition-all duration-300 hover:border-border-warm hover:bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden bg-surface/50 mb-3">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-4"
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
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${product.name} image viewer`}
                >
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        onClick={() => setLightboxIndex(null)}
                        aria-label="Close fullscreen image"
                    />
                    {/* Top bar */}
                    <div className="absolute left-6 right-6 top-6 z-10 flex items-center justify-between text-white">
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
                    <div className="relative z-[1] h-[80vh] w-[90vw] max-w-5xl">
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
