"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Sparkles,
    MapPin,
    Star,
    Check,
    Plus,
    Minus,
    Beaker,
    Leaf,
    Award
} from "lucide-react";
import { type Brand } from "../data/brands";
import { type Product, ProductCard } from "@/features/catalog";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { NAV_LINKS, WHATSAPP_URL } from "@/shared/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { BrandHeroShowcaseStage } from "./brand-hero-showcase-stage";

interface BrandDetailContentProps {
    brand: Brand;
    products: Product[];
}

export function BrandDetailContent({ brand, products }: BrandDetailContentProps): React.JSX.Element {
    const { language } = useLanguage();
    const isId = language === "id";

    // Dynamic localized strings
    const tagline = isId && brand.taglineId ? brand.taglineId : brand.tagline;
    const description = isId && brand.descriptionId ? brand.descriptionId : brand.description;
    const storyParagraphs = isId && brand.storyId ? brand.storyId : brand.story;
    const pillars = isId && brand.pillarsId ? brand.pillarsId : brand.pillars;
    const collections = isId && brand.collectionsId ? brand.collectionsId : brand.collections;
    const ingredients = isId && brand.keyIngredientsId ? brand.keyIngredientsId : brand.keyIngredients;
    const benefitAreas = isId && brand.benefitAreasId ? brand.benefitAreasId : brand.benefitAreas;
    const labSafety = isId && brand.labSafetyId ? brand.labSafetyId : brand.labSafety;
    const faqs = isId && brand.faqsId ? brand.faqsId : brand.faqs;
    const ritualSteps = isId && brand.ritualId ? brand.ritualId : brand.ritual;
    const sustainability = isId && brand.sustainabilityId ? brand.sustainabilityId : brand.sustainability;
    const testimonials = isId && brand.testimonialsId ? brand.testimonialsId : brand.testimonials;
    const articles = isId && brand.articlesId ? brand.articlesId : brand.articles;

    // Interactive States
    const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
    const [activeTab, setActiveTab] = React.useState<"benefits" | "lab" | "faqs">("benefits");
    const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);

    // Horizontal Product Slider in Section 2
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);

    const checkSliderScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        }
    };

    const handleSliderScroll = (direction: "left" | "right") => {
        if (sliderRef.current) {
            const offset = direction === "left" ? -300 : 300;
            sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
        }
    };

    const spotlightProducts = React.useMemo(() => {
        if (!products || products.length === 0) return [];
        const news = products.filter((p) => p.isNew);
        if (news.length > 0) return news;
        return products.slice(0, 8);
    }, [products]);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex((prev) => (prev === index ? null : index));
    };

    // Filter products
    const filteredProducts = React.useMemo(() => {
        if (selectedCategory === "all") return products;
        if (selectedCategory === "hair-care") {
            return products.filter((p) => p.category === "hair-care" || p.category === "treatments");
        }
        return products.filter((p) => p.category === selectedCategory);
    }, [products, selectedCategory]);

    const theme = brand.theme;

    return (
        <div
            className={`min-h-screen ${theme.fontFamily} transition-colors duration-500`}
            style={{
                background: theme.bgCanvasGradient,
                backgroundColor: theme.bgCanvas,
                color: theme.textPrimary
            }}
        >

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 1: PURE ICONIC CENTERED BRAND WORDMARK HERO (2/4 SCREEN = 50VH)
             * ══════════════════════════════════════════════════════════════ */}
            <section
                className="relative overflow-hidden border-b h-[50vh] min-h-[300px] flex flex-col items-center justify-center text-center"
                style={{ borderColor: theme.borderColor }}
            >
                {/* Soft Atmospheric Radial Ambient Glow */}
                <div
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[250px] sm:h-[350px] rounded-full blur-3xl opacity-35"
                    style={{
                        background: `radial-gradient(circle at center, ${theme.glowColor} 0%, transparent 70%)`
                    }}
                />

                <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-10 flex flex-col items-center justify-center">
                    {/* Massive Centered Official Brand Wordmark */}
                    <div className="relative w-full max-w-[600px] sm:max-w-[720px] aspect-[1440/378] transition-transform duration-700 hover:scale-[1.01]">
                        <Image
                            src={theme.wordmarkAsset.colored}
                            alt={`${brand.name} Brand Wordmark`}
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 1024px) 85vw, 720px"
                        />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 2: BRAND HERITAGE & FRAMELESS 2.5D PRODUCT STAGING
             * ══════════════════════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 border-b overflow-hidden" style={{ borderColor: theme.borderColor }}>
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                        {/* Left Column: Brand Heritage & Narrative Story */}
                        <div className="lg:col-span-6 flex flex-col justify-center">
                            <h2
                                className="text-2xl sm:text-4xl font-light tracking-[-0.02em] leading-tight mb-6"
                                style={{ color: theme.textPrimary }}
                            >
                                {brand.fullName}
                            </h2>

                            <div
                                className="space-y-4 text-sm sm:text-[15px] font-normal leading-relaxed opacity-85"
                                style={{ color: theme.textSecondary }}
                            >
                                {storyParagraphs.map((p, idx) => (
                                    <p key={idx}>{p}</p>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Frameless 2.5D Atmospheric Product Staging with 3D Parallax & Chromatic Scent Stage */}
                        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
                            <BrandHeroShowcaseStage
                                brand={brand}
                                spotlightProduct={spotlightProducts[0]}
                                isId={isId}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 3: KEY ACTIVE FORMULATIONS (4-COLUMN EDITORIAL SPECTRUM)
             * ══════════════════════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 border-b" style={{ borderColor: theme.borderColor }}>
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-16 pb-12 sm:pb-16 items-baseline border-b" style={{ borderColor: theme.borderColor }}>
                        <div>
                            <h2 className="text-2xl sm:text-4xl font-light tracking-[-0.02em]" style={{ color: theme.textPrimary }}>
                                {isId ? "Kandungan Nutrisi & Bahan Aktif Kunci" : "Key Active Ingredients & Molecular Action"}
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm font-normal leading-relaxed opacity-75" style={{ color: theme.textSecondary }}>
                            {isId
                                ? "Dipilih secara presisi untuk efikasi maksimal, perlindungan kutikula rambut, dan hidrasi kulit tanpa rasa berat di iklim tropis."
                                : "Engineered with pharmaceutical purity to deliver cellular repair, barrier protection, and lasting sensory radiance."}
                        </p>
                    </div>

                    {/* 4-Column Elevated Bio-Active Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
                        {ingredients.map((ing, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-7 border flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(196,109,134,0.1)]"
                                style={{ borderColor: theme.borderColor }}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <Beaker className="h-5 w-5" style={{ color: theme.primaryColor }} />
                                        <span className="text-[10px] font-mono uppercase tracking-widest opacity-60" style={{ color: theme.textSecondary }}>
                                            0{idx + 1}
                                        </span>
                                    </div>
                                    <h4 className="text-base sm:text-lg font-medium mb-1" style={{ color: theme.textPrimary }}>
                                        {ing.name}
                                    </h4>
                                    <div
                                        className="text-[11px] font-mono font-semibold mb-3"
                                        style={{ color: theme.accentColor }}
                                    >
                                        {ing.role}
                                    </div>
                                    <p className="text-xs sm:text-[13px] font-normal leading-relaxed opacity-75 mb-6" style={{ color: theme.textSecondary }}>
                                        {ing.description}
                                    </p>
                                </div>
                                <div className="pt-3 border-t text-[10px] font-mono opacity-50" style={{ borderColor: theme.borderColor, color: theme.textSecondary }}>
                                    Source: {ing.source}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 4: INTERACTIVE 3-TAB EXPLORATION (1:1 FAQ HOMEPAGE PARITY)
             * ══════════════════════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 border-b" style={{ borderColor: theme.borderColor }}>
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
                    {/* Minimalist Tab Navigation Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b mb-12" style={{ borderColor: theme.borderColor }}>
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-light" style={{ color: theme.textPrimary }}>
                                {isId ? "Manfaat Teruji, Standar Lab & Tanya Jawab" : "Proven Benefits, Lab Specs & FAQs"}
                            </h3>
                        </div>

                        {/* Underline Style Minimalist Tabs */}
                        <div className="flex items-center gap-6 sm:gap-8">
                            <button
                                onClick={() => setActiveTab("benefits")}
                                className={`pb-2 text-xs font-bold uppercase tracking-[0.16em] transition-all border-b-2 ${
                                    activeTab === "benefits"
                                        ? "border-current opacity-100"
                                        : "border-transparent opacity-50 hover:opacity-100"
                                }`}
                                style={{ color: activeTab === "benefits" ? theme.primaryColor : theme.textPrimary }}
                            >
                                {isId ? "8 Manfaat Inti" : "8 Benefits"}
                            </button>
                            <button
                                onClick={() => setActiveTab("lab")}
                                className={`pb-2 text-xs font-bold uppercase tracking-[0.16em] transition-all border-b-2 ${
                                    activeTab === "lab"
                                        ? "border-current opacity-100"
                                        : "border-transparent opacity-50 hover:opacity-100"
                                }`}
                                style={{ color: activeTab === "lab" ? theme.primaryColor : theme.textPrimary }}
                            >
                                {isId ? "Standar Lab & BPOM" : "Lab Standards"}
                            </button>
                            <button
                                onClick={() => setActiveTab("faqs")}
                                className={`pb-2 text-xs font-bold uppercase tracking-[0.16em] transition-all border-b-2 ${
                                    activeTab === "faqs"
                                        ? "border-current opacity-100"
                                        : "border-transparent opacity-50 hover:opacity-100"
                                }`}
                                style={{ color: activeTab === "faqs" ? theme.primaryColor : theme.textPrimary }}
                            >
                                {isId ? "Tanya Jawab (FAQs)" : "Brand FAQs"}
                            </button>
                        </div>
                    </div>

                    {/* Tab Views */}
                    <AnimatePresence mode="wait">
                        {activeTab === "benefits" && (
                            <motion.div
                                key="benefits"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-x-16 divide-y"
                                style={{ borderColor: theme.borderColor }}
                            >
                                {benefitAreas.map((benefit, idx) => (
                                    <div
                                        key={idx}
                                        className="py-5 flex items-start justify-between gap-6 group transition-colors"
                                        style={{ borderColor: theme.borderColor }}
                                    >
                                        <div>
                                            <div
                                                className="text-[10.5px] font-mono font-semibold uppercase tracking-wider mb-1"
                                                style={{ color: theme.primaryColor }}
                                            >
                                                {benefit.highlight}
                                            </div>
                                            <h4 className="text-[15px] sm:text-[16px] font-medium mb-1" style={{ color: theme.textPrimary }}>
                                                {benefit.title}
                                            </h4>
                                            <p className="text-xs sm:text-[13px] font-normal leading-relaxed opacity-75" style={{ color: theme.textSecondary }}>
                                                {benefit.description}
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-mono font-semibold opacity-40 shrink-0 mt-1" style={{ color: theme.textSecondary }}>
                                            0{idx + 1}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === "lab" && (
                            <motion.div
                                key="lab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
                            >
                                <div className="lg:col-span-5">
                                    <div className="flex items-center gap-2 mb-3" style={{ color: theme.accentColor }}>
                                        <Award className="h-4 w-4" />
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{labSafety.subtitle}</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-light mb-4" style={{ color: theme.textPrimary }}>
                                        {labSafety.title}
                                    </h3>
                                    <p className="text-sm font-normal leading-relaxed opacity-80" style={{ color: theme.textSecondary }}>
                                        {labSafety.description}
                                    </p>
                                </div>

                                <div className="lg:col-span-7 divide-y" style={{ borderColor: theme.borderColor }}>
                                    {labSafety.standards.map((std, idx) => (
                                        <div key={idx} className="py-4 first:pt-0 flex items-center justify-between gap-4" style={{ borderColor: theme.borderColor }}>
                                            <div className="flex items-center gap-3">
                                                <Check className="h-4 w-4 shrink-0" style={{ color: theme.primaryColor }} />
                                                <span className="text-sm font-normal" style={{ color: theme.textPrimary }}>{std}</span>
                                            </div>
                                            <span className="text-[10.5px] font-mono font-semibold text-emerald-600">VERIFIED</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* 1:1 Homepage FAQ Layout & Animation */}
                        {activeTab === "faqs" && (
                            <motion.div
                                key="faqs"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
                            >
                                <div className="lg:col-span-4">
                                    <p
                                        className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2"
                                        style={{ color: theme.accentColor }}
                                    >
                                        {isId ? "Punya Pertanyaan?" : "Have Questions?"}
                                    </p>
                                    <h3 className="text-2xl sm:text-3xl font-light mb-4" style={{ color: theme.textPrimary }}>
                                        {isId ? "Tanya Jawab Seputar Produk & Kemitraan" : "Frequently Asked Questions"}
                                    </h3>
                                    <p className="text-xs sm:text-sm font-normal leading-relaxed mb-6 opacity-75" style={{ color: theme.textSecondary }}>
                                        {isId
                                            ? "Informasi seputar cara pakai, kecocokan iklim tropis, sertifikasi BPOM, dan tata cara pembelian grosir salon."
                                            : "Everything you need to know about formulas, application techniques, and wholesale partnership terms."}
                                    </p>
                                    <Link
                                        href={NAV_LINKS.contact}
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] hover:underline"
                                        style={{ color: theme.primaryColor }}
                                    >
                                        <span>{isId ? "Hubungi Representatif Brand" : "Contact Brand Representative"}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>

                                <div className="lg:col-span-8 divide-y" style={{ borderColor: theme.borderColor }}>
                                    {faqs.map((faq, idx) => {
                                        const isOpen = openFaqIndex === idx;
                                        return (
                                            <div
                                                key={idx}
                                                className="group transition-colors first:pt-0"
                                                style={{ borderColor: theme.borderColor }}
                                            >
                                                <button
                                                    type="button"
                                                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-200"
                                                    aria-expanded={isOpen}
                                                    onClick={() => toggleFaq(idx)}
                                                >
                                                    <span className="text-[15px] sm:text-[16px] font-medium tracking-[-0.01em]" style={{ color: theme.textPrimary }}>
                                                        {faq.question}
                                                    </span>
                                                    <span
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-300"
                                                        style={{ color: isOpen ? theme.primaryColor : theme.textSecondary }}
                                                    >
                                                        {isOpen ? (
                                                            <Minus className="h-4 w-4" />
                                                        ) : (
                                                            <Plus className="h-4 w-4" />
                                                        )}
                                                    </span>
                                                </button>

                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0, y: -4 }}
                                                            animate={{ height: "auto", opacity: 1, y: 0 }}
                                                            exit={{ height: 0, opacity: 0, y: -4 }}
                                                            transition={{
                                                                height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                                                                opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                                                            }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pb-6 pr-6 sm:pr-12 text-sm font-normal leading-relaxed opacity-80" style={{ color: theme.textSecondary }}>
                                                                {faq.answer}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 5: DAILY SALON RITUAL (HORIZONTAL TIMELINE SEQUENCE)
             * ══════════════════════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 border-b" style={{ borderColor: theme.borderColor }}>
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
                    <div className="max-w-2xl mb-14">
                        <h2 className="text-2xl sm:text-4xl font-light" style={{ color: theme.textPrimary }}>
                            {isId ? "3 Langkah Transformasi Salon Profesional" : "3-Step Hair & Body Transformation Ritual"}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
                        {ritualSteps.map((step, idx) => (
                            <div key={idx} className="relative">
                                <div
                                    className="text-5xl font-light mb-3 font-mono opacity-25"
                                    style={{ color: theme.primaryColor }}
                                >
                                    {step.step}
                                </div>
                                <div
                                    className="text-[10.5px] font-mono font-semibold uppercase tracking-widest mb-1.5"
                                    style={{ color: theme.accentColor }}
                                >
                                    {step.subtitle}
                                </div>
                                <h4 className="text-lg font-medium mb-2.5" style={{ color: theme.textPrimary }}>
                                    {step.title}
                                </h4>
                                <p className="text-xs sm:text-sm font-normal leading-relaxed opacity-75" style={{ color: theme.textSecondary }}>
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 6: SUSTAINABILITY & SALON REFILL ECOSYSTEM
             * ══════════════════════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 border-b" style={{ borderColor: theme.borderColor }}>
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        <div className="lg:col-span-6">
                            <div className="flex items-center gap-2 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.22em] mb-3">
                                <Leaf className="h-4 w-4" />
                                <span>{sustainability.tagline}</span>
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-light mb-5" style={{ color: theme.textPrimary }}>
                                {sustainability.title}
                            </h2>
                            <p className="text-sm font-normal leading-relaxed opacity-80" style={{ color: theme.textSecondary }}>
                                {sustainability.description}
                            </p>
                        </div>

                        <div className="lg:col-span-6 divide-y" style={{ borderColor: theme.borderColor }}>
                            {sustainability.features.map((feat, idx) => (
                                <div
                                    key={idx}
                                    className="py-4 first:pt-0 flex items-center gap-4"
                                    style={{ borderColor: theme.borderColor }}
                                >
                                    <div
                                        className="h-2 w-2 rounded-full shrink-0"
                                        style={{ backgroundColor: theme.primaryColor }}
                                    />
                                    <span className="text-xs sm:text-sm font-normal" style={{ color: theme.textPrimary }}>
                                        {feat}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 7: SALON COMMUNITY VOICES (EDITORIAL QUOTES)
             * ══════════════════════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 border-b" style={{ borderColor: theme.borderColor }}>
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5" style={{ fill: theme.primaryColor, color: theme.primaryColor }} />
                                ))}
                                <span className="ml-2 font-mono text-xs opacity-75 font-semibold" style={{ color: theme.textSecondary }}>
                                    {brand.rating.score}/5.0 • {brand.rating.reviewCount}+ Salon Endorsements
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-light" style={{ color: theme.textPrimary }}>
                                {isId ? "Pengakuan Profesional Salon" : "Salon Community Voices"}
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="flex flex-col justify-between">
                                <p className="text-sm font-normal leading-relaxed italic mb-6 opacity-85" style={{ color: theme.textSecondary }}>
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="border-t pt-4" style={{ borderColor: theme.borderColor }}>
                                    <div className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                                        {t.author}
                                    </div>
                                    <div
                                        className="text-[11px] font-medium"
                                        style={{ color: theme.accentColor }}
                                    >
                                        {t.role} • {t.salon}
                                    </div>
                                    <div className="text-[10px] font-mono mt-0.5 opacity-50" style={{ color: theme.textSecondary }}>
                                        {t.city}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 8: OFFICIAL CATALOG SHOWCASE (THE PRODUCT GRID HERO)
             * ══════════════════════════════════════════════════════════════ */}
            <section id="products-catalog" className="py-20 sm:py-28 border-b" style={{ borderColor: theme.borderColor }}>
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                        <div>
                            <h3 className="text-2xl sm:text-4xl font-light" style={{ color: theme.textPrimary }}>
                                {isId ? `Koleksi Lengkap ${brand.name}` : `Complete ${brand.name} Collection`}
                            </h3>
                        </div>

                        {/* Minimalist Underline Filter Tabs */}
                        <div className="flex flex-wrap items-center gap-6 sm:gap-8 border-b border-black/[0.06] pb-3">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory("all")}
                                className={cn(
                                    "group relative py-1 text-xs font-mono tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer",
                                    selectedCategory === "all"
                                        ? "font-bold"
                                        : "text-muted-foreground/60 hover:text-foreground"
                                )}
                                style={{
                                    color: selectedCategory === "all" ? theme.primaryColor : undefined
                                }}
                            >
                                <span>{isId ? "Semua" : "All"} ({products.length})</span>
                                {selectedCategory === "all" && (
                                    <motion.div
                                        layoutId="activeCatalogFilterUnderline"
                                        className="absolute -bottom-3 inset-x-0 h-[2px] rounded-full"
                                        style={{ backgroundColor: theme.primaryColor }}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>

                            {collections.map((col) => {
                                const isSelected = selectedCategory === col.category;
                                return (
                                    <button
                                        key={col.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(col.category)}
                                        className={cn(
                                            "group relative py-1 text-xs font-mono tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer",
                                            isSelected
                                                ? "font-bold"
                                                : "text-muted-foreground/60 hover:text-foreground"
                                        )}
                                        style={{
                                            color: isSelected ? theme.primaryColor : undefined
                                        }}
                                    >
                                        <span>{col.title}</span>
                                        {isSelected && (
                                            <motion.div
                                                layoutId="activeCatalogFilterUnderline"
                                                className="absolute -bottom-3 inset-x-0 h-[2px] rounded-full"
                                                style={{ backgroundColor: theme.primaryColor }}
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Products Grid: 5 Products Per Row */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-sm opacity-50" style={{ color: theme.textSecondary }}>
                            {isId ? "Tidak ada produk dalam kategori ini." : "No products found in this collection."}
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 9: EDUCATIONAL JOURNAL & MASTERCLASS
             * ══════════════════════════════════════════════════════════════ */}
            <section className="py-20 sm:py-28 border-b" style={{ borderColor: theme.borderColor }}>
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
                    <div className="max-w-2xl mb-14">
                        <h2 className="text-2xl sm:text-4xl font-light" style={{ color: theme.textPrimary }}>
                            {isId ? "Teknik Salon & Edukasi Sains Rambut" : "Salon Techniques & Hair Science"}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {articles.map((art, idx) => (
                            <div key={idx} className="flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between text-[10px] font-mono opacity-60 mb-3" style={{ color: theme.textSecondary }}>
                                        <span>{art.category}</span>
                                        <span>{art.readTime}</span>
                                    </div>
                                    <h4 className="text-base sm:text-lg font-medium mb-2.5" style={{ color: theme.textPrimary }}>
                                        {art.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm font-normal leading-relaxed mb-4 opacity-75" style={{ color: theme.textSecondary }}>
                                        {art.summary}
                                    </p>
                                </div>
                                <div
                                    className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                                    style={{ color: theme.accentColor }}
                                >
                                    {art.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
             * SECTION 10: AUTHORIZED SALON PARTNERSHIP & STOCKIST CTA
             * ══════════════════════════════════════════════════════════════ */}
            <section className="py-24 sm:py-32 relative overflow-hidden">
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl sm:text-4xl font-light mb-6" style={{ color: theme.textPrimary }}>
                            {isId
                                ? `Berminat Menjadi Stockist Resmi ${brand.name}?`
                                : `Interested in Becoming an Official ${brand.name} Stockist?`}
                        </h2>
                        <p className="text-sm sm:text-[15px] font-normal mb-10 leading-relaxed opacity-80" style={{ color: theme.textSecondary }}>
                            {isId
                                ? "Dapatkan akses langsung ke pasokan produk resmi berstandar BPOM, pelatihan teknis salon, dan skema harga grosir eksklusif."
                                : "Gain direct access to genuine BPOM-certified supply, professional salon education, and exclusive wholesale commercial terms."}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href={NAV_LINKS.partnership}
                                className="inline-flex items-center gap-2.5 px-9 py-4 text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:opacity-95 shadow-[0_10px_25px_rgba(196,109,134,0.25)]"
                                style={{ backgroundColor: theme.primaryColor }}
                            >
                                <span>{isId ? "Daftar Mitra Salon" : "Register as Salon Partner"}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>

                            <Link
                                href={NAV_LINKS.contact}
                                className="inline-flex items-center gap-2.5 px-9 py-4 border text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-black/5"
                                style={{ borderColor: theme.textPrimary, color: theme.textPrimary }}
                            >
                                <span>{isId ? "Hubungi Tim Ahli" : "Contact Sales Representative"}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
