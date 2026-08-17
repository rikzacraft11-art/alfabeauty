/* ─────────────────────────────────────────────────────────────────────
 * Shared product data — used by Products Overview + Product Detail
 * Aligned with paket-a.md §3 Products + reference.md §4.4
 * ───────────────────────────────────────────────────────────────────── */

export type InfoSlide = {
    type: "description" | "features" | "benefits" | "application" | "technology" | "ingredients";
    src: string;
};

export type Product = {
    id: string;
    name: string;
    brand: string;
    category: string;
    audience: "salon" | "barber" | "both";
    description: string;
    variants?: string[];
    isNew?: boolean;
    /** Primary product photo — card thumbnail + detail hero */
    image?: string;
    /** Gallery images — additional photos for detail page */
    gallery?: string[];
    /** Info slide images — description/benefits/features slides from materi/ */
    infoSlides?: InfoSlide[];
    /** Branding/hero image for this product line */
    heroImage?: string;
    /* Detail-only fields */
    longDescription?: string;
    keyBenefits?: string[];
    howToUse?: string;
    recommendedFor?: string[];
    relatedIds?: string[];
};

/** Lean type for the catalog listing — excludes detail-only fields */
export type ProductListItem = Pick<
    Product,
    "id" | "name" | "brand" | "category" | "audience" | "description" | "image" | "variants" | "isNew"
>;

export const categories = [
    { id: "all", label: "All Products" },
    { id: "hair-colour", label: "Hair Colour" },
    { id: "hair-care", label: "Hair Care" },
    { id: "styling", label: "Styling" },
    { id: "treatments", label: "Treatments" },
    { id: "tools", label: "Tools & Equipment" },
    { id: "barber", label: "Barber Essentials" },
];

export const brandFilters = [
    "Alfaparf Milano Professional",
    "Farmavita",
    "Montibello",
    "Gamma+ Professional",
    "CORE",
];

export const audienceFilters = [
    { id: "salon", label: "Salon" },
    { id: "barber", label: "Barber" },
];

