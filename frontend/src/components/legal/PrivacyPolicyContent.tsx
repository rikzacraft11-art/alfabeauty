"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

export default function PrivacyPolicyContent() {
  const { locale } = useLocale();

  const tx = t(locale);
  const policy = tx.legal.privacyPolicy;
  const sections = policy.sections;

  return (
    <div className="space-y-6">
      <p className="type-body text-zinc-700">
        <span className="font-semibold text-zinc-900">{policy.intro.prefix}</span> {policy.intro.body}
      </p>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.informationWeCollect.title}</h2>
        <ul className="list-disc space-y-1 pl-5 type-body text-zinc-700">
          {sections.informationWeCollect.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.howWeUse.title}</h2>
        <ul className="list-disc space-y-1 pl-5 type-body text-zinc-700">
          {sections.howWeUse.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.storageSecurity.title}</h2>
        <p className="type-body text-zinc-700">{sections.storageSecurity.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.cookies.title}</h2>
        <p className="type-body text-zinc-700">{sections.cookies.body}</p>
      </section>

      <section className="space-y-2">
        <h2 className="type-h3">{sections.contact.title}</h2>
        <p className="type-body text-zinc-700">{sections.contact.body}</p>
      </section>
    </div>
  );
}
