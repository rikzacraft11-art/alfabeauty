import type { Metadata } from "next";

import StaggerReveal from "@/components/ui/StaggerReveal";
import ParallaxImage from "@/components/ui/ParallaxImage";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import Footer from "@/components/layout/Footer";
import { normalizeLocale, t } from "@/lib/i18n";


/**
 * V2 Homepage
 * Design V2: Elegant Professional + Montserrat + Ineo-Sense Motion
 * Now serving at root [locale] path.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved = normalizeLocale(locale);
  const tx = t(resolved);

  return {
    title: tx.nav.home,
    description: tx.seo.homeDescription,
    alternates: {
      canonical: `/${resolved}`,
      languages: {
        en: "/en",
        id: "/id",
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolved = normalizeLocale(locale);
  const tx = t(resolved);
  const base = `/${resolved}`;
  const isId = resolved === "id";

  return (
    <div className="min-h-screen">
      {/* Hero Section (Video First) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-panel">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero/hero-salon.jpg"
            aria-hidden="true"
          >
            <source src="/videos/hero-salon.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-cover bg-center motion-safe:hidden"
            style={{ backgroundImage: "url(/images/hero/hero-salon.jpg)" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-background/55" aria-hidden="true" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Text Column */}
            <div className="lg:col-span-7">
              <StaggerReveal delay={0.2} staggerDelay={0.15}>
                <p className="type-kicker text-muted mb-6">
                  {tx.home.hero.kicker}
                </p>
                <h1 className="type-hero text-foreground mb-6 whitespace-normal">
                  {tx.home.hero.title}
                </h1>
                <p className="type-hero-body text-foreground-muted max-w-2xl mb-10">
                  {tx.home.hero.lede}
                </p>
                {tx.home.hero.points?.length ? (
                  <ul className="space-y-3 mb-10">
                    {tx.home.hero.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="text-foreground mt-1">•</span>
                        <span className="type-body text-foreground-muted">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="flex flex-wrap gap-4" data-testid="hero-cta-container">
                  <a
                    href="#brands"
                    className="ui-btn-primary px-8 py-4 type-nav rounded-full transition-all duration-[var(--transition-elegant)]"
                    data-testid="cta-explore-brands"
                  >
                    {tx.home.hero.ctaExplore}
                  </a>
                  <a
                    href="#partner"
                    className="ui-btn-secondary px-8 py-4 type-nav rounded-full transition-all duration-[var(--transition-elegant)]"
                    data-testid="cta-partner-with-us"
                  >
                    {tx.home.hero.ctaPartner}
                  </a>
                </div>
              </StaggerReveal>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <StaggerReveal delay={0.1}>
            <p className="type-kicker text-muted mb-4">{tx.home.about.kicker}</p>
            <h2 className="type-h1 text-foreground mb-8 max-w-4xl">
              {tx.home.about.title}
            </h2>
            <p className="type-body text-foreground-muted max-w-3xl mb-12">
              {tx.home.about.body}
            </p>

            {/* 3 Pillars */}
            <div className="grid md:grid-cols-3 gap-8">
              {tx.home.about.pillars.map((pillar) => (
                <div key={pillar.title} className="p-6 rounded-2xl bg-panel" style={{ boxShadow: "var(--shadow-elegant)" }}>
                  <div className="type-h2 mb-4">{pillar.icon}</div>
                  <h3 className="type-h3 text-foreground mb-2">{pillar.title}</h3>
                  <p className="type-body text-muted">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-24 lg:py-32 bg-panel">
        <div className="container mx-auto px-6 lg:px-12">
          <StaggerReveal delay={0.1}>
            <p className="type-kicker text-muted mb-4">{tx.home.brands.kicker}</p>
            <h2 className="type-h1 text-foreground mb-12">
              {tx.home.brands.title}
            </h2>
            <p className="type-body text-foreground-muted max-w-3xl mb-12">
              {tx.home.brands.body}
            </p>

            {/* Brand Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { name: "Alfaparf Milano Professional", country: isId ? "Italia" : "Italy", slug: "alfaparf" },
                  { name: "Farmavita", country: isId ? "Italia" : "Italy", slug: "farmavita" },
                  { name: "Montibello", country: isId ? "Spanyol" : "Spain", slug: "montibello" },
                  { name: "Gamma+ Professional", country: isId ? "Italia" : "Italy", slug: "gammaplus" },
                ].map((brand) => (
                <AppLink
                  key={brand.name}
                  href={`${base}/products?brand=${brand.slug}`}
                  className="group p-8 rounded-2xl bg-background transition-all duration-[var(--transition-elegant)] hover:scale-105 block"
                  style={{ boxShadow: "var(--shadow-elegant)" }}
                >
                  <div className="aspect-video flex items-center justify-center bg-zinc-100 rounded-lg mb-4">
                    <span className="type-ui-sm text-muted">{tx.home.brands.logoLabel}</span>
                  </div>
                  <h3 className="type-h4 text-foreground">{brand.name}</h3>
                  <p className="type-data text-muted">{brand.country}</p>
                </AppLink>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <StaggerReveal delay={0.1}>
              <p className="type-kicker text-muted mb-4">{tx.home.education.kicker}</p>
              <h2 className="type-h1 text-foreground mb-6">
                {tx.home.education.title}
              </h2>
              <p className="type-body text-foreground-muted mb-8">
                {tx.home.education.body}
              </p>

              <ul className="space-y-4">
                {tx.home.education.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="type-body text-foreground-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="type-body text-foreground-muted mt-6">
                {tx.home.education.note}
              </p>

              {/* CTA Button - DEV-20 */}
              <div className="mt-8">
                <ButtonLink
                  href={`${base}/education`}
                  variant="primary"
                  className="px-8 py-4 type-nav rounded-full inline-block transition-all duration-[var(--transition-elegant)]"
                >
                  {tx.home.education.ctaLabel}
                </ButtonLink>
              </div>
            </StaggerReveal>

            {/* Education Image - DEV-21 Parallax */}
            <ParallaxImage
              src="/images/education/training-placeholder.jpg"
              alt={tx.home.education.imageAlt}
              className="aspect-square rounded-3xl overflow-hidden"
              speed={0.15}
            />
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partner" className="py-24 lg:py-32 bg-panel">
        <div className="container mx-auto px-6 lg:px-12">
          <StaggerReveal delay={0.1}>
            <p className="type-kicker text-muted mb-4 text-center">{tx.home.partnership.kicker}</p>
            <h2 className="type-h1 text-foreground mb-16 text-center">
              {tx.home.partnership.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* For Principals */}
              <div className="p-8 rounded-3xl bg-background" style={{ boxShadow: "var(--shadow-elegant)" }}>
                <h3 className="type-h2 text-foreground mb-6">{tx.home.partnership.principalsTitle}</h3>
                <ul className="space-y-4">
                  {tx.home.partnership.principalsBullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-foreground mt-1">•</span>
                      <span className="type-body text-foreground-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Salons and Barbers */}
              <div className="p-8 rounded-3xl bg-background" style={{ boxShadow: "var(--shadow-elegant)" }}>
                <h3 className="type-h2 text-foreground mb-6">{tx.home.partnership.salonsTitle}</h3>
                <ul className="space-y-4">
                  {tx.home.partnership.salonsBullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-foreground mt-1">•</span>
                      <span className="type-body text-foreground-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <ButtonLink
                href={`${base}/partnership`}
                variant="primary"
                className="px-10 py-4 type-nav rounded-full transition-all duration-[var(--transition-elegant)] inline-block"
              >
                {tx.home.partnership.ctaLabel}
              </ButtonLink>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-24 lg:py-32 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <StaggerReveal>
            <p className="type-h2 max-w-4xl mx-auto">
              {tx.home.closing.body}
            </p>
          </StaggerReveal>
        </div>
      </section>

      <Footer />
    </div >
  );
}
