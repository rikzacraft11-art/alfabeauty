"use client";

import WhatsAppLink from "@/components/site/WhatsAppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getButtonClassName } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import { t } from "@/lib/i18n";

export default function WhatsAppStickyCTA() {
  const fallbackEmail = process.env.NEXT_PUBLIC_FALLBACK_EMAIL;
  const { locale } = useLocale();
  const copy = t(locale);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <WhatsAppLink
        className={getButtonClassName({ variant: "primary", size: "md" })}
        prefill={process.env.NEXT_PUBLIC_WHATSAPP_PREFILL}
      >
        {copy.cta.whatsappConsult}
      </WhatsAppLink>

      {fallbackEmail ? (
        <div className="mt-2 text-right">
          <a
            className="type-data font-semibold text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
            href={`mailto:${fallbackEmail}`}
            onClick={() => {
              trackEvent("cta_email_click", {
                href: `mailto:${fallbackEmail}`,
                target: "email",
              });
            }}
          >
            {copy.cta.emailInstead}
          </a>
        </div>
      ) : null}
    </div>
  );
}
