/**
 * Homepage Content Configuration
 * 
 * Centralized i18n content for homepage components.
 * Following Clean Code principles - separating content from presentation.
 */

import type { Locale } from "@/lib/i18n";

// =============================================================================
// Hero Section Content
// =============================================================================

export const heroContent = {
    en: {
        kicker: "PROFESSIONAL BEAUTY DISTRIBUTION",
        headline: "The Art of Professional Beauty",
        description: "Elevate your craft with curated products, expert education, and dedicated support. We partner with salons and barbershops who demand excellence.",
        ctaPrimary: "Explore Products",
        ctaSecondary: "Become Partner",
        note: "No public pricing. Consultation and ordering happen via WhatsApp.",
    },
    id: {
        kicker: "DISTRIBUSI BEAUTY PROFESIONAL",
        headline: "Seni Kecantikan Profesional",
        description: "Tingkatkan keahlian Anda dengan produk terkurasi, edukasi ahli, dan dukungan penuh. Kami bermitra dengan salon dan barbershop yang menuntut keunggulan.",
        ctaPrimary: "Lihat Produk",
        ctaSecondary: "Jadi Partner",
        note: "Tanpa harga publik. Konsultasi dan pemesanan dilakukan via WhatsApp.",
    },
} as const;

export function getHeroContent(locale: Locale) {
    return heroContent[locale];
}

// =============================================================================
// Trust Indicators
// =============================================================================

export const trustIndicators = {
    en: [
        { key: "authentic", text: "Authentic & Licensed Products" },
        { key: "delivery", text: "Nationwide Delivery" },
        { key: "education", text: "Training & Education" },
    ],
    id: [
        { key: "authentic", text: "Produk Original & Ber-BPOM" },
        { key: "delivery", text: "Pengiriman Nasional" },
        { key: "education", text: "Edukasi & Pelatihan" },
    ],
} as const;

export function getTrustIndicators(locale: Locale) {
    return trustIndicators[locale];
}

// =============================================================================
// Category Strip
// =============================================================================

export const categories = [
    { key: "shampoo", image: "/images/categories/shampoo.jpg" },
    { key: "styling", image: "/images/categories/styling.jpg" },
    { key: "color", image: "/images/categories/color.jpg" },
    { key: "treatment", image: "/images/categories/treatment.jpg" },
    { key: "tools", image: "/images/categories/styling.jpg" },
    { key: "accessories", image: "/images/categories/treatment.jpg" },
] as const;

export const categoryLabels = {
    en: {
        shampoo: "Hair Care",
        styling: "Styling",
        color: "Color",
        treatment: "Treatment",
        tools: "Tools",
        accessories: "Accessories",
    },
    id: {
        shampoo: "Perawatan",
        styling: "Styling",
        color: "Pewarnaan",
        treatment: "Treatment",
        tools: "Alat",
        accessories: "Aksesoris",
    },
} as const;

export function getCategoryLabel(locale: Locale, key: string) {
    return categoryLabels[locale][key as keyof typeof categoryLabels.en] || key;
}

export function getCategoryStripTitle(locale: Locale) {
    return locale === "id" ? "Belanja berdasarkan Kategori" : "Shop by Category";
}

// =============================================================================
// Bento Grid Default Items
// =============================================================================

export const bentoGridLabels = {
    en: {
        professionalSalon: "Professional Salon",
        styling: "Styling",
        treatment: "Treatment",
    },
    id: {
        professionalSalon: "Salon Profesional",
        styling: "Styling",
        treatment: "Treatment",
    },
} as const;

export function getBentoGridLabels(locale: Locale) {
    return bentoGridLabels[locale];
}

// =============================================================================
// Brand Portfolio
// =============================================================================

export const brands = [
    { name: "Wella Professionals", slug: "wella" },
    { name: "Londa Professional", slug: "londa" },
    { name: "Sebastian Professional", slug: "sebastian" },
    { name: "System Professional", slug: "sp" },
    { name: "Nioxin", slug: "nioxin" },
    { name: "GHD", slug: "ghd" },
] as const;

export const brandPortfolioContent = {
    en: {
        kicker: "Official Partners",
        title: "Trusted Professional Brands",
        footer: "And many more professional brands",
    },
    id: {
        kicker: "Partner Resmi",
        title: "Brand Professional Terpercaya",
        footer: "Dan lebih banyak brand professional lainnya",
    },
} as const;

export function getBrandPortfolioContent(locale: Locale) {
    return brandPortfolioContent[locale];
}

// =============================================================================
// CTA Section
// =============================================================================

export const ctaBenefits = {
    en: [
        "Direct distributor pricing",
        "Full access to premium brand catalog",
        "Free training & certification",
        "Professional sales team support",
    ],
    id: [
        "Harga distributor langsung",
        "Akses produk lengkap dari brand premium",
        "Pelatihan & sertifikasi gratis",
        "Dukungan tim sales profesional",
    ],
} as const;

export function getCtaBenefits(locale: Locale) {
    return ctaBenefits[locale];
}

export function getCtaKicker(locale: Locale) {
    return locale === "id" ? "Kemitraan" : "Partnership";
}

// =============================================================================
// Editorial Carousel Sections
// =============================================================================

export const editorialSections = {
    en: {
        products: {
            kicker: "PROFESSIONAL PRODUCTS",
            title: "Chosen for Professionals",
            description: "Curated products trusted by professional salons and barbershops across Indonesia.",
        },
    },
    id: {
        products: {
            kicker: "PRODUK PROFESIONAL",
            title: "Pilihan untuk Profesional",
            description: "Produk-produk pilihan yang dipercaya oleh salon dan barbershop profesional di Indonesia.",
        },
    },
} as const;

export function getEditorialSection(locale: Locale, section: "products") {
    return editorialSections[locale][section];
}

// =============================================================================
// Pillars Section
// =============================================================================

export const pillarsContent = {
    en: {
        kicker: "Our Services",
        title: "Complete Solutions for Your Salon Business",
        learnMore: "Learn more",
    },
    id: {
        kicker: "Layanan Kami",
        title: "Solusi Lengkap untuk Bisnis Salon Anda",
        learnMore: "Pelajari lebih lanjut",
    },
} as const;

export function getPillarsContent(locale: Locale) {
    return pillarsContent[locale];
}
