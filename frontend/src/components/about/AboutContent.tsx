"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

export default function AboutContent() {
  const { locale } = useLocale();
  const copy = t(locale);

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="type-h2">{copy.about.title}</h1>
      <p className="type-body">{copy.about.body}</p>
    </div>
  );
}
