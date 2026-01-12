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
      <p className="type-body text-zinc-700">
        <span className="font-semibold text-zinc-900">{policy.intro.prefix}</span> {policy.intro.body}
      </p>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.websiteUse.title}</h2>
        <p className="type-body text-zinc-700">{sections.websiteUse.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.noPublicPricing.title}</h2>
        <p className="type-body text-zinc-700">{sections.noPublicPricing.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.limitations.title}</h2>
        <p className="type-body text-zinc-700">{sections.limitations.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.changes.title}</h2>
        <p className="type-body text-zinc-700">{sections.changes.body}</p>
      </section>
    </div>
  );
}
