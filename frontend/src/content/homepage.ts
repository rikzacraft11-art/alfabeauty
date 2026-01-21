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
        kicker: "BEHIND EVERY SUCCESSFUL SALON",
        headline: "There's the Right Partner.",
        description: "Premium products, technique education, business support. Alongside 500+ professional salons across Indonesia.",
        ctaPrimary: "Explore Our Brands",
        ctaSecondary: "Join 500+ Salons",
        note: "Consultation is free. We respond within 1 business hour.",
    },
    id: {
        kicker: "DI BALIK SETIAP SALON SUKSES",
        headline: "Ada Partner yang Tepat.",
        description: "Produk premium, edukasi teknik, dukungan bisnis. Bersama 500+ salon profesional di seluruh Indonesia.",
        ctaPrimary: "Jelajahi Brand Kami",
        ctaSecondary: "Bergabung dengan 500+ Salon",
        note: "Konsultasi gratis. Respon dalam 1 jam kerja.",
    },
} as const;

export function getHeroContent(locale: Locale) {
    return heroContent[locale];
}

// =============================================================================
// Category Strip
// =============================================================================

export const categories = [
    {
        key: "shampoo",
        image: "/images/categories/shampoo.jpg",
        exploreBanner: "/images/categories/banner-haircare.png",
        audience: ["salon", "barber"] as const,
        productCount: 45,
    },
    {
        key: "styling",
        image: "/images/categories/styling.jpg",
        exploreBanner: "/images/categories/banner-styling.png",
        audience: ["barber", "salon"] as const,
        productCount: 62,
    },
    {
        key: "color",
        image: "/images/categories/color.jpg",
        exploreBanner: "/images/categories/banner-color.png",
        audience: ["salon"] as const,
        productCount: 120,
    },
    {
        key: "treatment",
        image: "/images/categories/treatment.jpg",
        exploreBanner: "/images/categories/banner-treatment.png",
        audience: ["salon"] as const,
        productCount: 38,
    },
    {
        key: "tools",
        image: "/images/categories/styling.jpg",
        exploreBanner: "/images/categories/banner-tools.png",
        audience: ["salon", "barber"] as const,
        productCount: 85,
    },
    {
        key: "accessories",
        image: "/images/categories/treatment.jpg",
        exploreBanner: "/images/categories/banner-accessories.png",
        audience: ["salon", "barber"] as const,
        productCount: 56,
    },
] as const;

// Default explore banner (all categories)
export const defaultExploreBanner = "/images/categories/banner-default.png";

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

// Professional context descriptions for each category
export const categoryDescriptions = {
    en: {
        shampoo: "Shampoos, conditioners & masks",
        styling: "Pomades, gels, sprays & waxes",
        color: "Dyes, developers & bleach",
        treatment: "Keratin, rebonding & scalp care",
        tools: "Scissors, clippers & dryers",
        accessories: "Capes, brushes & consumables",
    },
    id: {
        shampoo: "Sampo, kondisioner & masker",
        styling: "Pomade, gel, spray & wax",
        color: "Cat, developer & bleaching",
        treatment: "Keratin, rebonding & perawatan kulit kepala",
        tools: "Gunting, clipper & hairdryer",
        accessories: "Cape, sisir & perlengkapan",
    },
} as const;

export function getCategoryLabel(locale: Locale, key: string) {
    return categoryLabels[locale][key as keyof typeof categoryLabels.en] || key;
}

export function getCategoryDescription(locale: Locale, key: string) {
    return categoryDescriptions[locale][key as keyof typeof categoryDescriptions.en] || "";
}

export function getCategoryStripTitle(locale: Locale) {
    return locale === "id" ? "Telusuri Kategori" : "Explore by Category";
}


// =============================================================================
// Brand Portfolio
// =============================================================================

