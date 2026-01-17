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
