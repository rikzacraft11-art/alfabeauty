/* ─────────────────────────────────────────────────────────────────────
 * WhatsAppCTA — Unified WhatsApp call-to-action component
 *
 * Wraps the Shadcn Button (asChild) pattern with built-in:
 *   - WhatsApp URL construction
 *   - GA4 event tracking (cta_whatsapp_click)
 *   - Accessible focus-visible ring
 *   - target="_blank" + rel="noopener noreferrer"
 *
 * Usage:
 *   <WhatsAppCTA location="hero">Chat via WhatsApp</WhatsAppCTA>
 *   <WhatsAppCTA location="product_detail" productName="Color Wear" />
 *   <WhatsAppCTA location="contact_chat" message="Custom message" />
 * ───────────────────────────────────────────────────────────────────── */

"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { WHATSAPP_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { trackEvent } from "@/shared/lib/analytics";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

interface WhatsAppCTAProps {
  /** Analytics location identifier (e.g. "hero", "product_detail", "contact_chat") */
  location: string;
  /** Product name — included in both the WA message and the analytics event */
  productName?: string;
  /** Custom WhatsApp pre-filled message. Overrides the default. */
  message?: string;
  /** Button content. Defaults to an icon + "Chat via WhatsApp". */
  children?: React.ReactNode;
  className?: string;
  variant?: ButtonVariantProps["variant"];
  size?: ButtonVariantProps["size"];
}

export function WhatsAppCTA({
  location,
  productName,
  message,
  children,
  className,
  variant,
  size,
}: WhatsAppCTAProps): React.JSX.Element {
  const defaultMessage = productName
    ? `Saya tertarik dengan produk ${productName}`
    : `Hi, saya ingin konsultasi dengan tim ${SITE_SHORT_NAME}.`;

  const waMessage = message ?? defaultMessage;
  const href = `${WHATSAPP_URL}?text=${encodeURIComponent(waMessage)}`;

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("cta_whatsapp_click", {
            location,
            ...(productName ? { product_name: productName } : {}),
          })
        }
      >
        {children ?? (
          <>
            <MessageCircle className="h-4 w-4" />
            Chat via WhatsApp
          </>
        )}
      </a>
    </Button>
  );
}
