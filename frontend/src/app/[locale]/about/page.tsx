import StaggerReveal from "@/components/ui/StaggerReveal";

/**
 * About Page
 * Design V2: Editorial layout with story sections
 * Migrated from (v2) to production route.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Hero */}
        <StaggerReveal delay={0.1} className="mb-24 max-w-4xl">
          <p className="type-kicker text-muted mb-4">About Us</p>
          <h1 className="type-hero text-foreground mb-6">
            More Than a Distributor
          </h1>
          <p className="type-hero-body text-foreground-muted">
            PT Alfa Beauty Cosmetica is a professional haircare distribution company with more than 15 years of experience serving Indonesia&apos;s salon industry.
          </p>
        </StaggerReveal>

        {/* Story Section 1 */}
        <section className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div
            className="aspect-square rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          />
          <StaggerReveal delay={0.2}>
            <h2 className="type-h2 text-foreground mb-6">Our Story</h2>
            <p className="type-body text-foreground-muted mb-4">
              Founded with a vision to bring world-class professional haircare to Indonesia,
              PT Alfa Beauty Cosmetica has grown from a small importer to one of the nation&apos;s
              leading distributors of premium salon brands.
            </p>
            <p className="type-body text-foreground-muted">
              We believe that great hair starts with great products. That&apos;s why we partner
              exclusively with brands that share our commitment to quality, innovation, and
              professional excellence.
            </p>
          </StaggerReveal>
        </section>

        {/* Story Section 2 */}
        <section className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <StaggerReveal delay={0.2} className="lg:order-2">
            <h2 className="type-h2 text-foreground mb-6">Our Mission</h2>
            <p className="type-body text-foreground-muted mb-4">
              To empower Indonesian salon professionals with access to the world&apos;s finest
              haircare products and the knowledge to use them effectively.
            </p>
            <p className="type-body text-foreground-muted">
              We don&apos;t just distribute products—we build brands, educate professionals,
              and support the sustainable growth of the salon industry.
            </p>
          </StaggerReveal>
          <div
            className="aspect-square rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 lg:order-1"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          />
        </section>

        {/* Values */}
        <section className="py-16 px-8 rounded-3xl bg-panel mb-24" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <StaggerReveal delay={0.1}>
            <h2 className="type-h2 text-foreground mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: "🤝", title: "Trust", desc: "We build relationships based on integrity and reliability." },
                { icon: "📚", title: "Education", desc: "We invest in knowledge sharing and professional development." },
                { icon: "🌱", title: "Growth", desc: "We support sustainable success for our partners and their clients." },
              ].map((value) => (
                <div key={value.title} className="text-center">
                  <div className="type-h1 mb-4">{value.icon}</div>
                  <h3 className="type-h3 text-foreground mb-2">{value.title}</h3>
                  <p className="type-body text-muted">{value.desc}</p>
                </div>
              ))}
            </div>
          </StaggerReveal>
        </section>

        {/* CTA */}
        <section className="text-center">
          <StaggerReveal>
            <h2 className="type-h2 text-foreground mb-4">Ready to Partner?</h2>
            <p className="type-body text-muted mb-8">
              Join our network of professional salons and distributors.
            </p>
            <a
              href="/partnership"
              className="ui-btn-primary px-8 py-4 type-nav rounded-full inline-block"
            >
              Become a Partner
            </a>
          </StaggerReveal>
        </section>
      </div>
    </main>
  );
}
