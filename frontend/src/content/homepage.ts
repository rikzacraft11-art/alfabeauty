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

export function getCategoryLabel(locale: Locale, key: string): string {
    const labels = content.categoryLabels[locale] as Record<string, string>;
    return labels[key] ?? key;
}
