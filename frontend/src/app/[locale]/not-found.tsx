"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";
import { IconArrowRight } from "@/components/ui/icons";

export default function NotFound() {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;

  return (
    <div
      className="mx-auto max-w-2xl px-4 py-24 sm:py-32 text-center"
      role="main"
      aria-labelledby="not-found-title"
    >
      {/* 404 Visual Indicator */}
      <p className="type-error-code text-muted/30 mb-8 select-none" aria-hidden="true">
        404
      </p>

      {/* Title */}
      <h1 id="not-found-title" className="type-h2 mb-6 text-foreground">
        {tx.system.notFound.title}
      </h1>

      {/* Description */}
      <p className="type-body text-muted-strong mb-10 max-w-md mx-auto">
        {tx.system.notFound.body}
      </p>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <ButtonLink href={base} className="inline-flex items-center gap-2 ui-radius-tight">
          {tx.system.notFound.backHome}
          <IconArrowRight className="h-4 w-4" />
        </ButtonLink>
        <ButtonLink href={`${base}/products`} variant="secondary" className="ui-radius-tight">
          {tx.nav.products}
        </ButtonLink>
      </div>

      {/* Helpful Links */}
      <nav
        className="mt-16 pt-10 border-t border-border/50"
        aria-label={locale === "id" ? "Tautan berguna" : "Helpful links"}
      >
        <p className="type-ui-sm-wide text-muted mb-6 uppercase">
          {locale === "id" ? "Coba halaman ini:" : "Try these pages:"}
        </p>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 type-body-compact">
          <li>
            <a href={`${base}/education`} className="text-muted-strong hover:text-foreground transition-colors underline-offset-4 hover:underline">
              {tx.nav.education}
            </a>
          </li>
          <li>
            <a href={`${base}/partnership`} className="text-muted-strong hover:text-foreground transition-colors underline-offset-4 hover:underline">
              {tx.nav.partnership}
            </a>
          </li>
          <li>
            <a href={`${base}/contact`} className="text-muted-strong hover:text-foreground transition-colors underline-offset-4 hover:underline">
              {tx.nav.contact}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
