"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";
import ButtonLink from "@/components/ui/ButtonLink";
import Card from "@/components/ui/Card";
import { IconTarget, IconEye, IconHeart, IconShield } from "@/components/ui/icons";

export default function AboutContent() {
  const { locale } = useLocale();
  const copy = t(locale);
  const base = `/${locale}`;

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <header className="space-y-6 text-center max-w-3xl mx-auto">
        <p className="type-kicker">{copy.nav.about}</p>
        <h1 className="type-h1">{copy.about.title}</h1>
        <p className="type-body text-muted-strong">{copy.about.body}</p>
      </header>

      {/* Mission & Vision */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <IconTarget className="h-6 w-6" />
            </span>
            <h2 className="type-h3">{copy.about.mission.title}</h2>
          </div>
          <p className="type-body text-muted-strong">
            {copy.about.mission.body}
          </p>
        </Card>

        <Card className="p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <IconEye className="h-6 w-6" />
            </span>
            <h2 className="type-h3">{copy.about.vision.title}</h2>
          </div>
          <p className="type-body text-muted-strong">
            {copy.about.vision.body}
          </p>
        </Card>
      </section>

      {/* Values Section */}
      <section className="space-y-8">
        <h2 className="type-h2 text-center">{copy.about.valuesTitle}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center space-y-4 p-6">
            <span className="inline-flex h-14 w-14 items-center justify-center bg-background border border-border rounded-full mx-auto">
              <IconShield className="h-7 w-7 text-foreground" />
            </span>
            <h3 className="type-h3">{copy.about.values.quality.title}</h3>
            <p className="type-body text-muted-strong">
              {copy.about.values.quality.body}
            </p>
          </div>
          <div className="text-center space-y-4 p-6">
            <span className="inline-flex h-14 w-14 items-center justify-center bg-background border border-border rounded-full mx-auto">
              <IconHeart className="h-7 w-7 text-foreground" />
            </span>
            <h3 className="type-h3">{copy.about.values.partnership.title}</h3>
            <p className="type-body text-muted-strong">
              {copy.about.values.partnership.body}
            </p>
          </div>
          <div className="text-center space-y-4 p-6">
            <span className="inline-flex h-14 w-14 items-center justify-center bg-background border border-border rounded-full mx-auto">
              <IconTarget className="h-7 w-7 text-foreground" />
            </span>
            <h3 className="type-h3">{copy.about.values.excellence.title}</h3>
            <p className="type-body text-muted-strong">
              {copy.about.values.excellence.body}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="ui-section-dark p-8 lg:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <p className="type-h1">500+</p>
            <p className="type-data opacity-70">{copy.about.stats.products}</p>
          </div>
          <div className="space-y-2">
            <p className="type-h1">5000+</p>
            <p className="type-data opacity-70">{copy.about.stats.partners}</p>
          </div>
          <div className="space-y-2">
            <p className="type-h1">34</p>
            <p className="type-data opacity-70">{copy.about.stats.provinces}</p>
          </div>
          <div className="space-y-2">
            <p className="type-h1">10+</p>
            <p className="type-data opacity-70">{copy.about.stats.yearsExperience}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 max-w-2xl mx-auto">
        <h2 className="type-h2">{copy.about.cta.title}</h2>
        <p className="type-body text-muted-strong">
          {copy.about.cta.body}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonLink href={`${base}/partnership/become-partner`} variant="primary" size="lg">
            {copy.cta.becomePartner}
          </ButtonLink>
          <ButtonLink href={`${base}/contact`} variant="secondary" size="lg">
            {copy.nav.contact}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
