import { SITE_NAME, CONTACT_EMAIL } from "@/shared/lib/config";

export function TermsPageContent() {
    return (
        <main id="main-content" className="mx-auto max-w-3xl px-6 pt-[calc(var(--header-height)+2rem)] pb-24 sm:px-8 lg:px-12">
            <h1 className="heading-display mb-8">Terms &amp; Conditions</h1>
            <p className="mb-4 text-sm text-text-muted">
                Last updated: 10 March 2026
            </p>

            <div className="space-y-8 text-[15px] leading-relaxed text-foreground/80">
                <section>
                    <h2 className="mb-3 text-lg font-bold">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using the {SITE_NAME} website, you accept and agree
                        to be bound by the terms and provisions of this agreement.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">2. Use of the Website</h2>
                    <p>
                        This website is intended to provide information about our professional
                        haircare products and distribution services. You agree to use the
                        website only for lawful purposes and in a way that does not infringe
                        the rights of others.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">3. Intellectual Property</h2>
                    <p>
                        All content on this website, including text, images, logos, and
                        trademarks, is the property of PT Alfa Beauty Cosmetica or its
                        licensors. Unauthorized reproduction is prohibited.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">4. Product Information</h2>
                    <p>
                        While we strive to ensure accuracy, product information on this
                        website is for general reference only. Specifications and availability
                        may change without prior notice.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">5. Limitation of Liability</h2>
                    <p>
                        {SITE_NAME} shall not be liable for any indirect, incidental, or
                        consequential damages arising from the use of this website.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">6. Governing Law</h2>
                    <p>
                        These terms shall be governed by and construed in accordance with the
                        laws of the Republic of Indonesia.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">7. Contact</h2>
                    <p>
                        For questions regarding these terms, please contact us at{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline underline-offset-4 hover:text-foreground">
                            {CONTACT_EMAIL}
                        </a>.
                    </p>
                </section>
            </div>
        </main>
    );
}
