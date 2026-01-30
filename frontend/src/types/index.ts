export type Audience = "SALON" | "BARBER";

export type Product = {
    slug: string;
    name: string;
    brand: string;
    audience: Audience[];
    functions: string[];
    /**
     * High-level catalog grouping used by the homepage "Shop by Category" strip.
     * Examples: "shampoo", "styling", "color", "treatment".
     */
    categories?: ("shampoo" | "styling" | "treatment" | "color" | "grooming")[];
    summary: string;
    benefits: string[];
    howToUse: string;
    image?: {
        url: string;
        alt: string;
        caption?: string;
    };
};

export type LeadRecord = {
    name: string;
    phone: string;
    email: string;
    message: string;
    ip_address: string;
    page_url_current: string;
    page_url_initial: string;
    raw: unknown;
};

export type EducationEvent = {
    slug: string;
    title: string;
    brand: string;
    excerpt: string;
    date: string; // yyyy-MM-dd
    city: string;
    type: string;
    audience: string[];
    cta_label: string;
    body: string[];
};

export type EducationArticle = {
    slug: string;
    title: string;
    excerpt: string;
    date: string; // yyyy-MM-dd
    body: string[];
};
