"use client";

import Image from "next/image";
import { useLocale } from "@/components/i18n/LocaleProvider";
import ButtonLink from "@/components/ui/ButtonLink";
import Card from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import {
  IconCube,
  IconAcademic,
  IconBuilding,
  IconArrowRight,
  IconCheck,
} from "@/components/ui/icons";

const ICONS = [IconCube, IconAcademic, IconBuilding];

export default function PartnershipContent() {
  const { locale } = useLocale();
  const copy = t(locale);
  const base = `/${locale}`;

  const cards = [copy.partnership.cards.curated, copy.partnership.cards.education, copy.partnership.cards.b2b];

  return (
    <div className="space-y-16">
      {/* Hero Section with Image */}
      <header className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="space-y-4">
            <p className="type-kicker inline-flex items-center gap-3">
              <span className="h-px w-8 bg-foreground" aria-hidden="true" />
              {copy.nav.partnership}
            </p>
            <h1 className="type-h1">{copy.partnership.title}</h1>
          </div>
          <p className="type-lede max-w-lg">{copy.partnership.lede}</p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <ButtonLink
              href={`${base}/partnership/become-partner`}
              variant="primary"
              size="lg"
              className="group inline-flex items-center gap-2"
            >
              {copy.cta.becomePartner}
              <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[4/3] lg:aspect-square order-1 lg:order-2 overflow-hidden border border-border">
          <Image
            src="/images/partnership/partner-lifestyle.jpg"
            alt="Professional hairstylist working in a modern salon"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </header>

      {/* Benefits Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {cards.map((card, idx) => {
          const Icon = ICONS[idx];
          return (
            <Card key={card.title} className="p-8 space-y-4 group hover:border-muted-strong transition-colors">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-background group-hover:scale-105 transition-transform">
                <Icon className="h-7 w-7" />
              </span>
              <h2 className="type-h3">{card.title}</h2>
              <p className="type-body text-muted-strong">{card.body}</p>
            </Card>
          );
        })}
      </section>

      {/* Features List */}
      <section className="border-y border-border py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {copy.partnership.features.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <IconCheck className="h-3.5 w-3.5" />
              </span>
              <span className="type-body">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="ui-section-dark p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="type-h2">{copy.partnership.readyBlock.title}</h2>
            <p className="type-body opacity-80">{copy.partnership.readyBlock.body}</p>
          </div>
          <div className="shrink-0">
            <ButtonLink
              href={`${base}/partnership/become-partner`}
              variant="inverted"
              size="lg"
              className="group"
            >
              {copy.cta.becomePartner}
              <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
