"use client";

import WhatsAppLink from "@/components/site/WhatsAppLink";
import { trackEvent } from "@/lib/analytics";

export default function WhatsAppStickyCTA() {
  const fallbackEmail = process.env.NEXT_PUBLIC_FALLBACK_EMAIL;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <WhatsAppLink
        className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        prefill={process.env.NEXT_PUBLIC_WHATSAPP_PREFILL}
      >
        WhatsApp Consult
      </WhatsAppLink>

      {fallbackEmail ? (
        <div className="mt-2 text-right">
          <a
            className="text-xs font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
            href={`mailto:${fallbackEmail}`}
            onClick={() => {
              trackEvent("cta_email_click", {
                href: `mailto:${fallbackEmail}`,
                target: "email",
              });
            }}
          >
            Email us instead
          </a>
        </div>
      ) : null}
    </div>
  );
}
