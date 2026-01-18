"use client";

import Image from "next/image";
import { t } from "@/lib/i18n";
import { listArticles, listEvents } from "@/lib/education";

import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  IconCalendar,
  IconDocument,
  IconMapPin,
  IconArrowRight,
  IconUsers,
  IconWhatsApp,
} from "@/components/ui/icons";

export default function EducationHub() {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;

  const events = listEvents(locale);
  const articles = listArticles(locale);

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Hero Header */}
      <header className="space-y-6 text-center max-w-3xl mx-auto animate-fade-in">
        <p className="type-kicker">{tx.nav.education}</p>
        <h1 className="type-h1">{tx.education.hub.title}</h1>
        <p className="type-body text-muted-strong">{tx.education.hub.lede}</p>
      </header>

      {/* Stats Bar */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-border py-8">
          <div className="text-center space-y-1">
            <p className="type-h2 font-mono">{events.length}</p>
            <p className="type-data text-muted">{tx.education.hub.sections.events}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="type-h2 font-mono">{articles.length}</p>
            <p className="type-data text-muted">{tx.education.hub.sections.articles}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="type-h2 font-mono">B2B</p>
            <p className="type-data text-muted">{tx.education.hub.stats.focus}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="type-h2 font-mono">ID/EN</p>
            <p className="type-data text-muted">{tx.education.hub.stats.languages}</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Events Section */}
      <ScrollReveal>
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <IconCalendar className="h-5 w-5" />
              </span>
              <h2 className="type-h2">{tx.education.hub.sections.events}</h2>
            </div>
            <p className="type-data text-muted hidden sm:block">{events.length} {tx.education.hub.stats.upcoming}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <Card
                key={e.slug}
                className="group p-0 overflow-hidden hover:border-muted-strong transition-colors"
              >
                {/* Event Image */}
                <div className="relative aspect-video bg-subtle border-b border-border overflow-hidden">
                  <Image
                    src="/images/education/training-placeholder.jpg"
                    alt={e.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 type-data text-muted">
                    <span className="inline-flex items-center gap-1">
                      <IconMapPin className="h-4 w-4" />
                      {e.city}
                    </span>
                    <span>{e.date}</span>
                  </div>

                  <div className="space-y-2">
                    <AppLink
                      href={`${base}/education/events/${e.slug}`}
                      className="type-h3 group-hover:underline transition-colors block"
                    >
                      {e.title}
                    </AppLink>
                    <p className="type-body text-muted-strong line-clamp-2">{e.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-2 type-data text-muted">
                    <IconUsers className="h-4 w-4" />
                    <span>{e.audience.join(", ")}</span>
                  </div>

                  <div className="pt-2">
                    <AppLink
                      href={`${base}/education/events/${e.slug}`}
                      className="inline-flex items-center gap-2 type-body-strong text-foreground group-hover:gap-3 transition-all"
                    >
                      {tx.education.hub.actions.viewDetails}
                      <IconArrowRight className="h-4 w-4" />
                    </AppLink>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Articles Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <IconDocument className="h-5 w-5" />
              </span>
              <h2 className="type-h2">{tx.education.hub.sections.articles}</h2>
            </div>
            <p className="type-data text-muted hidden sm:block">{articles.length} {tx.education.hub.sections.articles.toLowerCase()}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Card
                key={a.slug}
                className="group p-0 overflow-hidden hover:border-muted-strong transition-colors"
              >
                {/* Article Image */}
                <div className="relative aspect-video bg-subtle border-b border-border overflow-hidden">
                  <Image
                    src="/images/education/training-placeholder.jpg"
                    alt={a.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <p className="type-data text-muted">{a.date}</p>

                  <div className="space-y-2">
                    <AppLink
                      href={`${base}/education/articles/${a.slug}`}
                      className="type-h3 group-hover:underline transition-colors block"
                    >
                      {a.title}
                    </AppLink>
                    <p className="type-body text-muted-strong line-clamp-3">{a.excerpt}</p>
                  </div>

                  <div className="pt-2">
                    <AppLink
                      href={`${base}/education/articles/${a.slug}`}
                      className="inline-flex items-center gap-2 type-body-strong text-foreground group-hover:gap-3 transition-all"
                    >
                      {tx.education.hub.actions.read}
                      <IconArrowRight className="h-4 w-4" />
                    </AppLink>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal>
        <section className="ui-section-dark p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h3 className="type-h3">{tx.education.hub.trainingTitle}</h3>
              <p className="type-body opacity-80 max-w-xl">{tx.education.hub.trainingNote}</p>
            </div>
            <div className="shrink-0">
              <ButtonLink
                href={`${base}/contact`}
                variant="inverted"
                size="lg"
              >
                {tx.cta.contactUs}
              </ButtonLink>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
