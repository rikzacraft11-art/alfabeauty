/* ─────────────────────────────────────────────────────────────────────
 * Site Configuration — Single Source of Truth
 *
 * All hardcoded values (contact info, social links, brand data, etc.)
 * are centralized here. Components import from this file instead of
 * duplicating data.
 *
 * Reference: docs/reference.md §1, §5
 * ───────────────────────────────────────────────────────────────────── */

// ── Global Official Brand Color Palette Dictionary ──
export const BRAND_COLORS = {
  maroon: "#5D221C",   // Deep Maroon / Burgundy (Section 6, Maklon, Luxury Accents)
  crimson: "#D9403A",  // Scarlet / Crimson Red (Primary CTA, Active Underlines, Hover States)
  gold: "#EABD68",     // Champagne Gold / Warm Amber (LED Halo, Badges, Highlights)
  green: "#1F9849",    // Emerald Green (WhatsApp, Contact Accent on Black/White/Gold)
  black: "#000000",    // Obsidian Black (Base Canvas, Typography, Dark Panels)
  white: "#FFFFFF",    // Pure White (Base Canvas, Clean Cards)
  charcoal: "#111111", // Dark Surface / Elevated Glass
} as const;

// ── Contact ──

export const SITE_NAME = "PT Alfa Beauty Cosmetica" as const;
export const SITE_SHORT_NAME = "Alfa Beauty" as const;
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "https://alfabeauty.co.id";
export const ESTABLISHED_YEAR = 2007 as const;
export const YEARS_OF_EXPERIENCE = `${new Date().getFullYear() - ESTABLISHED_YEAR}+` as const;
export const CONTACT_EMAIL = "alfabeautycosmeticaa@gmail.com" as const;
export const WHATSAPP_NUMBER = "628151168745" as const;
export const WHATSAPP_DISPLAY = "+62 815-116-8745" as const;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}` as const;
export const INSTAGRAM_HANDLE = "alfabeautycosmetica" as const;
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}` as const;

// ── Address ──
export const SITE_ADDRESS = "Jakarta, Indonesia" as const;

// ── Operating Hours ──
export const OPERATING_HOURS = {
  days: "Monday – Friday",
  hours: "09:00 – 17:00 WIB",
  note: "Saturday, Sunday & National Holidays — Closed",
} as const;

// ── Navigation ──

export const NAV_LINKS = {
  home: "/",
  shop: "/shop",
  products: "/products",
  brands: "/brands",
  education: "/education",
  partnership: "/partnership",
  about: "/about",
  contact: "/contact",
  blog: "/blog",
  faq: "/faq",
  cart: "/cart",
  checkout: "/checkout",
  myAccount: "/my-account",
  login: "/login",
  register: "/register",
  privacy: "/privacy",
  terms: "/terms",
} as const;

// ── Commerce Constants ──

export const CURRENCY_CODE = "IDR" as const;
export const CURRENCY_SYMBOL = "Rp" as const;
export const TAX_RATE = 0.11 as const; // PPN 11%
export const FREE_SHIPPING_THRESHOLD = 500_000 as const; // Rp 500.000
export const PAYMENT_GATEWAY = "midtrans" as const;

// ── Brand Portfolio (reference.md §3) ──

export type Brand = {
  name: string;
  origin: string;
  flag: string;
  logo: string;
  category: string;
  description: string;
};

export const BRANDS: Brand[] = [
  {
    name: "Alfaparf Milano Professional",
    origin: "Italy",
    flag: "🇮🇹",
    logo: "/images/brands/alfaparf-milano.webp",
    category: "Complete Professional Haircare",
    description:
      "A global leader in professional hair colour, care, and styling. Trusted by top salons worldwide for innovation and performance.",
  },
  {
    name: "Farmavita",
    origin: "Italy",
    flag: "🇮🇹",
    logo: "/images/brands/farmavita.webp",
    category: "Professional Hair Colour & Care",
    description:
      "Italian excellence in professional haircare, offering a comprehensive range of colour, treatments, and styling solutions since 1950.",
  },
  {
    name: "Montibello",
    origin: "Spain",
    flag: "🇪🇸",
    logo: "/images/brands/montibello.webp",
    category: "Premium Hair Care & Treatment",
    description:
      "Spanish heritage brand combining Mediterranean botanicals with cutting-edge technology for premium salon results.",
  },
  {
    name: "Gamma+ Professional",
    origin: "Italy",
    flag: "🇮🇹",
    logo: "/images/brands/gamma-plus.webp",
    category: "Professional Tools & Equipment",
    description:
      "Precision-engineered professional tools for barbers and stylists. Performance, durability, and ergonomic design.",
  },
  {
    name: "CORE",
    origin: "Japan",
    flag: "🇯🇵",
    logo: "/images/brands/core.webp",
    category: "Professional Perm & Care Solutions",
    description:
      "Advanced formulation systems for professional salon perm, alkali control, and hair restoration.",
  },
];

// ── Product Categories ──

export const PRODUCT_CATEGORIES = [
  "Hair Colour",
  "Hair Care",
  "Styling",
  "Treatments",
  "Tools & Equipment",
  "Barber Essentials",
] as const;

// ── Three Pillars (used in footer, navigation, etc.) ──

export const PILLARS = [
  {
    label: "Shop",
    href: NAV_LINKS.shop,
    description:
      "Browse and purchase professional haircare products online.",
  },
  {
    label: "Brands",
    href: NAV_LINKS.brands,
    description:
      "Professional haircare products from globally recognized brands.",
  },
  {
    label: "Education",
    href: NAV_LINKS.education,
    description: "Technical training and professional development programs.",
  },
  {
    label: "Partnership",
    href: NAV_LINKS.partnership,
    description: "Strategic partnerships for salons and barbershops.",
  },
] as const;

// ── Legal Links ──

export const LEGAL_LINKS = [
  { label: "Contact Us", href: NAV_LINKS.contact },
  { label: "Privacy Policy", href: NAV_LINKS.privacy },
  { label: "Terms & Conditions", href: NAV_LINKS.terms },
] as const;
