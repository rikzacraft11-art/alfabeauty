import type { Metadata } from "next";
import {
  HeroShopCluster,
  SolutionsSection,
  InfoSection,
  BrandShowroom,
  StandardsSection,
  FAQSection,
  PreFooterCTA,
} from "@/features/home";

export const metadata: Metadata = {
  title: {
    absolute: "PT Alfa Beauty Cosmetica — Professional Haircare Distribution",
  },
  description:
    "Exclusive importer and distributor of leading Italian and Spanish professional haircare brands, serving Indonesia's salon and barber industry for over 18 years.",
  alternates: { canonical: "/" },
};

export default function HomePage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background">
      {/* ─── Section 1 (Hero) & Section 2 (Shop CTA) Pure Black Canvas ─── */}
      <HeroShopCluster />

      {/* ─── Section 3: Salon & Haircare Solutions ─── */}
      <SolutionsSection />

      {/* ─── Section 4: Excellence, Mission & Vision ─── */}
      <InfoSection />

      {/* ─── Section 5: High-Fashion Editorial Brand Showcase ─── */}
      <BrandShowroom />

      {/* ─── Section 6: Quality & Product Standards ─── */}
      <StandardsSection />

      {/* ─── Section 7: Frequently Asked Questions ─── */}
      <FAQSection />

      {/* ─── Section 8: Pre-Footer CTA (Elevate Your Craft) ─── */}
      <PreFooterCTA />
    </main>
  );
}
