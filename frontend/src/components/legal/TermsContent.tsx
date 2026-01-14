"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

export default function TermsContent() {
  const { locale } = useLocale();

  const tx = t(locale);
  const policy = tx.legal.termsPolicy;
  const sections = policy.sections;

  return (
    <div className="space-y-6">
      <p className="type-body">
        <span className="type-strong text-foreground">{policy.intro.prefix}</span> {policy.intro.body}
      </p>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.websiteUse.title}</h2>
        <p className="type-body">{sections.websiteUse.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.noPublicPricing.title}</h2>
        <p className="type-body">{sections.noPublicPricing.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.limitations.title}</h2>
        <p className="type-body">{sections.limitations.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.changes.title}</h2>
        <p className="type-body">{sections.changes.body}</p>
      </section>
    </div>
  );
}
