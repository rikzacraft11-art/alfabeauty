"use client";

import WhatsAppLink from "@/components/site/WhatsAppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getButtonClassName } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

export default function ContactContent({ fallbackEmail }: { fallbackEmail?: string }) {
  const { locale } = useLocale();
  const copy = t(locale);

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="type-h2">{copy.contact.title}</h1>
      <p className="type-body text-zinc-700">{copy.contact.body}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <WhatsAppLink className={getButtonClassName({ variant: "primary", size: "md" })}>
          {copy.cta.whatsappConsult}
        </WhatsAppLink>
        {fallbackEmail ? (
          <a
            className={getButtonClassName({ variant: "secondary", size: "md" })}
            href={`mailto:${fallbackEmail}`}
          >
            {copy.contact.email}
          </a>
        ) : null}
      </div>
    </div>
  );
}
