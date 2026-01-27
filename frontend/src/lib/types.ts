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
  categories?: string[];
  summary: string;
  benefits: string[];
  howToUse: string;
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
