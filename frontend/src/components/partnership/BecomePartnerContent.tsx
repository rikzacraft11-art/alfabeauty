"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import LeadForm from "@/components/lead/LeadForm";
import { t } from "@/lib/i18n";

export default function BecomePartnerContent() {
  const { locale } = useLocale();
  const copy = t(locale);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="space-y-4">
        <h1 className="type-h2">{copy.becomePartner.title}</h1>
        <p className="type-body">{copy.becomePartner.lede}</p>

        <div className="border border-border bg-panel p-6">
          <p className="type-data-strong text-foreground">{copy.becomePartner.next.title}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 type-body">
            {copy.becomePartner.next.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border border-border p-6">
        <LeadForm />
      </div>
    </div>
  );
}
