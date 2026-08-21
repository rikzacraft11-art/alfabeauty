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
    /** Immutable binding to the future commerce system; never a display price or SKU. */
    commerceProductId?: string;
    name: string;
    brand: string;
    category: string;
    audience: "salon" | "barber" | "both";
    description: string;
    variants?: string[];
    /** Immutable commerce bindings paired with CMS display labels. */
    commerceVariants?: { id: string; label: string }[];
    isNew?: boolean;
    /** Primary product photo — card thumbnail + detail hero */
    image?: string;
    /** Gallery images — additional photos for detail page */
    gallery?: string[];
    /** Info slide images — description/benefits/features slides */
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
> & {
    startingPriceIdr?: number;
    purchasable?: boolean;
};

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
    /* ═════════════════════════════════════════════════════════════════════
     * 1. CORE (JAPANESE CHEMICAL ENGINEERING & DIGITAL PERM)
     * ═════════════════════════════════════════════════════════════════════ */
    {
        id: "control-base",
        name: "CONTROL BASE",
        brand: "CORE",
        category: "treatments",
        audience: "salon",
        description: "Pre-treatment chemical equalizer and CMC lipid barrier shield for sensitized hair prior to digital perming or coloring.",
        longDescription: "CORE Control Base is an advanced Japanese pre-chemical formulation engineered to equalize hair porosity and reinforce the Cell Membrane Complex (CMC). Applied before digital perms, straightening, or bleaching, it prevents over-processing on sensitized zones while allowing chemical agents to penetrate evenly.",
        keyBenefits: [
            "Protects sensitized and pre-lightened hair zones from chemical burn",
            "Restores the intercellular CMC lipid barrier for even wave formation",
            "Prevents cysteamine/thioglycolate over-softening during perm processing",
            "Improves final hair elasticity, softness, and curl retention"
        ],
        howToUse: "Apply evenly to towel-dried hair focusing on porous mid-lengths and ends before applying perm lotion or lightening compounds. Comb through gently. Do not rinse; proceed directly with chemical application.",
        recommendedFor: [
            "Porous, damaged, or bleached hair before digital perms",
            "Multi-textured or sensitized salon clientele",
            "Pre-treatment prior to intense chemical restructuring"
        ],
        variants: ["500ml"],
        image: "/images/products/core/CONTROL BASE/hero.webp",
        gallery: [
            "/images/products/core/CONTROL BASE/pendukung-1.webp",
            "/images/products/core/CONTROL BASE/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "technology", src: "/images/products/core/CONTROL BASE/pendukung-1.webp" },
            { type: "features", src: "/images/products/core/CONTROL BASE/pendukung-2.webp" }
        ]
    },
    {
        id: "core-heat-perm",
        name: "CORE HEAT PERM",
        brand: "CORE",
        category: "treatments",
        audience: "salon",
        description: "Japanese digital heat perm system with cysteamine reducing agents for resilient, bouncy, zero-frizz curls.",
        longDescription: "Formulated in Japan, CORE Heat Perm is a dual-strength digital perming system (HARD for resistant virgin hair, SOFT for sensitized/colored hair). Utilizes low-alkaline cysteamine chemistry that gently rearranges disulfide bonds under digital heat rods without compromising hair cuticle integrity.",
        keyBenefits: [
            "Delivers high-definition, bouncy curls with natural movement",
            "Gentle cysteamine chemistry preserves hair protein integrity",
            "Dual-formulation (HARD / SOFT) for tailored chemical intensity",
            "Zero residual chemical odor and long-lasting curl memory"
        ],
        howToUse: "1. Diagnose hair texture and select HARD or SOFT formula. 2. Apply perm lotion onto sectioned hair and process for 10-25 minutes. 3. Rinse thoroughly with warm water. 4. Wind hair around digital heat rods and connect to machine (80°C-120°C). 5. Apply neutralizer for 7-10 minutes, then rinse completely.",
        recommendedFor: [
            "Japanese digital perm and thermal reconditioning",
            "Salon clients desiring soft air-wave or Korean S-curl styles",
            "Chemically treated and sensitive hair requiring gentle perming"
        ],
        variants: ["HARD 400ml", "SOFT 400ml"],
        image: "/images/products/core/CORE HEAT PERM/hero.webp",
        gallery: [
            "/images/products/core/CORE HEAT PERM/pendukung-1.webp",
            "/images/products/core/CORE HEAT PERM/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "application", src: "/images/products/core/CORE HEAT PERM/pendukung-1.webp" },
            { type: "benefits", src: "/images/products/core/CORE HEAT PERM/pendukung-2.webp" }
        ]
    },
    {
        id: "alkali-remover",
        name: "ALKALI REMOVER",
        brand: "CORE",
        category: "treatments",
        audience: "salon",
        description: "Post-chemical acidifying neutralizer (pH 4.5) that deactivates residual alkali and locks sulfur bonds.",
        longDescription: "CORE Alkali Remover is an essential post-chemical buffer specifically designed to neutralize trapped alkaline residues after perming, straightening, or bleaching. At an optimal acidic pH of 4.5, it halts hidden oxidation, closes the cuticle scales, and neutralizes persistent chemical odors.",
        keyBenefits: [
            "Instantly halts latent chemical oxidation after perms and colors",
            "Restores hair and scalp to natural physiological pH (4.5 - 5.5)",
            "Tightens cuticle scales to lock in moisture and color pigments",
            "Completely eliminates lingering chemical odors from salon services"
        ],
        howToUse: "Immediately after rinsing neutralizer or hair color, apply 20-30ml of Alkali Remover thoroughly across hair and scalp. Massage gently for 3-5 minutes to ensure total chemical deactivation. Rinse thoroughly with water.",
        recommendedFor: [
            "Mandatory post-digital perm and chemical straightening neutralization",
            "Post-bleach and high-lift coloring treatments",
            "Salons aiming for zero-damage chemical services"
        ],
        variants: ["1000ml"],
        image: "/images/products/core/ALKALI REMOVER/hero.webp",
        gallery: [
            "/images/products/core/ALKALI REMOVER/pendukung-1.webp",
            "/images/products/core/ALKALI REMOVER/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "technology", src: "/images/products/core/ALKALI REMOVER/pendukung-1.webp" },
            { type: "application", src: "/images/products/core/ALKALI REMOVER/pendukung-2.webp" }
        ]
    },

    /* ═════════════════════════════════════════════════════════════════════
     * 2. MONTIBELLO — GOLD OIL ESSENCE (MEDITERRANEAN NOURISHMENT)
     * ═════════════════════════════════════════════════════════════════════ */
    {
        id: "gold-oil-essence-(amber)",
        name: "GOLD OIL ESSENCE (Amber)",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Prestige Mediterranean restorative elixir infused with organic Argan Oil and Cyperus (Tiger Nut) Oil.",
        longDescription: "Montibello Gold Oil Essence (Amber) is an iconic Mediterranean beauty ritual formulated with fair-trade organic Argan Oil and Cyperus Oil. Rich in Omega-6, Omega-9, and Vitamin E, it deeply replenishes lipid reserves in parched hair fiber, providing instant luminous golden shine without greasiness.",
        keyBenefits: [
            "Instant luminous golden shine and velvet touch",
            "Replenishes essential lipids to repair dry, brittle strands",
            "Tames stubborn frizz and seals porous split ends",
            "Ultra-fast absorption with zero heavy residue"
        ],
        howToUse: "Dispense 2-3 drops into palms. Apply evenly through mid-lengths and ends on damp hair before blow-drying for thermal protection, or on dry hair for instant polish and anti-frizz shine.",
        recommendedFor: [
            "Dry, dull, coarse, and highly porous hair",
            "Daily salon finishing ritual and luxury blowout services",
            "Restoring radiant lipid balance"
        ],
        variants: ["50ml", "130ml"],
        image: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/hero.webp",
        gallery: [
            "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-1.webp",
            "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-2.webp",
            "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-4.webp" },
            { type: "ingredients", src: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-5.webp" }
        ]
    },
    {
        id: "gold-oil-essence-(pink)",
        name: "GOLD OIL ESSENCE (Pink)",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Feather-light protecting hair elixir infused with Rose Petal and Tsubaki (Camellia) essential oils.",
        longDescription: "Crafted specifically for fine, sensitized, and color-treated hair, Gold Oil Essence (Pink) combines precious Tsubaki (Japanese Camellia) oil with Mediterranean Rose Petal extracts. Delivers weightless anti-oxidant defense, thermal shield against hot styling tools, and luminous multidimensional shine.",
        keyBenefits: [
            "Weightless formulation that never flattens fine hair",
            "Thermal protection shield against flat irons and blow dryers",
            "Anti-free-radical protection preserving hair color brilliance",
            "Delicate luxury floral scent and silky touch"
        ],
        howToUse: "Pump 1-2 drops onto fingertips. Distribute evenly through towel-dried or dry hair before heat styling. Can be layered throughout the day for touch-up radiance.",
        recommendedFor: [
            "Fine, delicate, bleached, and sensitized hair",
            "Heat styling protection before straightening or curling",
            "Lightweight daily shine enhancement"
        ],
        variants: ["50ml", "130ml"],
        image: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/hero.webp",
        gallery: [
            "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/pendukung-1.webp",
            "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/pendukung-2.webp",
            "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Pink)/pendukung-4.webp" }
        ]
    },

    /* ═════════════════════════════════════════════════════════════════════
     * 3. MONTIBELLO — HOP SERIES (CLEAN BIOTECHNOLOGY HAIRCARE)
     * ═════════════════════════════════════════════════════════════════════ */
    {
        id: "blonde-glow-shampoo",
        name: "BLONDE GLOW SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Illuminating antioxidant shampoo powered by LifeAlgae Bioferment and Vitamin C for blonde and highlighted hair.",
        longDescription: "Montibello HOP Blonde Glow Shampoo is a clean-science brightening cleanser engineered for blonde, bleached, and highlighted hair. Formulated with hyper-fermented marine microalgae and stabilized Vitamin C, it removes dulling mineral deposits, neutralizes yellow undertones, and protects blonde pigments from environmental oxidation.",
        keyBenefits: [
            "Restores luminous natural radiance to blonde and bleached tones",
            "Vitamin C antioxidant complex combats color fading and brassiness",
            "97% natural origin vegan formula free from sulfates and parabens",
            "Hydrates fragile lightened fibers to prevent breakage"
        ],
        howToUse: "Apply to wet hair and scalp. Massage into a rich creamy lather. Leave on for 2-3 minutes for enhanced brightening. Rinse thoroughly. Follow with Blonde Glow Mask.",
        recommendedFor: [
            "Natural blondes, platinum bleached hair, and balayage highlights",
            "Preventing color oxidation and dullness"
        ],
        variants: ["300ml", "1000ml"],
        image: "/images/products/montibello-hop/BLONDE GLOW SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/BLONDE GLOW SHAMPOO/pendukung-1.webp",
            "/images/products/montibello-hop/BLONDE GLOW SHAMPOO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/montibello-hop/BLONDE GLOW SHAMPOO/pendukung-3.webp" },
            { type: "technology", src: "/images/products/montibello-hop/BLONDE GLOW SHAMPOO/pendukung-4.webp" }
        ]
    },
    {
        id: "blonde-glow-mask",
        name: "BLONDE GLOW MASK",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Intense illuminating hair mask with botanical ceramides and Vitamin C to nourish lightened hair fibers.",
        longDescription: "HOP Blonde Glow Mask provides intensive lipid replenishment for bleached, sensitized, and porous blonde hair. Combining bioactive marine microalgae with plant ceramides, it restores internal fiber cohesion, seals cuticles, and magnifies crystalline light reflection across blonde highlights.",
        keyBenefits: [
            "Deeply nourishes sensitized hair after bleaching and toning services",
            "Multiplies light reflection for a luminous diamond blonde glow",
            "Reinforces internal fiber bonds against mechanical breakage",
            "Silky detangling action with zero greasy weight"
        ],
        howToUse: "After shampooing, apply an ample amount onto damp mid-lengths and ends. Distribute with a wide-tooth comb. Leave in for 3-5 minutes (or 10 minutes for deep salon ritual). Rinse thoroughly.",
        recommendedFor: [
            "Porous, bleached, or highlighted blonde hair needing intense nutrition",
            "Post-lightening salon restorative services"
        ],
        variants: ["200ml", "500ml"],
        image: "/images/products/montibello-hop/BLONDE GLOW MASK/hero.webp",
        gallery: [
            "/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-1.webp",
            "/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-3.webp" },
            { type: "application", src: "/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-4.webp" },
            { type: "ingredients", src: "/images/products/montibello-hop/BLONDE GLOW MASK/pendukung-5.webp" }
        ]
    },
    {
        id: "colour-last-shampoo",
        name: "COLOUR LAST SHAMPOO",
        brand: "Montibello",
        category: "hair-colour",
        audience: "salon",
        description: "Protective color-locking shampoo formulated with Chia Seed bioferment and broad-spectrum UV filters.",
        longDescription: "Montibello HOP Colour Last Shampoo is a sulfate-free color preservation cleanser designed to lock in cosmetic pigments. Powered by fermented Chia Seed extracts and photoprotective antioxidants, it seals hair cuticles, prevents wash-out fading, and extends color intensity for up to 10 weeks.",
        keyBenefits: [
            "Preserves cosmetic hair color vibrancy for up to 10 weeks",
            "Chia seed bioferment forms a protective shield against pigment washout",
            "Sulfate-free gentle surfactant system protects hair lipid barrier",
            "Enriched with UV filters to prevent sun-induced color oxidation"
        ],
        howToUse: "Apply to wet hair. Massage gently over scalp and hair fiber. Rinse thoroughly. Repeat if necessary. Follow with Colour Last Rinse or Mask.",
        recommendedFor: [
            "All color-treated, toned, and gloss-treated salon hair",
            "Preventing premature color fading and vibrancy loss"
        ],
        variants: ["300ml", "1000ml"],
        image: "/images/products/montibello-hop/COLOUR LAST SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/COLOUR LAST SHAMPOO/pendukung-1.webp",
            "/images/products/montibello-hop/COLOUR LAST SHAMPOO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/montibello-hop/COLOUR LAST SHAMPOO/pendukung-3.webp" }
        ]
    },
    {
        id: "colour-last-rinse",
        name: "COLOUR LAST RINSE",
        brand: "Montibello",
        category: "hair-colour",
        audience: "salon",
        description: "Weightless color-protecting conditioner that seals cuticles and delivers instant detangling.",
        longDescription: "HOP Colour Last Rinse is a high-performance daily conditioner that seals cuticle scales to lock in color pigments while providing effortless detangling. Formulated with fermented botanicals, it leaves color-treated hair light, silky, and brilliantly reflective without heavy buildup.",
        keyBenefits: [
            "Instant detangling and cuticle smoothing in just 60 seconds",
            "Locks in color vibrancy and prolongs gloss between salon visits",
            "Lightweight formula ideal for daily use on fine-to-medium hair",
            "Infused with heat and UV protective botanical agents"
        ],
        howToUse: "Apply evenly to clean, towel-dried hair from mid-lengths to ends. Detangle with fingers or a wide comb. Leave for 1-2 minutes, then rinse thoroughly.",
        recommendedFor: [
            "Daily color maintenance for fine and normal color-treated hair",
            "Quick post-color salon wash station services"
        ],
        variants: ["300ml", "750ml"],
        image: "/images/products/montibello-hop/COLOUR LAST RINSE/hero.webp",
        gallery: [
            "/images/products/montibello-hop/COLOUR LAST RINSE/pendukung-1.webp",
            "/images/products/montibello-hop/COLOUR LAST RINSE/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/COLOUR LAST RINSE/pendukung-3.webp" }
        ]
    },
    {
        id: "colour-last-mask",
        name: "COLOUR LAST MASK",
        brand: "Montibello",
        category: "hair-colour",
        audience: "salon",
        description: "Intensive chromatic restructuring mask for deep color lock, cuticle sealing, and mirror shine.",
        longDescription: "Montibello HOP Colour Last Mask provides deep fiber reconstruction for sensitized, color-treated hair. Its rich lipid-rich bio-formula infuses Chia seed antioxidants and marine algae actives into the hair cortex, strengthening the fiber structure while locking pigments into a brilliant mirror-gloss shield.",
        keyBenefits: [
            "Intensive nourishing treatment for sensitized color-treated hair",
            "Locks pigments deep within the cortex to prevent fading",
            "Rebuilds cuticle surface integrity for high-definition shine",
            "Protects against thermal and environmental color degradation"
        ],
        howToUse: "Apply to towel-dried hair after shampooing. Work through sections from roots to tips. Leave in for 3-5 minutes (10 minutes for intensive repair). Rinse thoroughly.",
        recommendedFor: [
            "Thick, coarse, or severely sensitized color-treated hair",
            "Post-bleach toner lock and deep color conditioning rituals"
        ],
        variants: ["200ml", "500ml"],
        image: "/images/products/montibello-hop/COLOUR LAST MASK/hero.webp",
        gallery: [
            "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-1.webp",
            "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-3.webp" },
            { type: "ingredients", src: "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-4.webp" },
            { type: "application", src: "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-5.webp" }
        ]
    },
    {
        id: "smooth-hydration-shampoo",
        name: "SMOOTH HYDRATION SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Hydrating anti-frizz shampoo infused with Hyaluronic Acid bio-complex and organic Cottonseed Oil.",
        longDescription: "HOP Smooth Hydration Shampoo is a moisture-binding cleanser designed to tame unruly, dry, and frizzy hair. Infused with multi-molecular Hyaluronic Acid and organic Cottonseed Oil, it replenishes vital moisture reserves, balances fiber elasticity, and provides 72-hour anti-humidity control.",
        keyBenefits: [
            "72-hour humidity defense and anti-frizz smoothing control",
            "Hyaluronic acid bio-complex binds continuous hydration into hair fibers",
            "Softens coarse cuticles for silk-like combability and bounce",
            "97% natural origin vegan formulation free of harsh sulfates"
        ],
        howToUse: "Apply to wet hair and scalp. Massage gently to generate a rich lather. Rinse thoroughly and follow with Smooth Hydration Rinse or Mask.",
        recommendedFor: [
            "Dry, coarse, rebellious, and humidity-sensitive hair",
            "Smoothing blowouts and keratin-maintained hair"
        ],
        variants: ["300ml", "1000ml"],
        image: "/images/products/montibello-hop/SMOOTH HYDRATION SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/SMOOTH HYDRATION SHAMPOO/pendukung-1.webp",
            "/images/products/montibello-hop/SMOOTH HYDRATION SHAMPOO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/SMOOTH HYDRATION SHAMPOO/pendukung-3.webp" }
        ]
    },
    {
        id: "smooth-hydration-rinse",
        name: "SMOOTH HYDRATION RINSE",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Instant smoothing detangler and anti-humidity conditioner with hyaluronic hydration.",
        longDescription: "HOP Smooth Hydration Rinse delivers instant frizz control and weightless moisture. Enriched with fermented bio-actives and cottonseed oil, it instantly detangles unruly hair, seals cuticle scales, and leaves hair perfectly aligned and silky smooth.",
        keyBenefits: [
            "Instant detangling and cuticle alignment in 60 seconds",
            "Forms an invisible anti-humidity shield preventing frizzy flare-ups",
            "Lightweight hydration that maintains natural hair movement",
            "Leaves hair touchably soft, flexible, and polished"
        ],
        howToUse: "Apply to damp, shampooed hair from mid-lengths to ends. Comb through gently. Leave on for 1-2 minutes, then rinse thoroughly.",
        recommendedFor: [
            "Daily smoothing for fine to medium frizzy hair",
            "Effortless combability and fast salon backwash detangling"
        ],
        variants: ["300ml", "750ml"],
        image: "/images/products/montibello-hop/SMOOTH HYDRATION RINSE/hero.webp",
        gallery: [
            "/images/products/montibello-hop/SMOOTH HYDRATION RINSE/pendukung-1.webp",
            "/images/products/montibello-hop/SMOOTH HYDRATION RINSE/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "application", src: "/images/products/montibello-hop/SMOOTH HYDRATION RINSE/pendukung-3.webp" }
        ]
    },
    {
        id: "smooth-hydration-mask",
        name: "SMOOTH HYDRATION MASK",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Deep lipid-replenishing smoothing mask for rebellious, coarse, and intensely dehydrated hair.",
        longDescription: "Montibello HOP Smooth Hydration Mask is an ultra-nourishing salon treatment that reconstructs the moisture barrier of coarse and frizzy hair. Infused with concentrated Hyaluronic Acid and botanical lipids, it provides long-lasting discipline, fiber elasticity, and velvet touch.",
        keyBenefits: [
            "Intensive moisture infusion for deeply parched and unruly hair",
            "Tames the most stubborn frizz even in tropical high-humidity climates",
            "Restores natural lipid flexibility, preventing breakage and brittleness",
            "Delivers mirror-like shine and luxurious velvet softness"
        ],
        howToUse: "Apply generously to towel-dried hair. Massage into strands and leave for 3-5 minutes (or 10 minutes under heat cap). Rinse thoroughly.",
        recommendedFor: [
            "Coarse, thick, unruly, and severely dehydrated hair types",
            "Intensive salon moisturizing spa rituals"
        ],
        variants: ["200ml", "500ml"],
        image: "/images/products/montibello-hop/SMOOTH HYDRATION MASK/hero.webp",
        gallery: [
            "/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-1.webp",
            "/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-3.webp" },
            { type: "ingredients", src: "/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-4.webp" },
            { type: "technology", src: "/images/products/montibello-hop/SMOOTH HYDRATION MASK/pendukung-5.webp" }
        ]
    },
    {
        id: "ultra-repair-shampoo",
        name: "ULTRA REPAIR SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Reconstructive bond-building shampoo with Vegan Keratin and restorative plant peptides.",
        longDescription: "Montibello HOP Ultra Repair Shampoo is a restorative cleanser formulated to rebuild chemically compromised, brittle, and over-processed hair. Harnessing biomimetic Vegan Keratin and fermented marine bio-peptides, it reconstructs damaged protein chains from within the cortex.",
        keyBenefits: [
            "Restores up to 95% of broken protein structure in damaged hair",
            "Reinforces cortex bonds against chemical and thermal breakage",
            "Gently purifies without stripping essential structural lipids",
            "Prepares hair fiber for deep reconstructive treatment absorption"
        ],
        howToUse: "Apply to wet hair. Massage gently through roots and lengths. Rinse thoroughly. Follow with Ultra Repair Rinse or Mask.",
        recommendedFor: [
            "Severely damaged, bleached, permed, or heat-fatigued hair",
            "Post-chemical emergency hair rescue services"
        ],
        variants: ["300ml", "1000ml"],
        image: "/images/products/montibello-hop/ULTRA REPAIR SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/ULTRA REPAIR SHAMPOO/pendukung-1.webp",
            "/images/products/montibello-hop/ULTRA REPAIR SHAMPOO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/ULTRA REPAIR SHAMPOO/pendukung-3.webp" }
        ]
    },
    {
        id: "ultra-repair-rinse",
        name: "ULTRA REPAIR RINSE",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Strengthening reconstructive conditioner that seals the cortex and fortifies fiber resilience.",
        longDescription: "HOP Ultra Repair Rinse provides rapid fiber fortification and cuticle smoothing. Formulated with micro-peptides that penetrate damaged fissures in the hair shaft, it restores elasticity, prevents snagging during brushing, and leaves damaged hair feeling resilient and renewed.",
        keyBenefits: [
            "Rapid structural fortification in just 60-90 seconds",
            "Fills micro-fissures in damaged hair fibers to prevent snapping",
            "Restores natural bounce, combability, and elastic strength",
            "Protects against daily styling friction and environmental stress"
        ],
        howToUse: "Apply to clean, damp hair focusing on damaged mid-lengths and ends. Comb through gently. Leave on for 1-2 minutes, then rinse thoroughly.",
        recommendedFor: [
            "Daily conditioning for weakened, brittle, and snapping hair",
            "Restoring strength between intense salon treatments"
        ],
        variants: ["300ml", "750ml"],
        image: "/images/products/montibello-hop/ULTRA REPAIR RINSE/hero.webp",
        gallery: [
            "/images/products/montibello-hop/ULTRA REPAIR RINSE/pendukung-1.webp",
            "/images/products/montibello-hop/ULTRA REPAIR RINSE/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "application", src: "/images/products/montibello-hop/ULTRA REPAIR RINSE/pendukung-3.webp" }
        ]
    },
    {
        id: "ultra-repair-mask",
        name: "ULTRA REPAIR MASK",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Intense cortex-reconstructing mask engineered to repair extreme chemical and thermal damage.",
        longDescription: "Montibello HOP Ultra Repair Mask is the ultimate structural reconstruction treatment for severely damaged hair. High concentrations of bio-fermented peptides, amino acids, and vegan keratin fuse into the internal cortex, rebuilding sulfur cross-links and restoring complete fiber cohesion.",
        keyBenefits: [
            "Rebuilds internal cortex architecture in over-processed hair",
            "Eliminates brittleness and reduces split ends by up to 90%",
            "Imparts deep structural resilience without stiffening hair texture",
            "Revitalizes lifeless, elastic-compromised hair to healthy vitality"
        ],
        howToUse: "Apply thoroughly to towel-dried hair. Massage section by section. Leave on for 5-10 minutes (ideal with heat steamer or warm towel). Rinse completely with cool water.",
        recommendedFor: [
            "Over-bleached, chemically straightened, or thermally damaged hair",
            "Core salon restorative and bonding services"
        ],
        variants: ["200ml", "500ml"],
        image: "/images/products/montibello-hop/ULTRA REPAIR MASK/hero.webp",
        gallery: [
            "/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-1.webp",
            "/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-3.webp" },
            { type: "ingredients", src: "/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-4.webp" },
            { type: "technology", src: "/images/products/montibello-hop/ULTRA REPAIR MASK/pendukung-5.webp" }
        ]
    },
    {
        id: "ultra-repair-sealed-ends",
        name: "ULTRA REPAIR SEALED ENDS",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Biomimetic split-end sealing leave-in serum that welds frayed ends and shields against heat.",
        longDescription: "HOP Ultra Repair Sealed Ends is a concentrated leave-in treatment formulated with biomimetic sealing polymers and vegan keratin. It instantly welds damaged, frayed split ends, creating a smooth, cohesive barrier that prevents further mechanical splitting and protects against hot styling tools up to 230°C.",
        keyBenefits: [
            "Instantly seals and welds up to 96% of split ends upon application",
            "Thermal heat shield protection against blow dryers and flat irons",
            "Leave-in lightweight formula that doesn't weigh ends down",
            "Prevents future mechanical breakage from brushing and styling"
        ],
        howToUse: "Apply a small pea-sized amount onto fingertips. Smooth thoroughly over dry or towel-dried ends. Do not rinse. Style as desired.",
        recommendedFor: [
            "Frayed split ends, porous tips, and fragile growing lengths",
            "Daily pre-styling seal for heat tool users"
        ],
        variants: ["75ml"],
        image: "/images/products/montibello-hop/ULTRA REPAIR SEALED ENDS/hero.webp",
        gallery: [
            "/images/products/montibello-hop/ULTRA REPAIR SEALED ENDS/pendukung-1.webp",
            "/images/products/montibello-hop/ULTRA REPAIR SEALED ENDS/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/ULTRA REPAIR SEALED ENDS/pendukung-3.webp" }
        ]
    },
    {
        id: "full-volume-shampoo",
        name: "FULL VOLUME SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Weightless volumizing cleanser powered by Oat Bio-Protein to amplify fine and flat hair.",
        longDescription: "Montibello HOP Full Volume Shampoo is an airy body-building cleanser formulated for fine, limp, and lifeless hair. Infused with fermented Oat Bio-Protein and marine algae actives, it gently removes weight-inducing sebum while plumping each hair strand from root to tip for lasting natural volume.",
        keyBenefits: [
            "Amplifies natural body and root lift for 24 hours",
            "Oat bio-protein thickens individual hair fiber diameter",
            "Purifies roots of excess sebum without drying mid-lengths",
            "Clean vegan formulation leaves hair light, bouncy, and airy"
        ],
        howToUse: "Apply to wet hair. Massage into a light, invigorating foam focusing on scalp and roots. Rinse thoroughly. Follow with Full Volume Foam Rinse.",
        recommendedFor: [
            "Fine, limp, thin, and flat hair seeking weightless fullness",
            "Daily volumizing salon wash services"
        ],
        variants: ["300ml", "1000ml"],
        image: "/images/products/montibello-hop/FULL VOLUME SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/FULL VOLUME SHAMPOO/pendukung-1.webp",
            "/images/products/montibello-hop/FULL VOLUME SHAMPOO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/FULL VOLUME SHAMPOO/pendukung-3.webp" }
        ]
    },
    {
        id: "full-volume-foam-rinse",
        name: "FULL VOLUME FOAM RINSE",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Innovative airy foam conditioner that detangles and hydrates fine hair with zero weight.",
        longDescription: "HOP Full Volume Foam Rinse is an ultra-lightweight conditioning foam that replaces traditional heavy cream conditioners. Formulated with airy micro-bubbles infused with oat peptides, it effortlessly detangles fine hair while adding spring, body, and bounce.",
        keyBenefits: [
            "Aerated micro-foam formula prevents any risk of weighing fine hair down",
            "Provides instant detangling and static electricity control",
            "Maintains open, voluminous root lift throughout the day",
            "Leaves hair feeling silky, voluminous, and exceptionally soft"
        ],
        howToUse: "Shake well. Dispense 1-2 palm-sized foam balls. Distribute evenly through clean, damp hair from roots to ends. Leave for 1 minute, then rinse thoroughly.",
        recommendedFor: [
            "Ultra-fine, baby-fine, and thinning hair prone to collapsing with cream rinses",
            "Lightweight daily salon conditioning"
        ],
        variants: ["200ml"],
        image: "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/hero.webp",
        gallery: [
            "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/pendukung-1.webp",
            "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/pendukung-3.webp" },
            { type: "application", src: "/images/products/montibello-hop/FULL VOLUME FOAM RINSE/pendukung-4.webp" }
        ]
    },
    {
        id: "full-volume-dry-shampoo",
        name: "FULL VOLUME DRY SHAMPOO",
        brand: "Montibello",
        category: "styling",
        audience: "salon",
        description: "Instant oil-absorbing texturizing dry spray for refreshed roots and effortless matte volume.",
        longDescription: "Montibello HOP Full Volume Dry Shampoo instantly refreshes hair between washes by absorbing excess scalp oils with natural rice starch. Leaves zero white residue while injecting instant texture, grip, and workable root volume for editorial styling.",
        keyBenefits: [
            "Instantly absorbs excess sebum and sweat without water",
            "Invisible formulation leaves zero powdery white cast",
            "Provides instant root lift, texture grip, and volume refresh",
            "Extends blowouts and keeps salon styles fresh for days"
        ],
        howToUse: "Shake vigorously before use. Spray from a distance of 20-30cm onto dry roots in short bursts. Massage with fingertips or brush through to distribute.",
        recommendedFor: [
            "Fast second-day style refresh and root volumizing",
            "Creating texturized grip before up-dos and braiding"
        ],
        variants: ["200ml"],
        image: "/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/pendukung-1.webp",
            "/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/FULL VOLUME DRY SHAMPOO/pendukung-3.webp" }
        ]
    },
    {
        id: "purifying-balance-shampoo",
        name: "PURIFYING BALANCE SHAMPOO",
        brand: "Montibello",
        category: "treatments",
        audience: "salon",
        description: "Prebiotic microbiome-balancing shampoo with Zinc PCA to regulate sebum and eliminate flakes.",
        longDescription: "HOP Purifying Balance Shampoo is a dermatologically tested scalp-clearing cleanser formulated with prebiotics, postbiotics, and Zinc PCA. It gently rebalances the scalp microbiome, regulates sebum overproduction, and eliminates dandruff flakes while soothing itching and irritation.",
        keyBenefits: [
            "Rebalances scalp microbiome to prevent recurring dandruff and flakes",
            "Zinc PCA regulates excess sebum production without drying hair ends",
            "Instantly calms scalp redness, itching, and tension sensations",
            "Clean sulfate-free formula preserves natural scalp barrier"
        ],
        howToUse: "Apply to wet scalp and hair. Massage gently with fingertips in circular motions. Leave on for 2 minutes to allow active prebiotics to work. Rinse thoroughly.",
        recommendedFor: [
            "Oily scalps, flaky scalps, and sensitive dandruff-prone conditions",
            "Scalp balancing salon therapy protocols"
        ],
        variants: ["300ml", "1000ml"],
        image: "/images/products/montibello-hop/PURIFYING BALANCE SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/PURIFYING BALANCE SHAMPOO/pendukung-1.webp",
            "/images/products/montibello-hop/PURIFYING BALANCE SHAMPOO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/PURIFYING BALANCE SHAMPOO/pendukung-3.webp" }
        ]
    },
    {
        id: "purifying-balance-scalp-treatment",
        name: "PURIFYING BALANCE SCALP TREATMENT",
        brand: "Montibello",
        category: "treatments",
        audience: "salon",
        description: "Targeted soothing gel treatment with Salicylic Acid and Prebiotics for persistent scalp concerns.",
        longDescription: "Montibello HOP Purifying Balance Scalp Treatment is an intensive clarifying scalp gel. Formulated with gentle exfoliating Salicylic Acid and concentrated marine prebiotics, it purifies congested follicles, prevents flaky accumulation, and provides immediate long-lasting scalp comfort.",
        keyBenefits: [
            "Micro-exfoliates dead skin cells and clearing clogged hair follicles",
            "Soothes severe itching, flaking, and scalp redness",
            "Strengthens natural scalp barrier against microbial imbalance",
            "Non-greasy residue-free gel absorbs rapidly into scalp skin"
        ],
        howToUse: "Apply section by section directly onto dry or damp scalp using nozzle applicator. Massage gently with fingertips. Do not rinse. Use 2-3 times per week.",
        recommendedFor: [
            "Chronic flaky or congested scalp conditions",
            "Specialized scalp detox and trichological salon treatments"
        ],
        variants: ["100ml"],
        image: "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/hero.webp",
        gallery: [
            "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/pendukung-1.webp",
            "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/pendukung-3.webp" },
            { type: "application", src: "/images/products/montibello-hop/PURIFYING BALANCE SCALP TREATMENT/pendukung-4.webp" }
        ]
    },
    {
        id: "detox-cleansing-shampoo",
        name: "DETOX CLEANSING SHAMPOO",
        brand: "Montibello",
        category: "hair-care",
        audience: "salon",
        description: "Anti-pollution clarifying shampoo with Marine Charcoal to purge styling buildup and environmental toxins.",
        longDescription: "HOP Detox Cleansing Shampoo is an urban detoxifying cleanser powered by activated Marine Charcoal and fermented algae. It deeply purges styling product residues, hard water minerals, and heavy airborne pollutants from hair and scalp, restoring fresh lightness and oxygenated vitality.",
        keyBenefits: [
            "Purges styling product residues, silicones, and hard water minerals",
            "Marine charcoal absorbs environmental micro-pollutants and toxins",
            "Re-oxygenates the scalp for an invigorating clean sensation",
            "Prepares hair for maximum absorption of salon coloring and treatments"
        ],
        howToUse: "Apply to wet hair. Massage vigorously over scalp and hair fiber. Rinse thoroughly. Ideal as a weekly clarifying ritual or pre-chemical prep wash.",
        recommendedFor: [
            "Hair exposed to city pollution, heavy styling products, and hard water",
            "Pre-treatment clarifier before salon perms or color services"
        ],
        variants: ["300ml", "1000ml"],
        image: "/images/products/montibello-hop/DETOX CLEANSING SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/DETOX CLEANSING SHAMPOO/pendukung-1.webp",
            "/images/products/montibello-hop/DETOX CLEANSING SHAMPOO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/DETOX CLEANSING SHAMPOO/pendukung-3.webp" }
        ]
    },
    {
        id: "scalp-detox-cleansing-treatment",
        name: "SCALP DETOX CLEANSING TREATMENT",
        brand: "Montibello",
        category: "treatments",
        audience: "salon",
        description: "Exfoliating White Clay and Marine Charcoal scalp scrub for deep purification and cellular renewal.",
        longDescription: "Montibello HOP Scalp Detox Cleansing Treatment is a luxurious pre-wash scalp scrub. Infused with natural White Kaolin Clay and biodegradable micro-exfoliants, it detoxifies the scalp surface, clears sebum buildup around hair roots, and stimulates microcirculation for healthier hair growth.",
        keyBenefits: [
            "Natural white clay absorbs impurities and excess follicular sebum",
            "Gentle biodegradable micro-exfoliation stimulates scalp blood flow",
            "Instantly relieves scalp tightness, suffocation, and pollution stress",
            "Leaves scalp feeling cool, refreshed, and deeply purified"
        ],
        howToUse: "Before shampooing, apply onto dry or damp scalp section by section. Perform a gentle circular massage for 3-5 minutes. Rinse thoroughly, then proceed with shampoo.",
        recommendedFor: [
            "Congested, suffocated, or heavy scalps needing deep exfoliation",
            "Pre-shampoo salon head spa and scalp detox rituals"
        ],
        variants: ["200ml"],
        image: "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/hero.webp",
        gallery: [
            "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/pendukung-1.webp",
            "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/pendukung-3.webp" },
            { type: "application", src: "/images/products/montibello-hop/SCALP DETOX CLEANSING TREATMENT/pendukung-4.webp" }
        ]
    },
    {
        id: "silver-white-shampoo",
        name: "SILVER WHITE SHAMPOO",
        brand: "Montibello",
        category: "hair-colour",
        audience: "salon",
        description: "Neutralizing silver shampoo with Violet micro-pigments for icy platinum, grey, and natural white hair.",
        longDescription: "HOP Silver White Shampoo is an advanced brass-neutralizing cleanser formulated with calibrated purple-violet micro-pigments and marine antioxidant bio-extracts. It neutralizes unwanted yellow, brassy, and copper tones in white, grey, silver, and bleached hair, restoring pure icy luminescence.",
        keyBenefits: [
            "Neutralizes yellow brassiness in bleached, grey, and silver hair",
            "Pure violet micro-pigments deliver cool, crystal-clear brightness",
            "Gentle formula prevents fiber dryness common with purple shampoos",
            "Enhances the natural shine of mature silver and grey hair"
        ],
        howToUse: "Apply onto wet hair wearing gloves. Massage into lather and leave for 1-3 minutes (up to 5 minutes for intense silver neutralization). Rinse thoroughly. Follow with Silver White Rinse.",
        recommendedFor: [
            "Platinum blonde, ash toned, grey, and natural white hair",
            "Anti-brass toning maintenance between salon visits"
        ],
        variants: ["300ml", "1000ml"],
        image: "/images/products/montibello-hop/SILVER WHITE SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/SILVER WHITE SHAMPOO/pendukung-1.webp",
            "/images/products/montibello-hop/SILVER WHITE SHAMPOO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/montibello-hop/SILVER WHITE SHAMPOO/pendukung-3.webp" }
        ]
    },
    {
        id: "silver-white-rinse",
        name: "SILVER WHITE RINSE",
        brand: "Montibello",
        category: "hair-colour",
        audience: "salon",
        description: "Illuminating silver conditioner that softens fragile grey and platinum hair while sealing cool tones.",
        longDescription: "HOP Silver White Rinse is an ultra-nourishing cool-tone conditioner that seals cuticles and prevents color degradation. Formulated with lightweight botanical oils and violet toning enhancers, it leaves grey and lightened hair soft, shiny, and effortlessly manageable.",
        keyBenefits: [
            "Softens wiry, coarse grey hair and delicate bleached strands",
            "Seals cuticles to lock in cool ash and icy platinum pigments",
            "Combats sun and thermal yellowing with antioxidant protection",
            "Leaves hair manageable, tangle-free, and brilliantly bright"
        ],
        howToUse: "Apply to clean, damp hair after silver shampoo. Distribute evenly through lengths and ends. Leave on for 2 minutes, then rinse thoroughly.",
        recommendedFor: [
            "Daily toning conditioning for white, silver, and platinum hair",
            "Softening mature grey hair texture"
        ],
        variants: ["300ml", "750ml"],
        image: "/images/products/montibello-hop/SILVER WHITE RINSE/hero.webp",
        gallery: [
            "/images/products/montibello-hop/SILVER WHITE RINSE/pendukung-1.webp",
            "/images/products/montibello-hop/SILVER WHITE RINSE/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "application", src: "/images/products/montibello-hop/SILVER WHITE RINSE/pendukung-3.webp" }
        ]
    },

    /* ═════════════════════════════════════════════════════════════════════
     * 4. GAMMA+ PROFESSIONAL (ITALIAN ENGINEERED BARBER & SALON HARDWARE)
     * ═════════════════════════════════════════════════════════════════════ */
    {
        id: "xcell-clipper",
        name: "XCELL CLIPPER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "Digital brushless motor clipper (7,500 RPM) with DLC Black Diamond blade and custom ergonomic body.",
        longDescription: "Gamma+ Xcell Clipper represents Italian engineering at its peak. Powered by a high-torque digital brushless motor delivering 7,500 RPM with constant speed torque control, it cuts effortlessly through any hair density. Equipped with a 45mm Black Diamond Carbon DLC blade that stays cool, sharp, and rust-free.",
        keyBenefits: [
            "High-torque digital brushless motor operating at 7,500 RPM",
            "45mm DLC Black Diamond blade stays cooler and sharper longer",
            "Lithium-ion battery provides 120 minutes of continuous cordless runtime",
            "Ultra-light balanced ergonomic chassis reduces wrist fatigue"
        ],
        howToUse: "Adjust taper lever for desired cutting length (0.3mm to 3.0mm). Use with magnetic guards (1.5mm to 13mm) for fading and bulk removal. Clean blade with brush and oil after each client.",
        recommendedFor: [
            "High-volume barber shops and precision fade specialists",
            "Bulk removal and seamless zero-gap taper blending"
        ],
        variants: ["Matte Black", "Matte Gunmetal", "Rose Gold"],
        image: "/images/products/gamma-plus/XCELL CLIPPER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/XCELL CLIPPER/pendukung-1.webp",
            "/images/products/gamma-plus/XCELL CLIPPER/pendukung-2.webp",
            "/images/products/gamma-plus/XCELL CLIPPER/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/XCELL CLIPPER/pendukung-4.webp" },
            { type: "technology", src: "/images/products/gamma-plus/XCELL CLIPPER/pendukung-5.webp" },
            { type: "benefits", src: "/images/products/gamma-plus/XCELL CLIPPER/pendukung-6.webp" }
        ]
    },
    {
        id: "shorty-clipper",
        name: "SHORTY CLIPPER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "Ultra-compact micro-torque clipper (8,500 RPM) weighing only 195g for precision maneuvering.",
        longDescription: "The Gamma+ Shorty Clipper is a revolutionary compact power clipper built for modern creative barbering. Weighing only 195 grams, its miniaturized chassis houses an 8,500 RPM micro-torque motor paired with a specialized Japanese stainless steel blade for ultra-close fades and detail work.",
        keyBenefits: [
            "Ultra-compact 195g body provides unmatched hand maneuverability",
            "High-frequency micro-torque motor spins at 8,500 RPM",
            "Japanese precision stainless steel blade for crisp lines",
            "Includes charging dock, magnetic guards, and USB charging cable"
        ],
        howToUse: "Operate with fingertip precision for tight neckline blends, ear contouring, and close fading. Recharges in 90 minutes on charging dock.",
        recommendedFor: [
            "Creative barbers, traveling stylists, and precision fade detailing",
            "Eliminating wrist and hand strain during long work days"
        ],
        variants: ["Matte Black", "Silver", "Gold"],
        image: "/images/products/gamma-plus/SHORTY CLIPPER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-1.webp",
            "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-2.webp",
            "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-4.webp" },
            { type: "technology", src: "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-5.webp" },
            { type: "benefits", src: "/images/products/gamma-plus/SHORTY CLIPPER/pendukung-6.webp" }
        ]
    },
    {
        id: "boosted-up-clipper",
        name: "BOOSTED UP CLIPPER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "Supercharged rotary motor clipper (7,200 RPM) with customizable double modular body covers.",
        longDescription: "Gamma+ Boosted Up Clipper features a high-performance rotary motor delivering 7,200 RPM with raw cutting power. Equipped with a Black Diamond Fade blade and customizable interchangeable covers (Black, Red, Gold), it handles wet or dry bulk hair without snagging.",
        keyBenefits: [
            "Supercharged 7,200 RPM rotary motor powers through thickest hair",
            "Black Diamond Carbon DLC Fade blade for laser-sharp lines",
            "Includes 3 interchangeable color body cover kits",
            "Double ball bearing system ensures ultra-quiet vibration-free operation"
        ],
        howToUse: "Use custom taper lever to set desired blade gap. Attach magnetic dub guards for structured clipper-over-comb and fading techniques.",
        recommendedFor: [
            "Heavy-duty bulk hair removal, fading, and tapers",
            "Barbers who love personalizing their tool aesthetic"
        ],
        variants: ["Modular 3-Cover Kit (Black/Red/Gold)"],
        image: "/images/products/gamma-plus/BOOSTED UP CLIPPER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-1.webp",
            "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-2.webp",
            "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-4.webp" },
            { type: "benefits", src: "/images/products/gamma-plus/BOOSTED UP CLIPPER/pendukung-5.webp" }
        ]
    },
    {
        id: "xcell-trimmer",
        name: "XCELL TRIMMER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "Digital skeleton trimmer (7,500 RPM) with 360° open-view DLC T-blade for surgical line-ups.",
        longDescription: "The Gamma+ Xcell Trimmer features a skeleton open-axis design providing 360-degree line-of-sight visibility. Powered by a 7,500 RPM digital brushless motor and zero-gap adjustable DLC Deep Tooth T-blade, it produces razor-sharp edges and intricate hair tattoos with zero skin pinch.",
        keyBenefits: [
            "360° open skeleton view ensures perfect line-of-sight for detailing",
            "Digital brushless motor delivers constant 7,500 RPM torque",
            "Black Diamond DLC T-blade zero-gaps to 0.0mm for surgical lines",
            "120 minutes of runtime with fast USB-C and dock charging"
        ],
        howToUse: "Hold at a 45-degree angle to create crisp edge-ups, beard lineups, and hair tattoos. Use zero-gap tool included in box to set cutting blade flush.",
        recommendedFor: [
            "Precision beard shaping, edge-ups, and artistic hair tattoos",
            "Skin-tight neck cleanups"
        ],
        variants: ["Matte Black", "Matte Gunmetal", "Rose Gold"],
        image: "/images/products/gamma-plus/XCELL TRIMMER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/XCELL TRIMMER/pendukung-1.webp",
            "/images/products/gamma-plus/XCELL TRIMMER/pendukung-2.webp",
            "/images/products/gamma-plus/XCELL TRIMMER/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/XCELL TRIMMER/pendukung-4.webp" },
            { type: "technology", src: "/images/products/gamma-plus/XCELL TRIMMER/pendukung-5.webp" },
            { type: "benefits", src: "/images/products/gamma-plus/XCELL TRIMMER/pendukung-6.webp" },
            { type: "application", src: "/images/products/gamma-plus/XCELL TRIMMER/pendukung-7.webp" }
        ]
    },
    {
        id: "absolute-alpha-clipper",
        name: "ABSOLUTE ALPHA CLIPPER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "Modular rotary clipper (6,000 RPM) with DLC Taper blade and interchangeable casing sets.",
        longDescription: "Gamma+ Absolute Alpha is a proven modular clipper built with a high-torque rotary motor (6,000 RPM). Comes standard with a 45mm Black Diamond DLC Taper blade and interchangeable body casings (Matte Black, Metallic Gold, Gloss Red) for ultimate salon versatility.",
        keyBenefits: [
            "High-torque rotary motor operating at 6,000 RPM",
            "45mm DLC Black Diamond Taper blade stays razor sharp",
            "Includes 3 interchangeable full-body modular casing kits",
            "240 minutes of cordless battery runtime with lithium technology"
        ],
        howToUse: "Easily swap covers to suit your setup. Adjust taper lever to blend lines seamlessly across guard sizes.",
        recommendedFor: [
            "All-around clipper cutting, tapering, and daily salon work",
            "Stylists requiring marathon battery life (4 hours)"
        ],
        variants: ["Modular 3-Cover Kit (Black/Gold/Red)"],
        image: "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/pendukung-1.webp",
            "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/pendukung-2.webp",
            "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/ABSOLUTE ALPHA CLIPPER/pendukung-4.webp" }
        ]
    },
    {
        id: "boosted-trimmer",
        name: "BOOSTED TRIMMER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "High-torque rotary trimmer (8,000 RPM) with Black Diamond Deep Tooth blade for heavy detailing.",
        longDescription: "The Gamma+ Boosted Trimmer combines an 8,000 RPM super-rotary motor with an X-Pro Black Diamond DLC T-blade. Engineered to plow through coarse beards and dense hairlines with zero pull, it comes with interchangeable custom covers and charging base.",
        keyBenefits: [
            "High-velocity 8,000 RPM rotary motor handles thick, coarse hair",
            "X-Pro Black Diamond Deep Tooth T-blade for ultra-sharp etching",
            "Includes 3 modular interchangeable cover bodies",
            "120 minutes of runtime with mini-USB and dock charging options"
        ],
        howToUse: "Use for bulk beard edging, neck clearing, and high-contrast hair design carving. Keep blade lubricated with included oil.",
        recommendedFor: [
            "Heavy beard shaping, thick hairlines, and coarse hair textures",
            "High-demand barbering stations"
        ],
        variants: ["Modular 3-Cover Kit"],
        image: "/images/products/gamma-plus/BOOSTED TRIMMER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/BOOSTED TRIMMER/pendukung-1.webp",
            "/images/products/gamma-plus/BOOSTED TRIMMER/pendukung-2.webp",
            "/images/products/gamma-plus/BOOSTED TRIMMER/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/BOOSTED TRIMMER/pendukung-4.webp" }
        ]
    },
    {
        id: "absolute-hitter-trimmer",
        name: "ABSOLUTE HITTER TRIMMER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "Fully modular custom trimmer with removable drop-top skeleton axis and zero-gap Black Diamond blade.",
        longDescription: "The Absolute Hitter is a legendary modular trimmer featuring a removable drop-top skeleton cover to expose the blade for cooler operation and improved visibility. Powered by a quiet 6,000 RPM rotary motor, it is zero-gap adjustable and includes 3 custom colored covers.",
        keyBenefits: [
            "Removable drop-top skeleton cap for enhanced 360° visibility",
            "Zero-gap adjustable Black Diamond Carbon DLC T-blade",
            "Ultra-quiet rotary motor operation with minimal vibration",
            "240-minute marathon battery life on a single charge"
        ],
        howToUse: "Snap off top cover if skeleton mode is preferred. Use included zero-gap tool to calibrate blade for skin-close fading and precision line-ups.",
        recommendedFor: [
            "Delicate hairline detailing, sensitive neck skin, and beard outlining",
            "Barbers demanding 4-hour battery endurance"
        ],
        variants: ["Modular 3-Cover Kit (Black/Silver/Gold)"],
        image: "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/pendukung-1.webp",
            "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/pendukung-2.webp",
            "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/ABSOLUTE HITTER TRIMMER/pendukung-4.webp" }
        ]
    },
    {
        id: "xcell-shaver",
        name: "XCELL SHAVER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "Digital micro-motor shaver (10,000 RPM) with ultra-thin hypoallergenic Gold Titanium floating foils.",
        longDescription: "Gamma+ Xcell Shaver is a professional dual-foil shaver driven by a high-speed digital micro-motor reaching 10,000 RPM. Outfitted with ultra-thin, hypoallergenic gold titanium floating foils and staggered stainless steel cutters, it delivers zero-gap skin finishes without irritation.",
        keyBenefits: [
            "Digital micro-motor generates 10,000 RPM for ultra-fast shaving",
            "Hypoallergenic gold titanium foils prevent razor bumps and skin irritation",
            "Independent floating foil heads adapt seamlessly to facial and head contours",
            "Ergonomic rounded casing with USB and charging dock included"
        ],
        howToUse: "Glide gently over stubble or faded hair without pressing hard against skin. Use foil brush to remove hair cuttings after each service.",
        recommendedFor: [
            "Bald fades, head shaving, and clean neck detailing",
            "Clients with sensitive, bump-prone skin"
        ],
        variants: ["Matte Black", "Matte Gunmetal", "Rose Gold"],
        image: "/images/products/gamma-plus/XCELL SHAVER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/XCELL SHAVER/pendukung-1.webp",
            "/images/products/gamma-plus/XCELL SHAVER/pendukung-2.webp",
            "/images/products/gamma-plus/XCELL SHAVER/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/XCELL SHAVER/pendukung-4.webp" },
            { type: "benefits", src: "/images/products/gamma-plus/XCELL SHAVER/pendukung-5.webp" }
        ]
    },
    {
        id: "boosted-shaver",
        name: "BOOSTED SHAVER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "Heavy-duty dual-action foil shaver with staggered cutters and 120-minute lithium runtime.",
        longDescription: "Gamma+ Boosted Shaver is built for high-demand barbershops. Equipped with staggered dual cutters and ultra-thin titanium foils, it glides across skin to eliminate stubble and blend skin fades seamlessly without dragging or pulling.",
        keyBenefits: [
            "Staggered dual cutter blades for high-efficiency hair capture",
            "Hypoallergenic titanium foils for ultra-smooth skin finish",
            "120 minutes of continuous lithium-ion cordless runtime",
            "Ergonomic textured grip for non-slip barber handling"
        ],
        howToUse: "Hold perpendicular to skin and move against hair growth direction. Tap out hair chambers after use and sanitize foils.",
        recommendedFor: [
            "High-volume barber shops, daily bald fades, and beard cheek cleanups",
            "Clean skin fade transitions"
        ],
        variants: ["Matte Black"],
        image: "/images/products/gamma-plus/BOOSTED SHAVER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/BOOSTED SHAVER/pendukung-1.webp",
            "/images/products/gamma-plus/BOOSTED SHAVER/pendukung-2.webp",
            "/images/products/gamma-plus/BOOSTED SHAVER/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/BOOSTED SHAVER/pendukung-4.webp" }
        ]
    },
    {
        id: "absolute-zero-shaver",
        name: "ABSOLUTE ZERO SHAVER",
        brand: "Gamma+ Professional",
        category: "barber",
        audience: "barber",
        description: "Ultra-lightweight pocket shaver (130g) with integrated retractable trimmer and gold foils.",
        longDescription: "Gamma+ Absolute Zero is an ultra-portable professional finishing shaver weighing a mere 130 grams. Features ultra-thin hypoallergenic gold titanium foils and an integrated pop-up sideburn trimmer, making it the ideal finishing and mobile barber tool.",
        keyBenefits: [
            "Ultra-light 130g featherweight design for ultimate portability",
            "Hypoallergenic gold titanium foils for zero-irritation skin close shaving",
            "Built-in retractable precision trimmer for sideburns and mustache lines",
            "120-minute runtime with USB charging versatility"
        ],
        howToUse: "Use foil head for skin smoothing on neck and cheeks. Pop up the rear trimmer to define sideburns and mustache edges.",
        recommendedFor: [
            "Mobile barbers, backstage stylists, and quick salon touch-ups",
            "Finishing necklines and sideburn edges"
        ],
        variants: ["Black / Gold"],
        image: "/images/products/gamma-plus/ABSOLUTE ZERO SHAVER/hero.webp",
        gallery: [
            "/images/products/gamma-plus/ABSOLUTE ZERO SHAVER/pendukung-1.webp",
            "/images/products/gamma-plus/ABSOLUTE ZERO SHAVER/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/ABSOLUTE ZERO SHAVER/pendukung-3.webp" }
        ]
    },
    {
        id: "x-horizon",
        name: "X-HORIZON",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "salon",
        description: "Revolutionary horizontal ergonomic digital hair dryer (120,000 RPM) with 1900W plasma ionizing technology.",
        longDescription: "Gamma+ X-Horizon redefines hair dryer ergonomics with its patented horizontal airflow architecture. Powered by a 120,000 RPM digital micro-motor and 1900W heating core, it balances center-of-gravity along the forearm to eradicate wrist tendon strain while ionizing plasma locks in hair moisture.",
        keyBenefits: [
            "Patented horizontal ergonomic design eliminates wrist and shoulder strain",
            "120,000 RPM digital brushless motor delivers immense air pressure",
            "Plasma ionizing system eliminates static frizz and boosts shine by 40%",
            "Ultra-quiet acoustic noise dampening for tranquil salon environments"
        ],
        howToUse: "Hold by balanced center grip. Select from 3 speed and 3 temperature settings. Use magnetic nozzles for precision directional smoothing or diffuser for natural curl definition.",
        recommendedFor: [
            "Busy salon stylists performing back-to-back blowouts all day",
            "Preventing repetitive strain injury (RSI) and carpal tunnel syndrome"
        ],
        variants: ["Rose Gold", "Matte Black"],
        image: "/images/products/gamma-plus/X-HORIZON/hero.webp",
        gallery: [
            "/images/products/gamma-plus/X-HORIZON/pendukung-1.webp",
            "/images/products/gamma-plus/X-HORIZON/pendukung-2.webp",
            "/images/products/gamma-plus/X-HORIZON/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/X-HORIZON/pendukung-4.webp" },
            { type: "technology", src: "/images/products/gamma-plus/X-HORIZON/pendukung-5.webp" },
            { type: "benefits", src: "/images/products/gamma-plus/X-HORIZON/pendukung-6.webp" }
        ]
    },
    {
        id: "xcell-s",
        name: "XCELL S",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "salon",
        description: "Next-generation digital dryer with acoustic noise reduction, 4 precision nozzles, and smart LED interface.",
        longDescription: "The Gamma+ Xcell S is an evolution in luxury digital hair dryers. Featuring a 110,000 RPM micro-brushless motor, advanced sound-wave dampening acoustics, and smart LED status display, it dries hair 70% faster while operating at whisper-quiet sound levels.",
        keyBenefits: [
            "110,000 RPM digital brushless motor for lightning-fast dry times",
            "Acoustic noise reduction technology ensures quiet salon operation",
            "Smart LED control panel with 12 heat/speed combinations",
            "Includes 4 interchangeable magnetic nozzles and snap-on diffuser"
        ],
        howToUse: "Attach desired magnetic styling nozzle. Adjust digital heat and airflow using intuitive rear LED switches. Lock in cold shot button to set final style.",
        recommendedFor: [
            "High-end luxury salons, precision blowouts, and editorial styling",
            "Stylists seeking the quietest high-power digital dryer"
        ],
        variants: ["Rose Gold", "Matte Black", "Silver"],
        image: "/images/products/gamma-plus/XCELL S/hero.webp",
        gallery: [
            "/images/products/gamma-plus/XCELL S/pendukung-1.webp",
            "/images/products/gamma-plus/XCELL S/pendukung-2.webp",
            "/images/products/gamma-plus/XCELL S/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/XCELL S/pendukung-4.webp" },
            { type: "technology", src: "/images/products/gamma-plus/XCELL S/pendukung-5.webp" },
            { type: "benefits", src: "/images/products/gamma-plus/XCELL S/pendukung-6.webp" }
        ]
    },
    {
        id: "x-hybrid-compact",
        name: "X-HYBRID COMPACT",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "salon",
        description: "Hybrid brushless motor dryer combining compact salon form factor with 110,000 RPM gale-force airflow.",
        longDescription: "Gamma+ X-Hybrid Compact merges ultra-compact travel proportions with heavy-duty salon power. Its 110,000 RPM hybrid brushless motor pushes immense air pressure through a short barrel, optimizing styling agility and reducing arm fatigue.",
        keyBenefits: [
            "Compact short-barrel silhouette enables close styling maneuverability",
            "110,000 RPM hybrid brushless motor for rapid water evaporation",
            "Triple removable mesh filter for easy salon maintenance",
            "Ion generator seals cuticles for frizz-free glossy results"
        ],
        howToUse: "Hold close to sections for concentrated smoothing. Clean rear removable filter daily to ensure continuous gale airflow.",
        recommendedFor: [
            "Stylists working in compact salon spaces or requiring mobile agility",
            "Fast precision blowouts"
        ],
        variants: ["Matte Black", "White Teal", "Rose Gold"],
        image: "/images/products/gamma-plus/X-HYBRID COMPACT/hero.webp",
        gallery: [
            "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-1.webp",
            "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-2.webp",
            "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-3.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-4.webp" },
            { type: "technology", src: "/images/products/gamma-plus/X-HYBRID COMPACT/pendukung-5.webp" }
        ]
    },
    {
        id: "i.e.s.-light",
        name: "I.E.S. LIGHT",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "salon",
        description: "Eco-efficient professional dryer consuming only 1450W while delivering 2200W equivalent wind speed.",
        longDescription: "Gamma+ I.E.S. (Intelligent Energy Saving) Light is engineered for modern eco-conscious salons. By optimizing aerodynamic internal airflow channels, it delivers the drying speed and heat of a 2200W commercial dryer while drawing only 1450W, cutting salon electricity costs by up to 35%.",
        keyBenefits: [
            "Saves up to 35% in salon electrical consumption (1450W power draw)",
            "Delivers airflow velocity comparable to heavy 2200W dryers",
            "Lightweight ergonomic chassis prevents shoulder fatigue",
            "Italian built high-endurance motor engineered for years of service"
        ],
        howToUse: "Use standard 2-speed, 3-heat switches to dry and style. Includes concentrator nozzle for directional smoothing.",
        recommendedFor: [
            "Salons aiming to lower monthly energy bills without sacrificing speed",
            "Daily high-volume blow-drying"
        ],
        variants: ["Eco Green", "Matte Black"],
        image: "/images/products/gamma-plus/I.E.S. LIGHT/hero.webp",
        gallery: [
            "/images/products/gamma-plus/I.E.S. LIGHT/pendukung-1.webp",
            "/images/products/gamma-plus/I.E.S. LIGHT/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/I.E.S. LIGHT/pendukung-3.webp" }
        ]
    },
    {
        id: "plasma",
        name: "PLASMA",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "salon",
        description: "Revolutionary bacterial sterilizing dryer with ozone/plasma emission that sanitizes hair & scalp while drying.",
        longDescription: "Gamma+ Plasma is the world's first professional dryer with active Ozone and Plasma discharge technology. As it dries, it emits active plasma ions with proven anti-bacterial and sanitizing properties that eliminate scalp pathogens, seal hair cuticles, and dramatically boost color longevity.",
        keyBenefits: [
            "Active ozone/plasma emission sanitizes hair and scalp skin",
            "Clinically proven anti-bacterial and anti-static action",
            "Closes cuticles completely for extreme mirror-like shine",
            "Powerful 2000W Italian motor ensures rapid drying"
        ],
        howToUse: "Turn on plasma switch for active therapeutic and sanitizing drying. Use round brush to polish lengths while plasma ions seal cuticles.",
        recommendedFor: [
            "Clients with irritated scalps, dandruff, or excess oiliness",
            "Post-color services to lock in pigments with ozone therapy"
        ],
        variants: ["Matte Black with Blue LED Halo"],
        image: "/images/products/gamma-plus/PLASMA/hero.webp",
        gallery: [
            "/images/products/gamma-plus/PLASMA/pendukung-1.webp",
            "/images/products/gamma-plus/PLASMA/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "technology", src: "/images/products/gamma-plus/PLASMA/pendukung-3.webp" }
        ]
    },
    {
        id: "l'italiano",
        name: "L'ITALIANO",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "salon",
        description: "Authentic Italian classic high-airflow AC motor dryer (2000W) with tourmaline ceramic grill.",
        longDescription: "Gamma+ L'Italiano celebrates authentic Italian salon craftsmanship. Powered by a robust long-life AC motor generating 2000W of heat and high-velocity wind, its tourmaline-infused front grill radiates far-infrared heat for smooth, frizz-free salon blowouts.",
        keyBenefits: [
            "Heavy-duty Italian AC motor built for over 2,000 hours of salon use",
            "Tourmaline ceramic grill radiates gentle far-infrared heat",
            "2000W power output delivers rapid drying through thickest hair",
            "Vibrant Italian vintage colorways with ergonomic ribbed grip"
        ],
        howToUse: "Select temperature and speed settings. Use narrow nozzle for tension smoothing with ceramic round brushes.",
        recommendedFor: [
            "Classic salon blowout services and coarse, thick hair drying",
            "Stylists looking for rock-solid Italian AC motor durability"
        ],
        variants: ["Classic Orange", "Classic Black", "Ocean Cyan"],
        image: "/images/products/gamma-plus/L'ITALIANO/hero.webp",
        gallery: [
            "/images/products/gamma-plus/L'ITALIANO/pendukung-1.webp",
            "/images/products/gamma-plus/L'ITALIANO/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/L'ITALIANO/pendukung-3.webp" }
        ]
    },
    {
        id: "donna+-keratin",
        name: "DONNA+ KERATIN",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "salon",
        description: "Microprocessor-controlled straightener with ceramic keratin-safe floating plates preserving moisture.",
        longDescription: "Gamma+ Donna+ Keratin is an intelligent flat iron engineered specifically for chemical keratin smoothing and straightening treatments. Controlled by a smart microprocessor that pulses temperature 50 times per second, it maintains exact heat across plates to protect hair moisture and prevent thermal damage.",
        keyBenefits: [
            "Smart microprocessor maintains stable temperature with zero heat drop",
            "Ceramic matrix plates infused with keratin-friendly diamond powder",
            "Adjustable digital temperature from 170°C to 230°C",
            "Floating rounded plates glide smoothly for straightening or curl creation"
        ],
        howToUse: "Set temperature (170°C for fine/bleached hair, 210°C-230°C for keratin seal-in). Pass slowly in thin sections for single-pass smoothing.",
        recommendedFor: [
            "Keratin smoothing treatments, chemical straightening, and silky sleek styles",
            "Preserving moisture in fragile color-treated hair"
        ],
        variants: ["Matte Gold / Black"],
        image: "/images/products/gamma-plus/DONNA+ KERATIN/hero.webp",
        gallery: [
            "/images/products/gamma-plus/DONNA+ KERATIN/pendukung-1.webp",
            "/images/products/gamma-plus/DONNA+ KERATIN/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/DONNA+ KERATIN/pendukung-3.webp" }
        ]
    },
    {
        id: "keratin-glory",
        name: "KERATIN GLORY",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "salon",
        description: "Extra-long mirror-finish titanium plates for speed styling and chemical keratin seal-in.",
        longDescription: "Gamma+ Keratin Glory features extra-long (120mm) mirror-polished titanium floating plates. Designed for high-speed salon workflow, the extended surface area allows wider hair sections per pass while instant MCH ceramic heating reaches 230°C in just 20 seconds.",
        keyBenefits: [
            "120mm extra-long mirror titanium plates speed up salon service time",
            "Instant MCH heating system reaches 230°C in under 20 seconds",
            "Ultra-smooth mirror glide eliminates snagging and hair pulling",
            "Rounded curved housing creates seamless glossy Hollywood curls"
        ],
        howToUse: "Section hair into 2-inch ribbons. Clamp and glide smoothly from roots to ends. Perfect for rapid keratin treatment seal-in passes.",
        recommendedFor: [
            "Professional salon keratin treatments, speed straightening, and curling",
            "Long, thick, and coarse hair textures"
        ],
        variants: ["Mirror Rose Gold", "Mirror Black", "Mirror Pink"],
        image: "/images/products/gamma-plus/KERATIN GLORY/hero.webp",
        gallery: [
            "/images/products/gamma-plus/KERATIN GLORY/pendukung-1.webp",
            "/images/products/gamma-plus/KERATIN GLORY/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/KERATIN GLORY/pendukung-3.webp" }
        ]
    },
    {
        id: "iron-bubble-rainbow",
        name: "IRON BUBBLE RAINBOW",
        brand: "Gamma+ Professional",
        category: "tools",
        audience: "salon",
        description: "Rainbow ion-coated bubble curling wand creating effortless beach waves and multi-textured curls.",
        longDescription: "Gamma+ Iron Bubble Rainbow is a specialized curling wand featuring an innovative grooved bubble barrel. The antistatic rainbow ion coating distributes even heat while the bubble shape allows hair to sit naturally into grooves for effortless, bouncy beach waves without creasing.",
        keyBenefits: [
            "Bubble barrel geometry creates natural, organic waves effortlessly",
            "Rainbow ion coating eliminates static electricity and locks in shine",
            "Heats rapidly up to 200°C with cool safety tip",
            "Ergonomic handle and 360-degree swivel cord for easy wrist movement"
        ],
        howToUse: "Wrap sections of hair around and between the bubble grooves. Hold for 5-8 seconds, then release. Rake through with fingers for effortless lived-in beach waves.",
        recommendedFor: [
            "Creating beach waves, editorial boho textures, and textured volume",
            "Salon editorial and bridal styling"
        ],
        variants: ["Rainbow Ion Chrome"],
        image: "/images/products/gamma-plus/IRON BUBBLE RAINBOW/hero.webp",
        gallery: [
            "/images/products/gamma-plus/IRON BUBBLE RAINBOW/pendukung-1.webp",
            "/images/products/gamma-plus/IRON BUBBLE RAINBOW/pendukung-2.webp"
        ],
        infoSlides: [
            { type: "features", src: "/images/products/gamma-plus/IRON BUBBLE RAINBOW/pendukung-3.webp" }
        ]
    },

    /* ═════════════════════════════════════════════════════════════════════
     * 5. ALFAPARF MILANO & FARMAVITA (ITALIAN COSMETIC SYSTEMS)
     * ═════════════════════════════════════════════════════════════════════ */
    {
        id: "semi-di-lino-sublime-cristalli",
        name: "SEMI DI LINO CRISTALLI LIQUIDI",
        brand: "Alfaparf Milano Professional",
        category: "hair-care",
        audience: "salon",
        description: "Iconic Italian universal beauty serum with Flaxseed Oil and Vitamin E for instant diamond illumination.",
        longDescription: "Alfaparf Milano Semi di Lino Cristalli Liquidi is the worldwide symbol of Italian hair illumination. Enriched with Flaxseed Oil (Linseed), Vitamin E, and the Urban Defence Pro anti-pollution shield, it creates an instant micro-crystalline light cloak over hair fibers, providing extreme shine, thermal protection, and anti-frizz defense.",
        keyBenefits: [
            "Instant diamond crystalline shine on all hair types",
            "Urban Defence Pro complex shields hair from environmental pollution",
            "Shine Fix & Color Fix complexes preserve cosmetic color brilliance",
            "Protects against humidity, frizz, and heat styling tools"
        ],
        howToUse: "Dispense 2-3 drops into palms. Apply evenly through lengths and ends on damp hair before drying, or on finished dry hair for dazzling diamond shine.",
        recommendedFor: [
            "All hair types seeking instant radiant shine and softness",
            "Signature salon finishing touch"
        ],
        variants: ["15ml", "30ml", "50ml"],
        image: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/hero.webp",
        gallery: [
            "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-1.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/montibello-gold-oil/GOLD OIL ESSENCE (Amber)/pendukung-2.webp" }
        ]
    },
    {
        id: "evolution-of-the-color-cube",
        name: "EVOLUTION OF THE COLOR CUBE 3D",
        brand: "Alfaparf Milano Professional",
        category: "hair-colour",
        audience: "salon",
        description: "Permanent cosmetic hair coloring cream with 3D technology, Hyaluronic Acid, and Multi-Lamellar Vehicles.",
        longDescription: "Alfaparf Evolution of the Color (EOC) is an Italian permanent coloring system featuring patented 3D technology: Multi-Lamellar Vehicles (MLV) that protect pigments during mixing, Hyaluronic Acid for continuous hydration, and pure Crystallized Micro-Pigments for 100% grey coverage and unparalleled color longevity.",
        keyBenefits: [
            "100% grey hair coverage with vibrant, true-to-tone reflection",
            "Hyaluronic acid maintains fiber hydration during coloring process",
            "Extremely low ammonia formulation preserves scalp comfort",
            "Over 120 intermixable shades for infinite creative formulation"
        ],
        howToUse: "Mix in 1:1.5 ratio with Alfaparf Oxid'o Developer (1:2 for Platinum High-Lift series). Process for 35-45 minutes. Rinse thoroughly and wash with color-locking shampoo.",
        recommendedFor: [
            "Complete grey coverage, creative fashion toning, and permanent color transformations",
            "Salons specializing in Italian high-fashion hair color"
        ],
        variants: ["60ml Tube — 120+ Shades"],
        image: "/images/products/montibello-hop/COLOUR LAST SHAMPOO/hero.webp",
        gallery: [
            "/images/products/montibello-hop/COLOUR LAST SHAMPOO/pendukung-1.webp"
        ],
        infoSlides: [
            { type: "technology", src: "/images/products/montibello-hop/COLOUR LAST SHAMPOO/pendukung-2.webp" }
        ]
    },
    {
        id: "lisse-design-keratin-therapy",
        name: "LISSE DESIGN KERATIN THERAPY",
        brand: "Alfaparf Milano Professional",
        category: "treatments",
        audience: "salon",
        description: "Formaldehyde-free progressive smoothing treatment with Babassu Oil and Kera-Collagen Complex.",
        longDescription: "Alfaparf Lisse Design Keratin Therapy is a 100% safe, formaldehyde-free smoothing treatment that provides smooth, frizz-free, manageable hair for up to 3 months. Combining precious Amazonian Babassu Oil with a heat-activated Kera-Collagen Complex, it rearranges keratin chains without breaking sulfur bonds.",
        keyBenefits: [
            "100% formaldehyde-free and fully compliant with international safety standards",
            "Long-lasting smoothing and anti-frizz results for up to 3 months",
            "Precious Babassu oil leaves hair extraordinarily soft, silky, and shiny",
            "Completely safe for color-treated and bleached hair"
        ],
        howToUse: "1. Wash twice with Deep Cleansing Shampoo. 2. Blow dry hair completely. 3. Apply Smoothing Mousse/Fluid section by section. 4. Process for 20 minutes. 5. Blow dry and flat iron (200°C-215°C) 6-8 times per section. 6. Rinse and apply Rehydrating Mask.",
        recommendedFor: [
            "Rebellious, curly, frizzy, and unmanageable hair wanting progressive smoothness",
            "Premium salon keratin smoothing services"
        ],
        variants: ["500ml Express Kit"],
        image: "/images/products/core/CONTROL BASE/hero.webp",
        gallery: [
            "/images/products/core/CONTROL BASE/pendukung-1.webp"
        ],
        infoSlides: [
            { type: "application", src: "/images/products/core/CONTROL BASE/pendukung-2.webp" }
        ]
    },
    {
        id: "farmavita-life-color-plus",
        name: "LIFE COLOR PLUS",
        brand: "Farmavita",
        category: "hair-colour",
        audience: "salon",
        description: "Mineral-rich permanent coloring with Brazil Nut oligopeptides and Excelsa Hp technology.",
        longDescription: "Farmavita Life Color Plus is an Italian permanent cosmetic coloring cream powered by Excelsa Hp technology. Enzymatic oligopeptides extracted from Brazil Nuts penetrate deep into hair fibers, binding water molecules to maintain internal hydration while locking in intense, luminous pigments with 100% grey coverage.",
        keyBenefits: [
            "100% white hair coverage with deep, rich pigment penetration",
            "Brazil nut oligopeptides maintain hydration and cuticle smoothness",
            "Low ammonia formula enriched with soothing anti-irritant agents",
            "Exceptional shine, vibrant durability, and resistance to fading"
        ],
        howToUse: "Mix 1:1.5 with Farmavita Cream Developer (1:2 for Super-Lighteners). Apply on dry, unwashed hair. Process for 30-40 minutes. Emulsify with warm water, rinse, and shampoo.",
        recommendedFor: [
            "Total grey coverage, rich brunette bases, and luminous Italian fashion shades",
            "Salon colorists seeking balanced mineral color formulation"
        ],
        variants: ["100ml Tube — 110+ Shades"],
        image: "/images/products/montibello-hop/COLOUR LAST MASK/hero.webp",
        gallery: [
            "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-1.webp"
        ],
        infoSlides: [
            { type: "technology", src: "/images/products/montibello-hop/COLOUR LAST MASK/pendukung-2.webp" }
        ]
    },
    {
        id: "farmavita-omniplex-system",
        name: "OMNIPLEX SYSTEM",
        brand: "Farmavita",
        category: "treatments",
        audience: "salon",
        description: "Molecular bond multiplying and structural restructuring complex for bleaching and coloring.",
        longDescription: "Farmavita Omniplex is an innovative molecular bond multiplier that prevents and repairs structural hair damage during chemical services (bleaching, coloring, straightening, and perming). Utilizing active amino-bond polymers, it restores broken disulfide bonds, drastically improving tensile strength.",
        keyBenefits: [
            "Prevents hair breakage during extreme bleaching and high-lift coloring",
            "Rebuilds broken disulfide bonds and restores tensile elasticity",
            "Compatible with all salon chemical brands without altering processing time",
            "Leaves hair visibly thicker, healthier, and reinforced"
        ],
        howToUse: "Omniplex n.1 (Bond Maker): Mix directly into bleach powder or hair color formulation. Omniplex n.2 (Bond Reinforcer): Apply after rinsing chemical service, leave for 5-10 minutes, then shampoo and condition.",
        recommendedFor: [
            "Mandatory shield during high-lift bleaching and platinum transformations",
            "Standalone deep bond-reconstruction treatments"
        ],
        variants: ["Set n.1 (100ml) + n.2 (100ml)", "Professional 500ml Salon Pack"],
        image: "/images/products/core/ALKALI REMOVER/hero.webp",
        gallery: [
            "/images/products/core/ALKALI REMOVER/pendukung-1.webp"
        ],
        infoSlides: [
            { type: "benefits", src: "/images/products/core/ALKALI REMOVER/pendukung-2.webp" }
        ]
    }
];

