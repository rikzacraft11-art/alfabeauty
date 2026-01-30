import StaggerReveal from "@/components/ui/StaggerReveal";

/**
 * Terms of Service Page
 * Design V2: Clean, readable legal document
 * Migrated from (v2) to production route.
 */
export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <StaggerReveal delay={0.1} className="mb-12">
          <p className="type-kicker text-muted mb-4">Legal</p>
          <h1 className="type-h1 text-foreground mb-4">Terms of Service</h1>
          <p className="type-data text-muted">Last updated: January 2026</p>
        </StaggerReveal>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="type-body text-foreground-muted">
              By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">2. Use of Website</h2>
            <p className="type-body text-foreground-muted mb-4">
              This website is intended for business-to-business use only. You agree to use this website only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 type-body text-foreground-muted space-y-2">
              <li>Use the website in any way that violates applicable laws</li>
              <li>Attempt to gain unauthorized access to any part of the website</li>
              <li>Interfere with or disrupt the website or servers</li>
              <li>Reproduce, distribute, or create derivative works without permission</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">3. Product Information</h2>
            <p className="type-body text-foreground-muted">
              All product information displayed on this website is for informational purposes only. Pricing, availability, and specifications are subject to change without notice. For current pricing and availability, please contact us directly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">4. Intellectual Property</h2>
            <p className="type-body text-foreground-muted">
              All content on this website, including text, graphics, logos, images, and software, is the property of PT Alfa Beauty Cosmetica or its content suppliers and is protected by international copyright laws. Brand names and logos are trademarks of their respective owners.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">5. Partnership Applications</h2>
            <p className="type-body text-foreground-muted">
              Submitting a partnership application does not guarantee acceptance into our partner network. All applications are subject to review and approval at our sole discretion. We reserve the right to reject any application without providing reasons.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">6. Limitation of Liability</h2>
            <p className="type-body text-foreground-muted">
              PT Alfa Beauty Cosmetica shall not be liable for any direct, indirect, incidental, or consequential damages arising out of or in connection with the use of this website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">7. Contact</h2>
            <p className="type-body text-foreground-muted">
              For any questions regarding these Terms of Service, please contact us at:{" "}
              <a href="mailto:legal@alfabeauty.co.id" className="text-foreground underline">
                legal@alfabeauty.co.id
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
