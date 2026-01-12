import type { Metadata } from "next";

import CTASection from "@/components/site/CTASection";
import Pillars from "@/components/site/Pillars";
import ProductHighlights from "@/components/site/ProductHighlights";
import HomeHero from "@/components/home/HomeHero";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const basePath = `/${locale}`;

  return {
    alternates: {
      canonical: basePath,
      languages: {
        en: "/en",
        id: "/id",
      },
    },
  };
}

export default function LocalizedHome() {
  return (
    <div className="space-y-14">
      <HomeHero />
      <Pillars />
      <ProductHighlights />
      <CTASection />
    </div>
  );
}
