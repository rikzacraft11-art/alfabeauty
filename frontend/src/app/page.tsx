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
    absolute: "PT Alfa Beauty Cosmetica — Distributor Resmi Produk Salon & Hair Academy",
  },
  description:
    "Importir eksklusif dan distributor resmi produk perawatan rambut profesional Eropa (Alfaparf Milano, Montibello, Farmavita, Gamma+ Più) serta pusat pelatihan salon berlisensi resmi di Indonesia.",
  alternates: { canonical: "/" },
};

export default function HomePage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background">
      {/* ─── Section 1 (Hero) & Section 2 (Shop CTA) ─── */}
      <HeroShopCluster />

      {/* ─── Section 3: High-Fashion Editorial Brand Showcase ─── */}
      <BrandShowroom />

      {/* ─── Section 4: Excellence, Mission & Vision ─── */}
      <InfoSection />

      {/* ─── Section 5: Salon & Haircare Solutions ─── */}
      <SolutionsSection />

      {/* ─── Section 6: Quality & Product Standards ─── */}
      <StandardsSection />

      {/* ─── Section 7: Frequently Asked Questions ─── */}
      <FAQSection />

      {/* ─── Section 8: Pre-Footer CTA (Elevate Your Craft) ─── */}
      <PreFooterCTA />
    </main>
  );
}
