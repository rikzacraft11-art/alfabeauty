"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

export default function ProductsHeader() {
  const { locale } = useLocale();
  const copy = t(locale);

  return (
    <header className="space-y-2">
      <h1 className="type-h2">{copy.products.title}</h1>
      <p className="type-body">{copy.products.lede}</p>
    </header>
  );
}
