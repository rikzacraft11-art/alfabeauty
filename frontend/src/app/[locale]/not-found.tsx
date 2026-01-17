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
      className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center"
      role="main"
      aria-labelledby="not-found-title"
    >
      {/* 404 Visual Indicator */}
      <p className="type-error-code text-muted mb-6" aria-hidden="true">
        404
      </p>

      {/* Title */}
      <h1 id="not-found-title" className="type-h2 mb-4">
        {tx.system.notFound.title}
      </h1>

      {/* Description */}
      <p className="type-body text-muted-strong mb-8 max-w-md mx-auto">
        {tx.system.notFound.body}
      </p>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <ButtonLink href={base} className="inline-flex items-center gap-2">
          {tx.system.notFound.backHome}
          <IconArrowRight className="h-4 w-4" />
        </ButtonLink>
        <ButtonLink href={`${base}/products`} variant="secondary">
          {tx.nav.products}
        </ButtonLink>
      </div>

      {/* Helpful Links */}
      <nav
        className="mt-12 pt-8 border-t border-border"
        aria-label={locale === "id" ? "Tautan berguna" : "Helpful links"}
      >
        <p className="type-data text-muted mb-4">
          {locale === "id" ? "Coba halaman ini:" : "Try these pages:"}
        </p>
        <ul className="flex flex-wrap justify-center gap-4 type-body">
          <li>
            <a href={`${base}/education`} className="text-muted-strong hover:text-foreground transition-colors">
              {tx.nav.education}
            </a>
          </li>
          <li>
            <a href={`${base}/partnership`} className="text-muted-strong hover:text-foreground transition-colors">
              {tx.nav.partnership}
            </a>
          </li>
          <li>
            <a href={`${base}/contact`} className="text-muted-strong hover:text-foreground transition-colors">
              {tx.nav.contact}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
