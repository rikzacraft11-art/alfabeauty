"use client";

import WhatsAppLink from "@/components/site/WhatsAppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getButtonClassName } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { IconWhatsApp } from "@/components/ui/icons";

/**
 * Sticky WhatsApp CTA button.
 * Single responsive button with icon + text.
 */
export default function WhatsAppStickyCTA() {
  const { locale } = useLocale();
  const copy = t(locale);

  return (
    <div
      className="fixed z-50"
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
        right: "max(1rem, env(safe-area-inset-right, 1rem))",
      }}
    >
      <WhatsAppLink
        className="inline-flex items-center gap-2 h-12 px-5 bg-whatsapp text-background rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 type-ui"
        prefill={process.env.NEXT_PUBLIC_WHATSAPP_PREFILL}
      >
        <IconWhatsApp className="h-5 w-5" aria-hidden="true" />
        <span className="max-sm:sr-only type-ui-strong">{copy.cta.whatsappConsult}</span>
      </WhatsAppLink>
    </div>
  );
}


