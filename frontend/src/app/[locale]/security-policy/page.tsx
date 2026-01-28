import type { Metadata } from "next";
import { useLocale } from "@/components/i18n/LocaleProvider";

export const metadata: Metadata = {
  title: "Security Policy",
  description: "Vulnerability disclosure policy and security practices.",
};

export default function SecurityPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <h1 className="type-h1 mb-8">Security Policy</h1>

        <section className="space-y-4 mb-10">
          <h2 className="type-h2">Vulnerability Disclosure</h2>
          <p className="type-body">
            Alfa Beauty Cosmetica is committed to ensuring the safety and security of our partners.
            We welcome feedback from security researchers to help us improve our security posture.
          </p>
          <p className="type-body">
            If you believe you have discovered a vulnerability, please report it to us via email
            at <a href="mailto:alfabeautycosmeticaa@gmail.com" className="text-foreground underline">alfabeautycosmeticaa@gmail.com</a>.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="type-h2">Reporting Guidelines</h2>
          <ul className="list-disc pl-5 type-body space-y-2">
            <li>Please provide a detailed description of the vulnerability.</li>
            <li>Include steps to reproduce the issue (PoC).</li>
            <li>Do not access or modify data that does not belong to you.</li>
            <li>Do not execute denial-of-service attacks.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="type-h2">Safe Harbor</h2>
          <p className="type-body">
            We will not pursue legal action against researchers who report vulnerabilities
            in good faith and in accordance with this policy. We are committed to working
            with you to verify and resolve the issue promptly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="type-h2">Response Timeline</h2>
          <p className="type-body">
            We aim to acknowledge receipt of your report within 24 hours and evaluate the severity
            within 5 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
