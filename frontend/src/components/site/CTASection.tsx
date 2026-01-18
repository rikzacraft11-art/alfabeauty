"use client";

import Image from "next/image";
import WhatsAppLink from "@/components/site/WhatsAppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";
import { getButtonClassName } from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { IconWhatsApp, IconCheck } from "@/components/ui/icons";
import { getCtaBenefits, getCtaKicker } from "@/content/homepage";

// =============================================================================
// Types
// =============================================================================

interface BenefitItemProps {
  text: string;
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * BenefitItem - Single benefit with checkmark icon
 */
function BenefitItem({ text }: BenefitItemProps) {
  return (
    <li className="flex gap-3 items-start">
      <span
        className="mt-0.5 flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
        aria-hidden="true"
      >
        <IconCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </span>
      <span className="type-body text-foreground-muted">
        {text}
      </span>
    </li>
  );
}

/**
 * CTAContent - Left side content (text, benefits, buttons)
 */
function CTAContent() {
  const { locale } = useLocale();
  const copy = t(locale);
  const baseUrl = `/${locale}`;
  const benefits = getCtaBenefits(locale);
  const kickerText = getCtaKicker(locale);

  return (
    <div className="p-5 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center order-2 lg:order-1">
      <div className="max-w-lg space-y-5 sm:space-y-6">
        {/* Kicker */}
        <p className="type-kicker inline-flex items-center gap-3">
          <span className="h-px w-6 sm:w-8 bg-foreground" aria-hidden="true" />
          {kickerText}
        </p>

        {/* Headline */}
        <h2 className="type-h2">{copy.sections.consultCta.title}</h2>

        {/* Body */}
        <p className="type-lede">{copy.sections.consultCta.body}</p>

        {/* Benefits List */}
        <ul className="space-y-2 sm:space-y-3" role="list">
          {benefits.map((benefit) => (
            <BenefitItem key={benefit} text={benefit} />
          ))}
        </ul>

        {/* CTA - Focus on WhatsApp as primary conversion */}
        <div className="flex flex-col gap-4 pt-2 sm:pt-4">
          {/* Professional qualifier - reduces anxiety */}
          <p className="type-data-strong text-foreground">
            {locale === "id"
              ? "Untuk salon & barbershop profesional"
              : "For professional salons & barbershops"}
          </p>

          <WhatsAppLink
            prefill={locale === "id"
              ? "Halo, saya tertarik untuk bermitra dengan Alfa Beauty. Mohon informasi lebih lanjut."
              : "Hello, I'm interested in partnering with Alfa Beauty. Please share more information."
            }
            className={getButtonClassName({
              variant: "primary",
              size: "lg",
              className: "gap-2 justify-center w-full sm:w-auto"
            })}
          >
            <IconWhatsApp className="h-5 w-5" />
            {copy.cta.whatsappConsult}
          </WhatsAppLink>

          {/* Secondary: text link (differentiated from Hero) */}
          <a
            href={`${baseUrl}/partnership/become-partner`}
            className="type-ui text-foreground-muted hover:text-foreground underline underline-offset-4 transition-colors text-center sm:text-left"
          >
            {locale === "id" ? "Atau daftar sebagai partner" : "Or register as a partner"} →
          </a>

          {/* Response time promise + partner count - reduces no-pricing anxiety */}
          <div className="space-y-1">
            <p className="type-data text-foreground-muted text-center sm:text-left">
              {locale === "id"
                ? "⚡ Respon cepat dalam 1 jam kerja"
                : "⚡ Fast response within 1 business hour"}
            </p>
            <p className="type-data text-muted text-center sm:text-left">
              {locale === "id"
                ? "Bergabung dengan 500+ salon partner di seluruh Indonesia"
                : "Join 500+ salon partners across Indonesia"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CTAImage - Right side lifestyle image
 */
function CTAImage() {
  return (
    <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] xl:min-h-[500px] order-1 lg:order-2">
      <Image
        src="/images/partnership/partner-lifestyle.jpg"
        alt="Professional hairstylist working in a modern salon"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * CTASection - Partnership call-to-action section
 * 
 * Features:
 * - Two-column layout (image + content)
 * - Image on top for mobile (visual hierarchy)
 * - Benefits list with checkmarks
 * - WhatsApp + secondary CTA buttons
 * 
 * Clean Code:
 * - Uses shared icons from @/components/ui/icons
 * - Uses centralized content from homepage.ts
 * - Sub-components for single responsibility
 */
export default function CTASection() {
  const { locale } = useLocale();
  const srTitle = locale === "id" ? "Kesempatan Kemitraan" : "Partnership Opportunity";

  return (
    <section
      className="border border-border bg-background overflow-hidden"
      aria-labelledby="cta-section-title"
    >
      <h2 id="cta-section-title" className="sr-only">
        {srTitle}
      </h2>
      <div className="grid lg:grid-cols-2">
        <CTAContent />
        <CTAImage />
      </div>
    </section>
  );
}
