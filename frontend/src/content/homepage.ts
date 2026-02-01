/**
 * Homepage Content Configuration
 * 
 * Centralized i18n content for homepage components.
 * Loads from JSON (CMS Layer) and validates via Zod (Governance Layer).
 */

import { homepageSchema, type HomepageData } from "./schemas/homepage.schema";
import homepageJson from "./data/homepage.json";
import type { Locale } from "@/lib/i18n";

// 1. Validation Layer (Build-Time Guard)
const parsedContent = homepageSchema.safeParse(homepageJson);

if (!parsedContent.success) {
    console.error("FATAL: Homepage Content Validation Failed", parsedContent.error.format());
    throw new Error("Homepage content validation failed. Check src/content/data/homepage.json");
}

const content: HomepageData = parsedContent.data;

// =============================================================================
// Accessors (Preserving Original API for Zero-Refactor in Components)
// =============================================================================

export function getHeroContent(locale: Locale) {
    return content.hero[locale];
}

export const categories = content.categories;

export const defaultExploreBanner = "/images/categories/banner-default.png";

export function getCategoryLabel(locale: Locale, key: string): string {
    const labels = content.categoryLabels[locale] as Record<string, string>;
    return labels[key] ?? key;
}

export function getCategoryDescription(locale: Locale, key: string) {
    const descs = content.categoryDescriptions[locale];
    return descs[key] || "";
}

export function getCategoryStripTitle(locale: Locale) {
    return locale === "id" ? "Telusuri Kategori" : "Explore by Category";
}

export const brands = content.brands;

export function getBrandPortfolioContent(locale: Locale) {
    return content.brandPortfolio[locale];
}

export function getEditorialSection(locale: Locale, section: "products" | "education") {
    return content.editorial[locale][section];
}

export function getStatsContent(locale: Locale) {
    return content.stats[locale];
}

export function getCookieConsentContent(locale: Locale) {
    return content.cookieConsent[locale];
}
