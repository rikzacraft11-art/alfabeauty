"use client";

import type { ComponentProps } from "react";

import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type Props = ComponentProps<"a"> & {
  prefill?: string;
};

export default function WhatsAppLink({ prefill, href, ...props }: Props) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const fallbackEmail = process.env.NEXT_PUBLIC_FALLBACK_EMAIL;
  const defaultPrefill = process.env.NEXT_PUBLIC_WHATSAPP_PREFILL;

  const finalHref =
    href ??
    buildWhatsAppHref({
      number,
      message: prefill ?? defaultPrefill,
      fallbackEmail,
    });

  const isDisabled = finalHref === "#";
  const isMailto = !isDisabled && finalHref.startsWith("mailto:");
  const isExternal = !isDisabled && !isMailto;

  const className = [
    props.className,
    isDisabled ? "cursor-not-allowed opacity-60" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      {...props}
      className={className}
      href={isDisabled ? undefined : finalHref}
      aria-disabled={isDisabled ? true : undefined}
      tabIndex={isDisabled ? -1 : props.tabIndex}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          trackEvent("cta_whatsapp_click", {
            href: finalHref,
            target: "whatsapp",
            result: "disabled_missing_config",
          });
          props.onClick?.(e);
          return;
        }

        // Ensure analytics reflects what the link actually does.
        if (isMailto) {
          trackEvent("cta_email_click", {
            href: finalHref,
            target: "email",
          });
        } else {
          trackEvent("cta_whatsapp_click", {
            href: finalHref,
            target: "whatsapp",
          });
        }

        props.onClick?.(e);
      }}
    />
  );
}
