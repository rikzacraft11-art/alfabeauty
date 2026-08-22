import type { Metadata } from "next";
import {
  HeroShopCluster,
  SolutionsSection,
  InfoSection,
  NewProductsSection,
  CustomMaklonCTA,
  StandardsSection,
  FAQSection,
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
      {/* ─── Continuous Section 1 (Hero) & Section 2 (Shop CTA) Pure Black Canvas with Flowing Hair Strand ─── */}
      <HeroShopCluster />

      {/* ─── Section 3: Salon & Haircare Solutions (1:1 Yucca .section-solutions) ─── */}
      <SolutionsSection />

      {/* ─── Section 4: Excellence, Mission & Vision (1:1 Yucca .section-info) ─── */}
      <InfoSection />

      {/* ─── Section 5: New Products Shelf (1:1 Yucca .section-products) ─── */}
      <NewProductsSection />

      {/* ─── Section 6: Custom Formulations & Maklon CTA (1:1 Yucca .section-cta-main) ─── */}
      <CustomMaklonCTA />

      {/* ─── Section 7: Quality & Product Standards (1:1 Yucca .section-standards) ─── */}
      <StandardsSection />

      {/* ─── Section 8: Frequently Asked Questions (1:1 Yucca .section-faq) ─── */}
      <FAQSection />
    </main>
  );
}
