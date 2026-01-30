"use client";

import { getEventBySlug } from "@/lib/education";
import { useTranslations } from "@/hooks/useTranslations";
import { formatDate } from "@/lib/i18n";

import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import Card from "@/components/ui/Card";
import { IconChevronRight, IconCalendar, IconMapPin, IconDocument, IconUsers } from "@/components/ui/icons";

export default function EducationEventDetailClient({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const tx = useTranslations();
  const base = `/${locale}`;
  const event = slug ? getEventBySlug(locale, slug) : null;

  if (!event) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="h-16 w-16 rounded-full bg-subtle flex items-center justify-center">
          <IconCalendar className="h-8 w-8 text-muted" />
        </div>
        <div className="space-y-2">
          <h1 className="type-h3">{tx.education.event.notFound.title}</h1>
          <p className="type-body text-muted max-w-md">{tx.education.event.notFound.body}</p>
        </div>
        <AppLink
          href={`${base}/education`}
          className="inline-flex items-center gap-2 type-body-strong text-foreground hover:underline"
        >
          ← {tx.education.common.backToEducation}
        </AppLink>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 type-data text-muted">
        <AppLink
          href={`${base}/education`}
          className="hover:text-foreground transition-colors"
        >
          {tx.nav.education}
        </AppLink>
        <IconChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate">{event.title}</span>
      </nav>

      {/* Event Content */}
      <article className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 type-data text-muted">
              <span className="inline-flex items-center gap-1">
                <IconMapPin className="h-4 w-4" />
                {event.city}
              </span>
              <span className="inline-flex items-center gap-1">
                <IconCalendar className="h-4 w-4" />
                {formatDate(event.date, locale)}
              </span>
            </div>
            <h1 className="type-h1">{event.title}</h1>
            <p className="type-body text-muted-strong">{event.excerpt}</p>
            <div className="flex items-center gap-3 type-data text-muted">
              <IconDocument className="h-4 w-4" />
              <span>{event.type}</span>
            </div>
            <div className="flex items-center gap-2 type-data text-muted">
              <IconUsers className="h-4 w-4" />
              <span>{tx.education.hub.labels.audience}: {event.audience.join(", ")}</span>
            </div>
          </header>

          <div className="space-y-6 border-t border-border pt-8">
            {event.body.map((p, idx) => (
              <p key={idx} className="type-body text-muted-strong">
                {p}
              </p>
            ))}
          </div>

          <footer className="border-t border-border pt-6">
            <p className="type-data text-muted">{tx.education.event.note}</p>
          </footer>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="p-6 space-y-4 sticky top-24 bg-subtle">
            <h2 className="type-h3">{tx.education.event.interested}</h2>
            <p className="type-body text-muted-strong">
              {tx.education.event.contactBody}
            </p>
            <div className="flex flex-col gap-3">
              <ButtonLink href={`${base}/contact`} variant="primary" size="md">
                {event.cta_label}
              </ButtonLink>
              <ButtonLink href={`${base}/education`} variant="secondary" size="md">
                {tx.education.common.backToEducation}
              </ButtonLink>
            </div>
          </Card>
        </aside>
      </article>
    </div>
  );
}
