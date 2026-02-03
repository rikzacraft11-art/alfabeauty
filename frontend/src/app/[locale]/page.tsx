import type { Metadata } from "next";

import StaggerReveal from "@/components/ui/StaggerReveal";
import ParallaxImage from "@/components/ui/ParallaxImage";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import Footer from "@/components/layout/Footer";
import { normalizeLocale, t } from "@/lib/i18n";

// Web 3.0 Interactive Components
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import GradientBlob from "@/components/ui/GradientBlob";

// Ineo-Sense Style Animation & Layout Components
import TextReveal from "@/components/ui/TextReveal";
import CardReveal from "@/components/ui/CardReveal";
import SolutionCard from "@/components/ui/SolutionCard";
import ExpertiseList from "@/components/ui/ExpertiseList";
import ProjectShowcase from "@/components/ui/ProjectShowcase";

// New Web 3.0 Awwwards Components
import CharacterReveal from "@/components/ui/CharacterReveal";
import SmoothStats from "@/components/ui/SmoothStats";
import ScrollProgress from "@/components/ui/ScrollProgress";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

// 3D Background (client component wrapper for dynamic import)
import ClientBackground3D from "@/components/ui/ClientBackground3D";

/**
 * V3 Homepage - Awwwards Level
 * Design: Ineo-Sense inspired, Web 3.0 premium aesthetics
 * Features: Character reveal, 3D cards, stats counter, marquee, scroll progress
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
    <div className="min-h-screen relative">
      {/* Global Effects */}
      <ScrollProgress />
      <NoiseOverlay />

      {/* Interactive 3D Background */}
      <ClientBackground3D />

      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-panel">
        {/* Video Background with Parallax */}
        <div className="hero-video-container">
          <video
            className="hero-video motion-reduce:hidden"
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
          <div className="absolute inset-0 bg-background/50" aria-hidden="true" />
          {/* Animated Gradient Blob */}
          <GradientBlob className="opacity-40" blur={180} />
        </div>

        {/* Hero Content - Full Width Clean Layout */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <div className="space-y-8">
              {/* Kicker */}
              <CardReveal delay={0.1}>
                <p className="type-kicker text-muted tracking-[0.2em]">
                  {tx.home.hero.kicker}
                </p>
              </CardReveal>

              {/* Hero Headline - Character by Character Reveal */}
              <h1 className="type-hero text-foreground whitespace-normal">
                <CharacterReveal delay={0.3} staggerDelay={0.03}>
                  {tx.home.hero.title}
                </CharacterReveal>
              </h1>

              {/* Lede */}
              <CardReveal delay={0.8}>
                <p className="type-hero-body text-foreground-muted max-w-2xl leading-relaxed">
                  {tx.home.hero.lede}
                </p>
              </CardReveal>

              {/* CTA Buttons */}
              <CardReveal delay={1.0}>
                <div className="flex flex-wrap gap-4 pt-4" data-testid="hero-cta-container">
                  <a
                    href="#brands"
                    className="group ui-btn-primary px-10 py-4 type-nav rounded-full transition-all duration-500 hover:scale-105 glow-border relative overflow-hidden"
                    data-testid="cta-explore-brands"
                  >
                    <span className="relative z-10">{tx.home.hero.ctaExplore}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-foreground-soft to-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>
                  <a
                    href="#partner"
                    className="ui-btn-secondary px-10 py-4 type-nav rounded-full transition-all duration-500 hover:scale-105 border-2"
                    data-testid="cta-partner-with-us"
                  >
                    {tx.home.hero.ctaPartner}
                  </a>
                </div>
              </CardReveal>

              {/* Inline Stats - Clean integration, no popup */}
              <CardReveal delay={1.2}>
                <div className="pt-10 border-t border-border/30 mt-10">
                  <SmoothStats
                    stats={[
                      { value: 500, suffix: "+", label: isId ? "Mitra" : "Partners" },
                      { value: 15, suffix: "+", label: isId ? "Tahun" : "Years" },
                      { value: 4, label: isId ? "Brand" : "Brands" },
                      { value: 50, suffix: "+", label: isId ? "Kota" : "Cities" },
                    ]}
                  />
                </div>
              </CardReveal>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ScrollIndicator text={isId ? "Gulir" : "Scroll"} />
        </div>
      </section>

      {/* ========== SOLUTIONS SECTION - 3D Cards ========== */}
      <section id="solutions" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="mb-16 max-w-3xl">
            <CardReveal delay={0}>
              <p className="type-kicker text-muted mb-4">{tx.home.about.kicker}</p>
            </CardReveal>
            <h2 className="type-h1 text-foreground mb-6">
              <TextReveal>{tx.home.about.title}</TextReveal>
            </h2>
            <CardReveal delay={0.2}>
              <p className="type-body text-foreground-muted">
                {tx.home.about.body}
              </p>
            </CardReveal>
          </div>

          {/* 3D Tilt Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {tx.home.about.pillars.map((pillar, index) => (
              <SolutionCard
                key={pillar.title}
                index={index}
                title={pillar.title}
                description={pillar.body}
                icon={<span className="type-h1 block">{pillar.icon}</span>}
                href="#contact"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== EXPERTISE SECTION ========== */}
      <section id="expertise" className="py-24 lg:py-32 bg-background overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <CardReveal delay={0}>
                  <p className="type-kicker text-muted mb-4">
                    {isId ? "Keunggulan Kami" : "Our Expertise"}
                  </p>
                </CardReveal>
                <h2 className="type-h2 text-foreground mb-8">
                  <TextReveal>
                    {isId ? "Mengapa Bermitra Dengan Kami?" : "Why Partner With Us?"}
                  </TextReveal>
                </h2>
                <CardReveal delay={0.2}>
                  <p className="type-body text-foreground-muted">
                    {isId
                      ? "Kami menghadirkan pengalaman dan keahlian profesional untuk mendukung pertumbuhan bisnis Anda."
                      : "We bring professional experience and expertise to support your business growth."
                    }
                  </p>
                </CardReveal>
              </div>
            </div>
            <div className="lg:col-span-8">
              <ExpertiseList
                items={[
                  {
                    title: isId ? "Keunggulan Global" : "Global Excellence",
                    description: isId
                      ? "Menghadirkan inovasi kecantikan kelas dunia dari Italia dan Spanyol ke Indonesia."
                      : "Bringing world-class Italian and Spanish beauty innovation to Indonesia."
                  },
                  {
                    title: isId ? "Dukungan Profesional" : "Professional Support",
                    description: isId
                      ? "Edukasi dan dukungan teknis khusus untuk mitra salon demi kesuksesan bersama."
                      : "Dedicated education and technical support for salon partners to ensure success."
                  },
                  {
                    title: isId ? "Pertumbuhan Berkelanjutan" : "Sustainable Growth",
                    description: isId
                      ? "Membangun kemitraan jangka panjang yang fokus pada pertumbuhan bisnis bersama."
                      : "Building long-term partnerships that focus on mutual business growth and scalability."
                  },
                  {
                    title: isId ? "Portofolio Premium" : "Premium Portfolio",
                    description: isId
                      ? "Koleksi produk berkinerja tinggi yang dikurasi untuk profesional elit."
                      : "Curated selection of high-performance products for elite professionals."
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROJECT SHOWCASE (Brands) ========== */}
      <section id="brands" className="py-24 lg:py-32 bg-panel">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <CardReveal delay={0}>
              <p className="type-kicker text-muted mb-4">{tx.home.brands.kicker}</p>
            </CardReveal>
            <h2 className="type-h1 text-foreground mb-6">
              <TextReveal>{tx.home.brands.title}</TextReveal>
            </h2>
            <CardReveal delay={0.2}>
              <p className="type-body text-foreground-muted max-w-3xl">
                {tx.home.brands.body}
              </p>
            </CardReveal>
          </div>

          <ProjectShowcase
            projects={[
              { title: "Alfaparf Milano", category: isId ? "Italia" : "Italy", href: `${base}/products?brand=alfaparf` },
              { title: "Farmavita", category: isId ? "Italia" : "Italy", href: `${base}/products?brand=farmavita` },
              { title: "Montibello", category: isId ? "Spanyol" : "Spain", href: `${base}/products?brand=montibello` },
              { title: "Gamma+ Professional", category: isId ? "Italia" : "Italy", href: `${base}/products?brand=gammaplus` },
            ]}
          />
        </div>
      </section>

      {/* ========== EDUCATION SECTION ========== */}
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
                  <li key={item} className="flex items-start gap-3 group">
                    <span className="text-foreground mt-1 group-hover:scale-125 transition-transform duration-300">✓</span>
                    <span className="type-body text-foreground-muted group-hover:text-foreground transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="type-body text-foreground-muted mt-6">
                {tx.home.education.note}
              </p>

              <div className="mt-8">
                <ButtonLink
                  href={`${base}/education`}
                  variant="primary"
                  className="px-10 py-4 type-nav rounded-full inline-block transition-all duration-500 hover:scale-105"
                >
                  {tx.home.education.ctaLabel}
                </ButtonLink>
              </div>
            </StaggerReveal>

            {/* Education Image with Parallax */}
            <div className="relative">
              <ParallaxImage
                src="/images/education/training-placeholder.jpg"
                alt={tx.home.education.imageAlt}
                className="aspect-square rounded-3xl overflow-hidden"
                speed={0.15}
              />
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-foreground rounded-2xl -z-10 opacity-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== PARTNERSHIP SECTION ========== */}
      <section id="partner" className="py-24 lg:py-32 bg-panel relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-subtle to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <StaggerReveal delay={0.1}>
            <div className="text-center mb-16">
              <p className="type-kicker text-muted mb-4">{tx.home.partnership.kicker}</p>
              <h2 className="type-h1 text-foreground">
                {tx.home.partnership.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* For Principals */}
              <div className="group p-8 lg:p-10 rounded-3xl bg-background border border-border hover:border-foreground/20 transition-all duration-500 hover:shadow-lg">
                <h3 className="type-h2 text-foreground mb-6 group-hover:translate-x-2 transition-transform duration-300">
                  {tx.home.partnership.principalsTitle}
                </h3>
                <ul className="space-y-4">
                  {tx.home.partnership.principalsBullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-foreground mt-1">→</span>
                      <span className="type-body text-foreground-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Salon & Barber */}
              <div className="group p-8 lg:p-10 rounded-3xl bg-background border border-border hover:border-foreground/20 transition-all duration-500 hover:shadow-lg">
                <h3 className="type-h2 text-foreground mb-6 group-hover:translate-x-2 transition-transform duration-300">
                  {tx.home.partnership.salonsTitle}
                </h3>
                <ul className="space-y-4">
                  {tx.home.partnership.salonsBullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-foreground mt-1">→</span>
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
                className="px-12 py-4 type-nav rounded-full transition-all duration-500 inline-block hover:scale-105"
              >
                {tx.home.partnership.ctaLabel}
              </ButtonLink>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* ========== CLOSING STATEMENT ========== */}
      <section className="py-24 lg:py-32 bg-foreground text-background relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground-soft to-foreground animate-pulse" style={{ animationDuration: "8s" }} />
        </div>

        <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
          <StaggerReveal>
            <p className="type-h2 max-w-4xl mx-auto leading-relaxed">
              {tx.home.closing.body}
            </p>
            <div className="mt-10">
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 type-nav text-background/80 hover:text-background transition-colors duration-300 link-slide"
              >
                {isId ? "Mulai Dari Sini" : "Start From Here"} ↑
              </a>
            </div>
          </StaggerReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