export const brands = [
    {
        name: "Wella Professionals",
        slug: "wella",
        logo: "https://cdn.brandfetch.io/idYzSdxkqm/theme/dark/logo.svg?c=id8O3izR8fNP8xWH9Bb",
    },
    {
        name: "Londa Professional",
        slug: "londa",
        logo: "https://cdn.brandfetch.io/idpn2xefaD/theme/dark/logo.svg?c=id8O3izR8fNP8xWH9Bb",
    },
    {
        name: "Sebastian Professional",
        slug: "sebastian",
        logo: "https://cdn.brandfetch.io/idgXVBc3KT/theme/dark/logo.svg?c=id8O3izR8fNP8xWH9Bb",
    },
    {
        name: "System Professional",
        slug: "sp",
        logo: "https://cdn.brandfetch.io/idM6RvdnzP/theme/dark/logo.svg?c=id8O3izR8fNP8xWH9Bb",
    },
    {
        name: "Nioxin",
        slug: "nioxin",
        logo: "https://cdn.brandfetch.io/idqzY3nh4S/theme/dark/logo.svg?c=id8O3izR8fNP8xWH9Bb",
    },
    {
        name: "GHD",
        slug: "ghd",
        logo: "https://cdn.brandfetch.io/idNK4fVHu8/theme/dark/logo.svg?c=id8O3izR8fNP8xWH9Bb",
    },
] as const;

export const brandPortfolioContent = {
    en: {
        kicker: "TRUSTED BRAND PARTNERS",
        title: "Curated for Professional Excellence",
        subtitle: "Global brands with proven salon results, selected for Indonesian professionals.",
        footer: "25+ premium brands trusted by 500+ salon partners nationwide",
    },
    id: {
        kicker: "BRAND PARTNER TERPERCAYA",
        title: "Dikurasi untuk Keunggulan Profesional",
        subtitle: "Brand global dengan hasil salon terbukti, dipilih untuk profesional Indonesia.",
        footer: "25+ brand premium dipercaya 500+ salon partner di seluruh Indonesia",
    },
} as const;

export function getBrandPortfolioContent(locale: Locale) {
    return brandPortfolioContent[locale];
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
            badge: "",
        },
        education: {
            kicker: "BUILD YOUR COMPETITIVE EDGE",
            title: "Training That Creates Loyalty",
            description: "Master brand techniques with certified training. Trained stylists see 40% higher client retention and reduced switching costs.",
            badge: "Free for Partners",
        },
    },
    id: {
        products: {
            kicker: "PRODUK PROFESIONAL",
            title: "Pilihan untuk Profesional",
            description: "Produk-produk pilihan yang dipercaya oleh salon dan barbershop profesional di Indonesia.",
            badge: "",
        },
        education: {
            kicker: "BANGUN KEUNGGULAN KOMPETITIF",
            title: "Pelatihan yang Menciptakan Loyalitas",
            description: "Kuasai teknik brand dengan pelatihan bersertifikat. Stylist terlatih memiliki retensi klien 40% lebih tinggi dan biaya switching berkurang.",
            badge: "Gratis untuk Partner",
        },
    },
} as const;

export function getEditorialSection(locale: Locale, section: "products" | "education") {
    return editorialSections[locale][section];
}

// =============================================================================
// Stats Section (Enterprise credibility)
// =============================================================================

export const statsContent = {
    en: {
        kicker: "TRUSTED NATIONWIDE",
        stats: [
            { value: "500+", label: "Partner Salons" },
            { value: "15+", label: "Premium Brands" },
            { value: "34", label: "Provinces Covered" },
            { value: "10+", label: "Years Experience" },
        ],
    },
    id: {
        kicker: "DIPERCAYA NASIONAL",
        stats: [
            { value: "500+", label: "Salon Partner" },
            { value: "15+", label: "Brand Premium" },
            { value: "34", label: "Provinsi Terjangkau" },
            { value: "10+", label: "Tahun Pengalaman" },
        ],
    },
} as const;

export function getStatsContent(locale: Locale) {
    return statsContent[locale];
}

// =============================================================================
// Cookie Consent
// =============================================================================

export const cookieConsentContent = {
    en: {
        message: "We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.",
        accept: "Accept",
        decline: "Decline",
        learnMore: "Learn more",
        privacyLink: "/privacy",
    },
    id: {
        message: "Kami menggunakan cookie untuk meningkatkan pengalaman Anda. Dengan melanjutkan mengunjungi situs ini, Anda menyetujui penggunaan cookie kami.",
        accept: "Terima",
        decline: "Tolak",
        learnMore: "Pelajari lebih lanjut",
        privacyLink: "/privacy",
    },
} as const;

export function getCookieConsentContent(locale: Locale) {
    return cookieConsentContent[locale];
}
