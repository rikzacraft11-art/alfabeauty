"use client";

import WhatsAppLink from "@/components/site/WhatsAppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";
import { getButtonClassName } from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";

export default function CTASection() {
  const { locale } = useLocale();
  const copy = t(locale);
  const base = `/${locale}`;

  return (
    <section className="border border-border bg-panel p-6 sm:p-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="type-h3">{copy.sections.consultCta.title}</h2>
          <p className="type-body">{copy.sections.consultCta.body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <WhatsAppLink className={getButtonClassName({ variant: "primary", size: "md" })}>
            {copy.cta.whatsappConsult}
          </WhatsAppLink>
          <ButtonLink href={`${base}/partnership/become-partner`} variant="secondary">
            {copy.cta.becomePartner}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
