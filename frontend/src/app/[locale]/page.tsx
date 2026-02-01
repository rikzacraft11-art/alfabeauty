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
  const base = `/${resolved}`;

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
                  PT Alfa Beauty Cosmetica
                </p>
                <h1 className="type-hero text-foreground mb-6 whitespace-normal">
                  Connecting Global Hair Innovation to Indonesia&apos;s Salon Professionals
                </h1>
                <p className="type-hero-body text-foreground-muted max-w-2xl mb-10">
                  Exclusive importer and distributor of leading Italian and Spanish professional haircare brands, serving Indonesia&apos;s salon industry for over 15 years.
                </p>
                <div className="flex flex-wrap gap-4" data-testid="hero-cta-container">
                  <a
                    href="#brands"
                    className="ui-btn-primary px-8 py-4 type-nav rounded-full transition-all duration-[var(--transition-elegant)]"
                    data-testid="cta-explore-brands"
                  >
                    Explore Our Brands
                  </a>
                  <a
                    href="#partner"
                    className="ui-btn-secondary px-8 py-4 type-nav rounded-full transition-all duration-[var(--transition-elegant)]"
                    data-testid="cta-partner-with-us"
                  >
                    Partner With Us
                  </a>
                </div>
              </StaggerReveal>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      < section id="about" className="py-24 lg:py-32 bg-background" >
        <div className="container mx-auto px-6 lg:px-12">
          <StaggerReveal delay={0.1}>
            <p className="type-kicker text-muted mb-4">About Us</p>
            <h2 className="type-h1 text-foreground mb-8 max-w-4xl">
              More Than a Distributor
            </h2>
            <p className="type-body text-foreground-muted max-w-3xl mb-12">
              PT Alfa Beauty Cosmetica is a professional haircare distribution company specializing in salon products and solutions. With nationwide coverage and more than 15 years of experience, we represent globally recognized professional hair brands and deliver them to the Indonesian market through a structured, reliable, and long-term partnership approach.
            </p>

            {/* 3 Pillars */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-panel" style={{ boxShadow: "var(--shadow-elegant)" }}>
                <div className="type-h2 mb-4">🌐</div>
                <h3 className="type-h3 text-foreground mb-2">Connect</h3>
                <p className="type-body text-muted">
                  Connecting global innovation with local market needs.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-panel" style={{ boxShadow: "var(--shadow-elegant)" }}>
                <div className="type-h2 mb-4">📚</div>
                <h3 className="type-h3 text-foreground mb-2">Build</h3>
                <p className="type-body text-muted">
                  Building brands through education and technical excellence.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-panel" style={{ boxShadow: "var(--shadow-elegant)" }}>
                <div className="type-h2 mb-4">🌱</div>
                <h3 className="type-h3 text-foreground mb-2">Support</h3>
                <p className="type-body text-muted">
                  Supporting sustainable growth for salons and professionals.
                </p>
              </div>
            </div>
          </StaggerReveal>
        </div>
      </section >

      {/* Brands Section */}
      < section id="brands" className="py-24 lg:py-32 bg-panel" >
        <div className="container mx-auto px-6 lg:px-12">
          <StaggerReveal delay={0.1}>
            <p className="type-kicker text-muted mb-4">Our Brands</p>
            <h2 className="type-h1 text-foreground mb-12">
              Global Professional Brands We Represent
            </h2>

            {/* Brand Logos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { name: "Alfaparf Milano Professional", country: "Italy", slug: "alfaparf" },
                  { name: "Farmavita", country: "Italy", slug: "farmavita" },
                  { name: "Montibello", country: "Spain", slug: "montibello" },
                  { name: "Gamma+ Professional", country: "Italy", slug: "gammaplus" },
                ].map((brand) => (
                <AppLink
                  key={brand.name}
                  href={`${base}/products?brand=${brand.slug}`}
                  className="group p-8 rounded-2xl bg-background transition-all duration-[var(--transition-elegant)] hover:scale-105 block"
                  style={{ boxShadow: "var(--shadow-elegant)" }}
                >
                  <div className="aspect-video flex items-center justify-center bg-zinc-100 rounded-lg mb-4">
                    <span className="type-ui-sm text-muted">Logo</span>
                  </div>
                  <h3 className="type-h4 text-foreground">{brand.name}</h3>
                  <p className="type-data text-muted">{brand.country}</p>
                </AppLink>
              ))}
            </div>
          </StaggerReveal>
        </div>
      </section >

      {/* Education Section */}
      < section id="education" className="py-24 lg:py-32 bg-background" >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <StaggerReveal delay={0.1}>
              <p className="type-kicker text-muted mb-4">Education & Market Development</p>
              <h2 className="type-h1 text-foreground mb-6">
                Educating the Professional Market
              </h2>
              <p className="type-body text-foreground-muted mb-8">
                Supported by a solid technical and sales team, we actively educate the salon industry through knowledge sharing and skill development.
              </p>

              <ul className="space-y-4">
                {[
                  "Technical trainings and product education",
                  "Trend insights and service development",
                  "Skill enhancement for hairdressers and salon teams",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-foreground mt-1">✓</span>
                    <span className="type-body text-foreground-muted">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button - DEV-20 */}
              <div className="mt-8">
                <ButtonLink
                  href={`${base}/education`}
                  variant="primary"
                  className="px-8 py-4 type-nav rounded-full inline-block transition-all duration-[var(--transition-elegant)]"
                >
                  Explore Our Programs
                </ButtonLink>
              </div>
            </StaggerReveal>

            {/* Education Image - DEV-21 Parallax */}
            <ParallaxImage
              src="/images/education-hero.jpg"
              alt="Professional haircare education and training"
              className="aspect-square rounded-3xl overflow-hidden"
              speed={0.15}
            />
          </div>
        </div>
      </section >

      {/* Partnership Section */}
      < section id="partner" className="py-24 lg:py-32 bg-panel" >
        <div className="container mx-auto px-6 lg:px-12">
          <StaggerReveal delay={0.1}>
            <p className="type-kicker text-muted mb-4 text-center">Why Partner With Us</p>
            <h2 className="type-h1 text-foreground mb-16 text-center">
              Built for Long-Term Success
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* For Principals */}
              <div className="p-8 rounded-3xl bg-background" style={{ boxShadow: "var(--shadow-elegant)" }}>
                <h3 className="type-h2 text-foreground mb-6">For International Principals</h3>
                <ul className="space-y-4">
                  {[
                    "Strong nationwide distribution network",
                    "Deep understanding of Indonesia's salon ecosystem",
                    "Proven capability in brand building and market education",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-foreground mt-1">•</span>
                      <span className="type-body text-foreground-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Salons */}
              <div className="p-8 rounded-3xl bg-background" style={{ boxShadow: "var(--shadow-elegant)" }}>
                <h3 className="type-h2 text-foreground mb-6">For Professional Salons</h3>
                <ul className="space-y-4">
                  {[
                    "Access to trusted global haircare brands",
                    "Consistent product quality and professional support",
                    "Long-term partnership based on trust and competence",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
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
                Become a Partner
              </ButtonLink>
            </div>
          </StaggerReveal>
        </div>
      </section >

      {/* Closing Statement */}
      < section className="py-24 lg:py-32 bg-foreground text-background" >
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <StaggerReveal>
            <p className="type-h2 max-w-4xl mx-auto">
              PT Alfa Beauty Cosmetica is a trusted distribution partner for global professional haircare suppliers and a reliable supplier for salons across Indonesia—committed to quality, education, and sustainable industry growth.
            </p>
          </StaggerReveal>
        </div>
      </section >

      <Footer />
    </div >
  );
}
