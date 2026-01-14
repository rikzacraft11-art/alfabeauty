"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

export default function HomeHero() {
  const { locale } = useLocale();
  const copy = t(locale);
  const base = `/${locale}`;

  return (
    <section className="border border-border bg-background p-6 sm:p-10">
      <div className="max-w-3xl space-y-5">
        <p className="type-kicker">{copy.home.hero.kicker}</p>
        <h1 className="type-h1">{copy.home.hero.title}</h1>
        <p className="type-lede">{copy.home.hero.lede}</p>

        <ul className="space-y-2 type-body">
          {copy.home.hero.points.map((x) => (
            <li key={x} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 bg-foreground" />
              <span>{x}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`${base}/products`} variant="primary">
            {copy.cta.exploreProducts}
          </ButtonLink>
          <ButtonLink href={`${base}/partnership/become-partner`} variant="secondary">
            {copy.cta.becomePartner}
          </ButtonLink>
        </div>
        <p className="type-data">{copy.home.hero.note}</p>
      </div>
    </section>
  );
}
