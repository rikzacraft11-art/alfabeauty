"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import WhatsAppLink from "@/components/site/WhatsAppLink";
import { t } from "@/lib/i18n";
import {
  IconWhatsApp,
  IconMail,
  IconLocation,
} from "@/components/ui/icons";

// Shared link styles for DRY
const footerLinkClass = "type-body text-muted-strong hover:text-foreground transition-colors";
const bottomLinkClass = "type-data text-muted hover:text-foreground transition-colors";

export default function SiteFooter() {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;
  const contactEmail = process.env.NEXT_PUBLIC_FALLBACK_EMAIL ?? "hello@alfabeauty.co.id";

  return (
    <footer className="border-t border-border bg-background" aria-label="Footer">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-[120rem] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <p className="type-brand text-foreground">Alfa Beauty</p>
            <p className="type-body max-w-xs">{tx.footer.blurb}</p>

            {/* Trust badge */}
            <p className="type-data text-muted-soft uppercase tracking-wider">
              {locale === "id" ? "500+ Partner Salon di Indonesia" : "500+ Salon Partners in Indonesia"}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <WhatsAppLink
                className="ui-focus-ring ui-radius-tight inline-flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground hover:bg-subtle hover:border-muted-strong transition-colors"
                aria-label="WhatsApp"
              >
                <IconWhatsApp className="h-5 w-5" />
              </WhatsAppLink>
              <a
                href={`mailto:${contactEmail}`}
                className="ui-focus-ring ui-radius-tight inline-flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground hover:bg-subtle hover:border-muted-strong transition-colors"
                aria-label="Email"
              >
                <IconMail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore Column */}
          <nav className="space-y-4" aria-label={tx.footer.explore}>
            <p className="type-data-strong text-foreground uppercase">{tx.footer.explore}</p>
            <ul className="space-y-3">
              <li>
                <AppLink
                  href={`${base}/products`}
                  className={footerLinkClass}
                >
                  {tx.nav.products}
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={`${base}/education`}
                  className={footerLinkClass}
                >
                  {tx.nav.education}
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={`${base}/partnership`}
                  className={footerLinkClass}
                >
                  {tx.nav.partnership}
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={`${base}/about`}
                  className={footerLinkClass}
                >
                  {tx.nav.about}
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={`${base}/contact`}
                  className={footerLinkClass}
                >
                  {tx.nav.contact}
                </AppLink>
              </li>
            </ul>
          </nav>

          {/* Legal Column */}
          <nav className="space-y-4" aria-label={tx.footer.legal}>
            <p className="type-data-strong text-foreground uppercase">{tx.footer.legal}</p>
            <ul className="space-y-3">
              <li>
                <AppLink
                  href={`${base}/privacy`}
                  className="type-body text-muted-strong hover:text-foreground transition-colors"
                >
                  {tx.legal.privacyTitle}
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={`${base}/terms`}
                  className="type-body text-muted-strong hover:text-foreground transition-colors"
                >
                  {tx.legal.termsTitle}
                </AppLink>
              </li>
            </ul>
          </nav>

          {/* Contact Column */}
          <div className="space-y-4">
            <p className="type-data-strong text-foreground uppercase">{tx.nav.contact}</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <IconLocation className="h-5 w-5 text-muted shrink-0 mt-0.5" />
                <p className="type-body text-muted-strong">
                  {tx.contact.location.city}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <IconMail className="h-5 w-5 text-muted shrink-0 mt-0.5" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="type-body text-muted-strong hover:text-foreground transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-[120rem] px-4 py-6 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-data text-muted">
              © {new Date().getFullYear()} PT Alfa Beauty Cosmetica. {tx.footer.copyrightSuffix}
            </p>
            <div className="flex items-center gap-6">
              <AppLink
                href={`${base}/privacy`}
                className={bottomLinkClass}
              >
                {tx.legal.privacyTitle}
              </AppLink>
              <AppLink
                href={`${base}/terms`}
                className={bottomLinkClass}
              >
                {tx.legal.termsTitle}
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
