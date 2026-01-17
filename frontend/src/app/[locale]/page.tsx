import type { Metadata } from "next";

import CTASection from "@/components/site/CTASection";
import Pillars from "@/components/site/Pillars";
import HomeHero from "@/components/home/HomeHero";
import HeroImageStrip from "@/components/home/HeroImageStrip";
import BrandPortfolio from "@/components/home/BrandPortfolio";
import EditorialCarouselSection from "@/components/home/EditorialCarouselSection";
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

      {/* Pillars Section - clarify what the site offers early */}
      <section className="py-12 sm:py-14 lg:py-16">
        <div className="px-4 sm:px-6 lg:px-10 max-w-[120rem] mx-auto">
          <Pillars />
        </div>
      </section>

      {/* Category Image Strip - Boxed, horizontal scroll on mobile */}
      <HeroImageStrip />

      {/* Editorial + Carousel Section - Professional Products */}
      <EditorialCarouselSection
        heroImage="/images/hero/hero-salon.jpg"
        kicker={productsSection.kicker}
        title={productsSection.title}
        description={productsSection.description}
        variant="dark"
        ctaHref={`${base}/products`}
        ctaLabel={locale === "id" ? "Lihat semua produk" : "View all products"}
      />

      {/* Brand Portfolio - Logo grid */}
      <div className="py-12 sm:py-16 bg-subtle">
        <div className="px-4 sm:px-6 lg:px-10 max-w-[120rem] mx-auto">
          <BrandPortfolio />
        </div>
      </div>

      {/* CTA Section - Full width */}
      <CTASection />
    </div>
  );
}