export function getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
}

export function getAllProductIds(): string[] {
    return products.map((p) => p.id);
}

export function getProductsByCategory(category: string): Product[] {
    if (category === "all") return products;
    return products.filter((p) => p.category === category);
}

export function getProductsByBrand(brand: string): Product[] {
    return products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
    const current = getProductById(currentId);
    if (!current) return products.slice(0, limit);

    return products
        .filter((p) => p.id !== currentId && (p.brand === current.brand || p.category === current.category))
        .slice(0, limit);
}

export interface CatalogProduct extends Product {
    price?: number;
    formattedPrice?: string;
    packagingType?: string;
    material?: string;
    inStock?: boolean;
}

export const categoryPills = [
    { id: "all", label: "All Products" },
    { id: "hair-care", label: "Hair Care" },
    { id: "treatments", label: "Treatments" },
    { id: "hair-colour", label: "Hair Colour" },
    { id: "styling", label: "Styling" },
    { id: "tools", label: "Tools & Equipment" },
    { id: "barber", label: "Barber Essentials" },
];

export const brandFacets = [
    "CORE",
    "Alfaparf Milano Professional",
    "Montibello",
    "Farmavita",
    "Gamma+ Professional",
];

export const audienceFacets = [
    { id: "salon", label: "Professional Salon" },
    { id: "barber", label: "Barber Shop" },
    { id: "both", label: "Universal / All" },
];

export const catalogProducts: CatalogProduct[] = products.map((p, idx) => {
    const basePrice = 145000 + (idx * 35000) % 650000;
    return {
        ...p,
        price: basePrice,
        formattedPrice: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(basePrice),
        inStock: true,
        isNew: idx % 3 === 0,
    };
});
