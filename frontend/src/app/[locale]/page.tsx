import type { Metadata } from "next";

import HomeHero from "@/components/home/HomeHero";
import HeroImageStrip from "@/components/home/HeroImageStrip";
import BrandPortfolio from "@/components/home/BrandPortfolio";
import EditorialCarouselSection from "@/components/home/EditorialCarouselSection";
import { ServicesExperience } from "@/components/services-experience";
import type { Locale } from "@/lib/i18n";
import { getEditorialSection } from "@/content/homepage";

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

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const productsSection = getEditorialSection(locale, "products");
  const base = `/${locale}`;

  return (
    <div className="space-y-0">
      {/* Hero Section - Full-bleed video with text overlay */}
      <HomeHero />

      {/* === E-CATALOG DISCOVERY ZONE === */}

      {/* Category Image Strip - Immediate product discovery after hero */}
      <HeroImageStrip />

      {/* Editorial + Carousel Section - Featured Products (core e-catalog value) */}
      {/* NOTE: heroImage removed - this section now visually attaches to HeroImageStrip's dynamic banner */}
      <EditorialCarouselSection
        kicker={productsSection.kicker}
        title={productsSection.title}
        description={productsSection.description}
        variant="dark"
        ctaHref={`${base}/products`}
        ctaLabel={locale === "id" ? "Lihat semua produk" : "View all products"}
      />

      {/* === TRUST & VALUE REINFORCEMENT ZONE === */}

      {/* Brand Portfolio - Trust signal after seeing products */}
      <div className="bg-subtle border-b border-border">
        <div className="px-4 sm:px-6 lg:px-10 max-w-[120rem] mx-auto py-8 sm:py-10">
          <BrandPortfolio />
        </div>
      </div>

      {/* Services Experience - Immersive full-viewport service showcase */}
      <ServicesExperience />
    </div>
  );
}




