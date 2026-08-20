import { CONTACT_EMAIL } from "@/shared/lib/config";

export function PrivacyPageContent() {
    return (
        <main id="main-content" className="mx-auto max-w-3xl px-6 pt-[calc(var(--header-height)+2rem)] pb-24 sm:px-8 lg:px-12">
            <h1 className="heading-display mb-8">Privacy Policy</h1>
            <p className="mb-4 text-sm text-text-muted">
                Last updated: 10 March 2026
            </p>

            <div className="space-y-8 text-[15px] leading-relaxed text-foreground/80">
                <section>
                    <h2 className="mb-3 text-lg font-bold">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly, such as your name, email
                        address, phone number, and business details when you submit a contact
                        or partnership inquiry form.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">2. How We Use Your Information</h2>
                    <p>
                        We use the information to respond to your inquiries, process
                        partnership applications, send relevant communications, and improve
                        our services and website experience.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">3. Data Storage &amp; Security</h2>
                    <p>
                        Your data is stored securely using industry-standard encryption and
                        access controls. We retain your information only for as long as
                        necessary to fulfil the purposes outlined in this policy.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">4. Third-Party Services</h2>
                    <p>
                        We use trusted third-party services including Supabase (data storage),
                        Resend (email delivery), and Google Analytics (website analytics).
                        These services have their own privacy policies governing data handling.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">5. Cookies &amp; Analytics</h2>
                    <p>
                        We use Google Analytics to understand how visitors interact with our
                        website. This service may set cookies to collect anonymised usage data.
                        No personally identifiable information is shared with analytics providers.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">6. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or request deletion of your
                        personal data. To exercise these rights, contact us at the email below.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">7. Changes to This Policy</h2>
                    <p>
                        We may update this policy from time to time. Changes will be posted on
                        this page with an updated revision date.
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-bold">8. Contact</h2>
                    <p>
                        For privacy-related inquiries, please contact us at{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline underline-offset-4 hover:text-foreground">
                            {CONTACT_EMAIL}
                        </a>.
                    </p>
                </section>
            </div>
        </main>
    );
}