export const products: Product[] = [
    {
        id: "control-base",
        name: "CONTROL BASE",
        brand: "CORE",
        category: "hair-care",
        audience: "salon",
        description: "Botol putih di atas podium silinder (Hero Image).",
        image: "/images/products/core/CONTROL BASE/hero.webp",
        gallery: ["/images/products/core/CONTROL BASE/pendukung-1.webp", "/images/products/core/CONTROL BASE/pendukung-2.webp"],
        infoSlides: [
            
        ],
    },
    {
        id: "core-heat-perm",
        name: "CORE HEAT PERM",
        brand: "CORE",
        category: "hair-care",
        audience: "salon",
        description: "Dua kemasan kantong (HARD & SOFT) (Hero Image).",
        image: "/images/products/core/CORE HEAT PERM/hero.webp",
        gallery: ["/images/products/core/CORE HEAT PERM/pendukung-1.webp", "/images/products/core/CORE HEAT PERM/pendukung-2.webp"],
        infoSlides: [
            
        ],
    },
    {
        id: "alkali-remover",
        name: "ALKALI REMOVER",
        brand: "CORE",
        category: "hair-care",
        audience: "salon",
        description: "Satu kemasan kantong besar di tengah (Hero Image).",
        image: "/images/products/core/ALKALI REMOVER/hero.webp",
        gallery: ["/images/products/core/ALKALI REMOVER/pendukung-1.webp", "/images/products/core/ALKALI REMOVER/pendukung-2.webp"],
        infoSlides: [
            
        ],
    },
    {
        id: "gold-oil-essence-(amber)",
        name: "GOLD OIL ESSENCE (Amber)",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Botol kaca cairan amber (Hero Image).",
        image: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/hero.webp",
        gallery: ["/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-1.webp", "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-2.webp", "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-4.webp" },{ type: "features", src: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-5.webp" }
        ],
    },
    {
        id: "gold-oil-essence-(pink)",
        name: "GOLD OIL ESSENCE (Pink)",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Botol kaca cairan pink (Hero Image).",
        image: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/hero.webp",
        gallery: ["/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/pendukung-1.webp", "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/pendukung-2.webp", "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/pendukung-4.webp" }
        ],
    },
    {
        id: "xcell-clipper",
        name: "XCELL CLIPPER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "*Family shot* 4 warna clipper berdiri bersamaan.",
        image: "/images/products/gamma-plus/XCELL CLIPPER/hero.webp",
        gallery: ["/images/products/gamma-plus/XCELL CLIPPER/pendukung-1.webp", "/images/products/gamma-plus/XCELL CLIPPER/pendukung-2.webp", "/images/products/gamma-plus/XCELL CLIPPER/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/XCELL CLIPPER/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL CLIPPER/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL CLIPPER/pendukung-6.webp" }
        ],
    },
    {
        id: "shorty-clipper",
        name: "SHORTY CLIPPER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "*Family shot* 3 warna clipper pendek.",
        image: "/images/products/gamma-plus/SHORTY CLIPPER/hero.webp",
        gallery: ["/images/products/gamma-plus/SHORTY CLIPPER/pendukung-1.webp", "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-2.webp", "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-6.webp" },{ type: "features", src: "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-7.webp" },{ type: "features", src: "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-8.webp" },{ type: "features", src: "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-9.webp" }
        ],
    },
    {
        id: "boosted-up-clipper",
        name: "BOOSTED UP CLIPPER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Dua clipper (hitam dan merah/hijau).",
        image: "/images/products/gamma-plus/BOOSTED UP CLIPPER/hero.webp",
        gallery: ["/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-1.webp", "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-2.webp", "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-6.webp" }
        ],
    },
    {
        id: "xcell-trimmer",
        name: "XCELL TRIMMER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "*Family shot* 4 warna trimmer ramping berdiri di dudukan.",
        image: "/images/products/gamma-plus/XCELL TRIMMER/hero.webp",
        gallery: ["/images/products/gamma-plus/XCELL TRIMMER/pendukung-1.webp", "/images/products/gamma-plus/XCELL TRIMMER/pendukung-2.webp", "/images/products/gamma-plus/XCELL TRIMMER/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/XCELL TRIMMER/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL TRIMMER/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL TRIMMER/pendukung-6.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL TRIMMER/pendukung-7.webp" }
        ],
    },
    {
        id: "absolute-alpha-clipper",
        name: "ABSOLUTE ALPHA CLIPPER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Tiga warna clipper disusun bertumpuk miring.",
        image: "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/hero.webp",
        gallery: ["/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/pendukung-1.webp", "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/pendukung-2.webp", "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/pendukung-5.webp" }
        ],
    },
    {
        id: "boosted-trimmer",
        name: "BOOSTED TRIMMER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Tiga warna trimmer bertumpuk miring.",
        image: "/images/products/gamma-plus/BOOSTED TRIMMER/hero.webp",
        gallery: ["/images/products/gamma-plus/BOOSTED TRIMMER/pendukung-1.webp", "/images/products/gamma-plus/BOOSTED TRIMMER/pendukung-2.webp", "/images/products/gamma-plus/BOOSTED TRIMMER/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/BOOSTED TRIMMER/pendukung-4.webp" }
        ],
    },
    {
        id: "absolute-hitter-trimmer",
        name: "ABSOLUTE HITTER TRIMMER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Tiga trimmer tipis berdiri sejajar.",
        image: "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/hero.webp",
        gallery: ["/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/pendukung-1.webp", "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/pendukung-2.webp", "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/pendukung-5.webp" }
        ],
    },
    {
        id: "xcell-shaver",
        name: "XCELL SHAVER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "*Family shot* 4 shaver warna-warni.",
        image: "/images/products/gamma-plus/XCELL SHAVER/hero.webp",
        gallery: ["/images/products/gamma-plus/XCELL SHAVER/pendukung-1.webp", "/images/products/gamma-plus/XCELL SHAVER/pendukung-2.webp", "/images/products/gamma-plus/XCELL SHAVER/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/XCELL SHAVER/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL SHAVER/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL SHAVER/pendukung-6.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL SHAVER/pendukung-7.webp" }
        ],
    },
    {
        id: "boosted-shaver",
        name: "BOOSTED SHAVER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Shaver hitam dengan tutup dilepas.",
        image: "/images/products/gamma-plus/BOOSTED SHAVER/hero.webp",
        gallery: ["/images/products/gamma-plus/BOOSTED SHAVER/pendukung-1.webp", "/images/products/gamma-plus/BOOSTED SHAVER/pendukung-2.webp", "/images/products/gamma-plus/BOOSTED SHAVER/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/BOOSTED SHAVER/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/BOOSTED SHAVER/pendukung-5.webp" }
        ],
    },
    {
        id: "absolute-zero-shaver",
        name: "ABSOLUTE ZERO SHAVER",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Satu shaver ramping warna gelap.",
        image: "/images/products/gamma-plus/ABSOLUTE ZERO SHAVER/hero.webp",
        gallery: ["/images/products/gamma-plus/ABSOLUTE ZERO SHAVER/pendukung-1.webp", "/images/products/gamma-plus/ABSOLUTE ZERO SHAVER/pendukung-2.webp", "/images/products/gamma-plus/ABSOLUTE ZERO SHAVER/pendukung-3.webp"],
        infoSlides: [
            
        ],
    },
    {
        id: "x-horizon",
        name: "X-HORIZON",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Dua hair dryer menyilang (*Hero Image*).",
        image: "/images/products/gamma-plus/X-HORIZON/hero.webp",
        gallery: ["/images/products/gamma-plus/X-HORIZON/pendukung-1.webp", "/images/products/gamma-plus/X-HORIZON/pendukung-10.webp", "/images/products/gamma-plus/X-HORIZON/pendukung-11.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/X-HORIZON/pendukung-2.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HORIZON/pendukung-3.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HORIZON/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HORIZON/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HORIZON/pendukung-6.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HORIZON/pendukung-7.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HORIZON/pendukung-8.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HORIZON/pendukung-9.webp" }
        ],
    },
    {
        id: "xcell-s",
        name: "XCELL S",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Dua dryer rose gold saling menyilang terpasang corong.",
        image: "/images/products/gamma-plus/XCELL S/hero.webp",
        gallery: ["/images/products/gamma-plus/XCELL S/pendukung-1.webp", "/images/products/gamma-plus/XCELL S/pendukung-10.webp", "/images/products/gamma-plus/XCELL S/pendukung-2.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/XCELL S/pendukung-3.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL S/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL S/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL S/pendukung-6.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL S/pendukung-7.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL S/pendukung-8.webp" },{ type: "features", src: "/images/products/gamma-plus/XCELL S/pendukung-9.webp" }
        ],
    },
    {
        id: "x-hybrid-compact",
        name: "X-HYBRID COMPACT",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "*Family shot* tiga dryer berdesain kompak.",
        image: "/images/products/gamma-plus/X-HYBRID COMPACT/hero.webp",
        gallery: ["/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-1.webp", "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-10.webp", "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-11.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-2.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-3.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-6.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-7.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-8.webp" },{ type: "features", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-9.webp" }
        ],
    },
    {
        id: "i.e.s.-light",
        name: "I.E.S. LIGHT",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Dua dryer hijau konvensional.",
        image: "/images/products/gamma-plus/I.E.S. LIGHT/hero.webp",
        gallery: ["/images/products/gamma-plus/I.E.S. LIGHT/pendukung-1.webp", "/images/products/gamma-plus/I.E.S. LIGHT/pendukung-2.webp", "/images/products/gamma-plus/I.E.S. LIGHT/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/I.E.S. LIGHT/pendukung-4.webp" }
        ],
    },
    {
        id: "plasma",
        name: "PLASMA",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Satu dryer hitam pendek (profil samping).",
        image: "/images/products/gamma-plus/PLASMA/hero.webp",
        gallery: ["/images/products/gamma-plus/PLASMA/pendukung-1.webp", "/images/products/gamma-plus/PLASMA/pendukung-2.webp", "/images/products/gamma-plus/PLASMA/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/PLASMA/pendukung-4.webp" }
        ],
    },
    {
        id: "l'italiano",
        name: "L'ITALIANO",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Dua dryer klasik (oranye dan hitam).",
        image: "/images/products/gamma-plus/L'ITALIANO/hero.webp",
        gallery: ["/images/products/gamma-plus/L'ITALIANO/pendukung-1.webp", "/images/products/gamma-plus/L'ITALIANO/pendukung-2.webp", "/images/products/gamma-plus/L'ITALIANO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/L'ITALIANO/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/L'ITALIANO/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/L'ITALIANO/pendukung-6.webp" }
        ],
    },
    {
        id: "donna+-keratin",
        name: "DONNA+ KERATIN",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Alat pelurus rambut warna hitam/emas.",
        image: "/images/products/gamma-plus/DONNA+ KERATIN/hero.webp",
        gallery: ["/images/products/gamma-plus/DONNA+ KERATIN/pendukung-1.webp", "/images/products/gamma-plus/DONNA+ KERATIN/pendukung-2.webp", "/images/products/gamma-plus/DONNA+ KERATIN/pendukung-3.webp"],
        infoSlides: [
            
        ],
    },
    {
        id: "keratin-glory",
        name: "KERATIN GLORY",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "*Family shot* empat warna pelurus rambut menyilang.",
        image: "/images/products/gamma-plus/KERATIN GLORY/hero.webp",
        gallery: ["/images/products/gamma-plus/KERATIN GLORY/pendukung-1.webp", "/images/products/gamma-plus/KERATIN GLORY/pendukung-2.webp", "/images/products/gamma-plus/KERATIN GLORY/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/KERATIN GLORY/pendukung-4.webp" },{ type: "features", src: "/images/products/gamma-plus/KERATIN GLORY/pendukung-5.webp" },{ type: "features", src: "/images/products/gamma-plus/KERATIN GLORY/pendukung-6.webp" }
        ],
    },
    {
        id: "iron-bubble-rainbow",
        name: "IRON BUBBLE RAINBOW",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "barber",
        description: "Pengeriting dengan batang gelembung pelangi.",
        image: "/images/products/gamma-plus/IRON BUBBLE RAINBOW/hero.webp",
        gallery: ["/images/products/gamma-plus/IRON BUBBLE RAINBOW/pendukung-1.webp", "/images/products/gamma-plus/IRON BUBBLE RAINBOW/pendukung-2.webp", "/images/products/gamma-plus/IRON BUBBLE RAINBOW/pendukung-3.webp"],
        infoSlides: [
            
        ],
    },
    {
        id: "blonde-glow-shampoo",
        name: "BLONDE GLOW SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol dengan latar belakang *watermark* besar.",
        image: "/images/products/montibello-hop/BLONDE GLOW SHAMPOO/hero.webp",
        gallery: ["/images/products/montibello-hop/BLONDE GLOW SHAMPOO/pendukung-1.webp", "/images/products/montibello-hop/BLONDE GLOW SHAMPOO/pendukung-2.webp", "/images/products/montibello-hop/BLONDE GLOW SHAMPOO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/BLONDE GLOW SHAMPOO/pendukung-4.webp" }
        ],
    },
    {
        id: "blonde-glow-mask",
        name: "BLONDE GLOW MASK",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu kemasan *jar* bundar.",
        image: "/images/products/montibello-hop/BLONDE GLOW MASK/hero.webp",
        gallery: ["/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-1.webp", "/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-2.webp", "/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-4.webp" },{ type: "features", src: "/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-5.webp" }
        ],
    },
    {
        id: "colour-last-rinse",
        name: "COLOUR LAST RINSE",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol dengan latar belakang *watermark* 'hop'.",
        image: "/images/products/montibello-hop/COLOUR LAST RINSE/hero.webp",
        gallery: ["/images/products/montibello-hop/COLOUR LAST RINSE/pendukung-1.webp", "/images/products/montibello-hop/COLOUR LAST RINSE/pendukung-2.webp", "/images/products/montibello-hop/COLOUR LAST RINSE/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/COLOUR LAST RINSE/pendukung-4.webp" }
        ],
    },
    {
        id: "colour-last-mask",
        name: "COLOUR LAST MASK",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu kemasan *jar* bundar.",
        image: "/images/products/montibello-hop/COLOUR LAST MASK/hero.webp",
        gallery: ["/images/products/montibello-hop/COLOUR LAST MASK/pendukung-1.webp", "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-2.webp", "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-4.webp" },{ type: "features", src: "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-5.webp" }
        ],
    },
    {
        id: "colour-last-shampoo",
        name: "COLOUR LAST SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol warna pastel.",
        image: "/images/products/montibello-hop/COLOUR LAST SHAMPOO/hero.webp",
        gallery: ["/images/products/montibello-hop/COLOUR LAST SHAMPOO/pendukung-1.webp", "/images/products/montibello-hop/COLOUR LAST SHAMPOO/pendukung-2.webp", "/images/products/montibello-hop/COLOUR LAST SHAMPOO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/COLOUR LAST SHAMPOO/pendukung-4.webp" }
        ],
    },
    {
        id: "purifying-balance-shampoo",
        name: "PURIFYING BALANCE SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol abu-abu.",
        image: "/images/products/montibello-hop/PURIFYING BALANCE SHAMPOO/hero.webp",
        gallery: ["/images/products/montibello-hop/PURIFYING BALANCE SHAMPOO/pendukung-1.webp", "/images/products/montibello-hop/PURIFYING BALANCE SHAMPOO/pendukung-2.webp", "/images/products/montibello-hop/PURIFYING BALANCE SHAMPOO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/PURIFYING BALANCE SHAMPOO/pendukung-4.webp" }
        ],
    },
    {
        id: "purifying-balance-scalp-treatment",
        name: "PURIFYING BALANCE SCALP TREATMENT",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu kemasan *jar* abu-abu.",
        image: "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/hero.webp",
        gallery: ["/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/pendukung-1.webp", "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/pendukung-2.webp", "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/pendukung-4.webp" },{ type: "features", src: "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/pendukung-5.webp" }
        ],
    },
    {
        id: "smooth-hydration-rinse",
        name: "SMOOTH HYDRATION RINSE",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol putih pucat.",
        image: "/images/products/montibello-hop/SMOOTH HYDRATION RINSE/hero.webp",
        gallery: ["/images/products/montibello-hop/SMOOTH HYDRATION RINSE/pendukung-1.webp", "/images/products/montibello-hop/SMOOTH HYDRATION RINSE/pendukung-2.webp", "/images/products/montibello-hop/SMOOTH HYDRATION RINSE/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/SMOOTH HYDRATION RINSE/pendukung-4.webp" }
        ],
    },
    {
        id: "smooth-hydration-mask",
        name: "SMOOTH HYDRATION MASK",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu kemasan *jar* pucat.",
        image: "/images/products/montibello-hop/SMOOTH HYDRATION MASK/hero.webp",
        gallery: ["/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-1.webp", "/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-2.webp", "/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-4.webp" },{ type: "features", src: "/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-5.webp" }
        ],
    },
    {
        id: "smooth-hydration-shampoo",
        name: "SMOOTH HYDRATION SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol pucat.",
        image: "/images/products/montibello-hop/SMOOTH HYDRATION SHAMPOO/hero.webp",
        gallery: ["/images/products/montibello-hop/SMOOTH HYDRATION SHAMPOO/pendukung-1.webp", "/images/products/montibello-hop/SMOOTH HYDRATION SHAMPOO/pendukung-2.webp", "/images/products/montibello-hop/SMOOTH HYDRATION SHAMPOO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/SMOOTH HYDRATION SHAMPOO/pendukung-4.webp" }
        ],
    },
    {
        id: "full-volume-shampoo",
        name: "FULL VOLUME SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol krem.",
        image: "/images/products/montibello-hop/FULL VOLUME SHAMPOO/hero.webp",
        gallery: ["/images/products/montibello-hop/FULL VOLUME SHAMPOO/pendukung-1.webp", "/images/products/montibello-hop/FULL VOLUME SHAMPOO/pendukung-2.webp", "/images/products/montibello-hop/FULL VOLUME SHAMPOO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/FULL VOLUME SHAMPOO/pendukung-4.webp" }
        ],
    },
    {
        id: "full-volume-dry-shampoo",
        name: "FULL VOLUME DRY SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol jenis *spray* (semprot).",
        image: "/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/hero.webp",
        gallery: ["/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/pendukung-1.webp", "/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/pendukung-2.webp", "/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/pendukung-4.webp" }
        ],
    },
    {
        id: "full-volume-foam-rinse",
        name: "FULL VOLUME FOAM RINSE",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol *foam pump*.",
        image: "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/hero.webp",
        gallery: ["/images/products/montibello-hop/FULL VOLUME FOAM RINSE/pendukung-1.webp", "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/pendukung-2.webp", "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/pendukung-4.webp" },{ type: "features", src: "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/pendukung-5.webp" }
        ],
    },
    {
        id: "ultra-repair-rinse",
        name: "ULTRA REPAIR RINSE",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol coklat susu muda.",
        image: "/images/products/montibello-hop/ULTRA REPAIR RINSE/hero.webp",
        gallery: ["/images/products/montibello-hop/ULTRA REPAIR RINSE/pendukung-1.webp", "/images/products/montibello-hop/ULTRA REPAIR RINSE/pendukung-2.webp", "/images/products/montibello-hop/ULTRA REPAIR RINSE/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/ULTRA REPAIR RINSE/pendukung-4.webp" }
        ],
    },
    {
        id: "ultra-repair-mask",
        name: "ULTRA REPAIR MASK",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu kemasan *jar* coklat susu muda.",
        image: "/images/products/montibello-hop/ULTRA REPAIR MASK/hero.webp",
        gallery: ["/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-1.webp", "/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-2.webp", "/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-4.webp" },{ type: "features", src: "/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-5.webp" }
        ],
    },
    {
        id: "ultra-repair-shampoo",
        name: "ULTRA REPAIR SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol coklat susu muda.",
        image: "/images/products/montibello-hop/ULTRA REPAIR SHAMPOO/hero.webp",
        gallery: ["/images/products/montibello-hop/ULTRA REPAIR SHAMPOO/pendukung-1.webp", "/images/products/montibello-hop/ULTRA REPAIR SHAMPOO/pendukung-2.webp", "/images/products/montibello-hop/ULTRA REPAIR SHAMPOO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/ULTRA REPAIR SHAMPOO/pendukung-4.webp" }
        ],
    },
    {
        id: "ultra-repair-sealed-ends",
        name: "ULTRA REPAIR SEALED ENDS",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu kemasan *tube* memanjang.",
        image: "/images/products/montibello-hop/ULTRA REPAIR SEALED ENDS/hero.webp",
        gallery: ["/images/products/montibello-hop/ULTRA REPAIR SEALED ENDS/pendukung-1.webp", "/images/products/montibello-hop/ULTRA REPAIR SEALED ENDS/pendukung-2.webp", "/images/products/montibello-hop/ULTRA REPAIR SEALED ENDS/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/ULTRA REPAIR SEALED ENDS/pendukung-4.webp" }
        ],
    },
    {
        id: "detox-cleansing-shampoo",
        name: "DETOX CLEANSING SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol abu-abu tua.",
        image: "/images/products/montibello-hop/DETOX CLEANSING SHAMPOO/hero.webp",
        gallery: ["/images/products/montibello-hop/DETOX CLEANSING SHAMPOO/pendukung-1.webp", "/images/products/montibello-hop/DETOX CLEANSING SHAMPOO/pendukung-2.webp", "/images/products/montibello-hop/DETOX CLEANSING SHAMPOO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/DETOX CLEANSING SHAMPOO/pendukung-4.webp" }
        ],
    },
    {
        id: "scalp-detox-cleansing-treatment",
        name: "SCALP DETOX CLEANSING TREATMENT",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu kemasan *jar* abu-abu tua.",
        image: "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/hero.webp",
        gallery: ["/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/pendukung-1.webp", "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/pendukung-2.webp", "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/pendukung-4.webp" },{ type: "features", src: "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/pendukung-5.webp" }
        ],
    },
    {
        id: "silver-white-rinse",
        name: "SILVER WHITE RINSE",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol abu-abu kebiruan.",
        image: "/images/products/montibello-hop/SILVER WHITE RINSE/hero.webp",
        gallery: ["/images/products/montibello-hop/SILVER WHITE RINSE/pendukung-1.webp", "/images/products/montibello-hop/SILVER WHITE RINSE/pendukung-2.webp", "/images/products/montibello-hop/SILVER WHITE RINSE/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/SILVER WHITE RINSE/pendukung-4.webp" }
        ],
    },
    {
        id: "silver-white-shampoo",
        name: "SILVER WHITE SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Satu botol abu-abu kebiruan.",
        image: "/images/products/montibello-hop/SILVER WHITE SHAMPOO/hero.webp",
        gallery: ["/images/products/montibello-hop/SILVER WHITE SHAMPOO/pendukung-1.webp", "/images/products/montibello-hop/SILVER WHITE SHAMPOO/pendukung-2.webp", "/images/products/montibello-hop/SILVER WHITE SHAMPOO/pendukung-3.webp"],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/SILVER WHITE SHAMPOO/pendukung-4.webp" }
        ],
    },
    {
        id: "semi-di-lino-sublime-cristalli",
        name: "SEMI DI LINO CRISTALLI LIQUIDI",
        brand: "Alfaparf Milano Professional",
        category: "treatments",
        audience: "salon",
        description: "Serum kilau legendaris dari Italia untuk melindungi serat rambut dan memberikan kilau instan tanpa rasa berat.",
        image: "/images/ui/product-placeholder-alfaparf.svg",
        gallery: ["/images/ui/product-placeholder-alfaparf.svg"],
        infoSlides: [],
        longDescription: "Serum kilau legendaris dari Italia yang diformulasikan dengan Flaxseed Oil dan Vitamin E untuk melindungi serat rambut dari kelembaban eksternal serta memberikan kilau instan tanpa rasa berat.",
        keyBenefits: [
            "Perlindungan termal dan anti-kelembaban eksternal",
            "Kilau instan tahan lama dengan formula ringan",
            "Cocok untuk semua jenis dan tekstur rambut"
        ],
        howToUse: "Aplikasikan beberapa tetes pada rambut basah atau kering sebelum atau sesudah proses styling.",
        recommendedFor: ["Salon finishing treatment", "Daily luxury haircare"]
    },
    {
        id: "evolution-of-the-color-cube",
        name: "EVOLUTION OF THE COLOR³",
        brand: "Alfaparf Milano Professional",
        category: "hair-colour",
        audience: "salon",
        description: "Sistem pewarnaan permanen profesional dengan teknologi 3D Cube dan Hyaluronic Acid untuk hasil warna presisi dan tahan lama.",
        image: "/images/ui/product-placeholder-alfaparf.svg",
        gallery: ["/images/ui/product-placeholder-alfaparf.svg"],
        infoSlides: [],
        longDescription: "Pewarna rambut permanen profesional dengan formula mikro-pigmen terkristalisasi dan Hyaluronic Acid, memastikan cakupan 100% rambut beruban dengan kilau dan kelembutan maksimal.",
        keyBenefits: [
            "100% grey hair coverage dengan kelembutan luar biasa",
            "Teknologi 3D Cube untuk retensi warna tahan lama",
            "Kandungan amonia rendah untuk kenyamanan kulit kepala"
        ],
        howToUse: "Campurkan dengan Oxid'o developer perbandingan 1:1.5 sesuai teknik pewarnaan profesional.",
        recommendedFor: ["Professional Salon Colouring", "Creative Colourists"]
    },
    {
        id: "lisse-design-keratin-therapy",
        name: "LISSE DESIGN KERATIN THERAPY",
        brand: "Alfaparf Milano Professional",
        category: "treatments",
        audience: "salon",
        description: "Perawatan pelurusan keratin progresif bebas formaldehida yang menghaluskan rambut ikal hingga 3 bulan.",
        image: "/images/ui/product-placeholder-alfaparf.svg",
        gallery: ["/images/ui/product-placeholder-alfaparf.svg"],
        infoSlides: [],
        longDescription: "Perawatan pelurusan keratin progresif bebas formaldehida yang menghaluskan rambut ikal, menghilangkan frizzy, dan memberikan hasil rambut lurus alami tahan lama.",
        keyBenefits: [
            "100% bebas formaldehida dan aman untuk teknisi salon",
            "Hasil rambut halus, lurus, dan mudah diatur hingga 3 bulan",
            "Diperkaya Kera-Collagen Complex dan Babassu Oil"
        ],
        howToUse: "Gunakan protokol 4-langkah salon treatment sesuai petunjuk teknis Alfa Beauty Academy.",
        recommendedFor: ["Professional Keratin Smoothing", "Anti-Frizz Treatment"]
    },
    {
        id: "farmavita-life-color-plus",
        name: "LIFE COLOR PLUS PROFESSIONAL",
        brand: "Farmavita",
        category: "hair-colour",
        audience: "salon",
        description: "Pewarna rambut permanen Italia yang diperkaya ekstrak bunga matahari dan oligopeptida Brazil Nut.",
        image: "/images/ui/product-placeholder-farmavita.svg",
        gallery: ["/images/ui/product-placeholder-farmavita.svg"],
        infoSlides: [],
        longDescription: "Pewarna rambut permanen Italia yang diformulasikan dengan ekstrak bunga matahari dan oligopeptida Brazil Nut untuk penetrasi pigmen yang mendalam dan perlindungan kutikula.",
        keyBenefits: [
            "Penetrasi warna mendalam dengan nutrisi Brazil Nut",
            "Menjaga kelembapan alami dan elastisitas rambut",
            "Aroma harum dan nyaman saat proses aplikasi di salon"
        ],
        howToUse: "Campurkan dengan Life Cream Developer dengan perbandingan 1:1.5.",
        recommendedFor: ["Salon Colour Services", "Grey Coverage"]
    },
    {
        id: "farmavita-omniplex-system",
        name: "OMNIPLEX MOLECULAR BOND REPAIR",
        brand: "Farmavita",
        category: "treatments",
        audience: "salon",
        description: "Sistem rekonstruksi ikatan disulfida rambut molekuler untuk mencegah kerusakan kimia selama bleaching dan pewarnaan.",
        image: "/images/ui/product-placeholder-farmavita.svg",
        gallery: ["/images/ui/product-placeholder-farmavita.svg"],
        infoSlides: [],
        longDescription: "Sistem rekonstruksi ikatan disulfida rambut molekuler yang dirancang untuk mencegah kerusakan kimia selama proses bleaching, pewarnaan, atau perming di salon profesional.",
        keyBenefits: [
            "Melindungi ikatan keratin selama proses kimia agresif",
            "Memperbaiki rambut rusak secara struktural",
            "Meningkatkan elastisitas dan kekuatan batang rambut"
        ],
        howToUse: "Campurkan Omniplex N.1 ke dalam adonan bleaching/pewarna, lanjutkan dengan Omniplex N.2 setelah pembilasan.",
        recommendedFor: ["Bleaching & Lightening Services", "Deep Bond Reconstruction"]
    },
];

/* ── Helper functions ── */

export function getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
}

export function getAllProductIds(): string[] {
    return products.map((p) => p.id);
}
