import StaggerReveal from "@/components/ui/StaggerReveal";

/**
 * Privacy Policy Page
 * Design V2: Clean, readable legal document
 * Migrated from (v2) to production route.
 */
export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <StaggerReveal delay={0.1} className="mb-12">
          <p className="type-kicker text-muted mb-4">Legal</p>
          <h1 className="type-h1 text-foreground mb-4">Privacy Policy</h1>
          <p className="type-data text-muted">Last updated: January 2026</p>
        </StaggerReveal>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">1. Information We Collect</h2>
            <p className="type-body text-foreground-muted mb-4">
              When you use our website or submit a partnership application, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 type-body text-foreground-muted space-y-2">
              <li>Business name and type</li>
              <li>Contact name, email address, and phone number</li>
              <li>City and location information</li>
              <li>Information about brands you currently carry</li>
              <li>Website usage data and analytics</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="type-body text-foreground-muted mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 type-body text-foreground-muted space-y-2">
              <li>Process and respond to partnership inquiries</li>
              <li>Provide customer support and communication</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">3. Data Protection</h2>
            <p className="type-body text-foreground-muted">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and access is restricted to authorized personnel only.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">4. Your Rights</h2>
            <p className="type-body text-foreground-muted mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 type-body text-foreground-muted space-y-2">
              <li>Access and receive a copy of your data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="type-h3 text-foreground mb-4">5. Contact Us</h2>
            <p className="type-body text-foreground-muted">
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:privacy@alfabeauty.co.id" className="text-foreground underline">
                privacy@alfabeauty.co.id
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
