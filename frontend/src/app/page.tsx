import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import {
  HeroShopCluster,
  SolutionsSection,
  InfoSection,
  BrandShowroom,
  StandardsSection,
  FAQSection,
  DEFAULT_FAQ,
  PreFooterCTA,
} from "@/features/home";
import { JsonLd } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const HOME_TITLE = `${SITE_NAME} — Distributor Resmi Produk Salon & Hair Academy`;
const HOME_DESCRIPTION =
  "Importir eksklusif dan distributor resmi produk perawatan rambut profesional Eropa (Alfaparf Milano, Montibello, Farmavita, Gamma+ Più) serta pusat pelatihan salon berlisensi resmi di Indonesia.";

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: { canonical: baseUrl },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/#webpage`,
      url: baseUrl,
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      isPartOf: {
        "@id": `${baseUrl}/#website`,
      },
      about: {
        "@id": `${baseUrl}/#organization`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}/#faq`,
      name: `Frequently Asked Questions — ${SITE_NAME}`,
      mainEntity: DEFAULT_FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function HomePage(): React.JSX.Element {
  return (
    <main id="main-content" className="relative z-10 bg-background">
      <JsonLd data={homeJsonLd} />
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
