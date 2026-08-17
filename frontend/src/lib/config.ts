/* ─────────────────────────────────────────────────────────────────────
 * Site Configuration — Single Source of Truth
 *
 * All hardcoded values (contact info, social links, brand data, etc.)
 * are centralized here. Components import from this file instead of
 * duplicating data.
 *
 * Reference: docs/reference.md §1, §5
 * ───────────────────────────────────────────────────────────────────── */

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
  products: "/products",
  education: "/education",
  partnership: "/partnership",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
} as const;

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
    label: "Products",
    href: NAV_LINKS.products,
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
