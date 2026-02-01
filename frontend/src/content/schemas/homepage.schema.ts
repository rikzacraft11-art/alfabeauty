import { z } from "zod";

export const localeSchema = z.object({
    en: z.string(),
    id: z.string(),
});

export const heroContentSchema = z.object({
    en: z.object({
        kicker: z.string(),
        headline: z.string(),
        description: z.string(),
        ctaPrimary: z.string(),
        ctaSecondary: z.string(),
        note: z.string(),
    }),
    id: z.object({
        kicker: z.string(),
        headline: z.string(),
        description: z.string(),
        ctaPrimary: z.string(),
        ctaSecondary: z.string(),
        note: z.string(),
    }),
});

export const categorySchema = z.object({
    key: z.string(),
    image: z.string(),
    exploreBanner: z.string(),
    audience: z.array(z.enum(["salon", "barber"])),
    productCount: z.number(),
});

export const homepageSchema = z.object({
    hero: heroContentSchema,
    categories: z.array(categorySchema),
    categoryLabels: localeSchema.extend({ en: z.record(z.string(), z.string()), id: z.record(z.string(), z.string()) }), // Simplified for now
    categoryDescriptions: localeSchema.extend({ en: z.record(z.string(), z.string()), id: z.record(z.string(), z.string()) }),
    brands: z.array(z.object({
        name: z.string(),
        slug: z.string(),
        logo: z.string(),
    })),
    brandPortfolio: z.object({
        en: z.object({ kicker: z.string(), title: z.string(), subtitle: z.string(), footer: z.string() }),
        id: z.object({ kicker: z.string(), title: z.string(), subtitle: z.string(), footer: z.string() }),
    }),
    editorial: z.object({
        en: z.object({
            products: z.object({ kicker: z.string(), title: z.string(), description: z.string(), badge: z.string() }),
            education: z.object({ kicker: z.string(), title: z.string(), description: z.string(), badge: z.string() }),
        }),
        id: z.object({
            products: z.object({ kicker: z.string(), title: z.string(), description: z.string(), badge: z.string() }),
            education: z.object({ kicker: z.string(), title: z.string(), description: z.string(), badge: z.string() }),
        }),
    }),
    stats: z.object({
        en: z.object({ kicker: z.string(), stats: z.array(z.object({ value: z.string(), label: z.string() })) }),
        id: z.object({ kicker: z.string(), stats: z.array(z.object({ value: z.string(), label: z.string() })) }),
    }),
    cookieConsent: z.object({
        en: z.object({ message: z.string(), accept: z.string(), decline: z.string(), learnMore: z.string(), privacyLink: z.string() }),
        id: z.object({ message: z.string(), accept: z.string(), decline: z.string(), learnMore: z.string(), privacyLink: z.string() }),
    })
});

export type HomepageData = z.infer<typeof homepageSchema>;
