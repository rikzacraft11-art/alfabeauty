"use client";

import { getEventBySlug } from "@/lib/education";
import { t } from "@/lib/i18n";

import ButtonLink from "@/components/ui/ButtonLink";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function EducationEventDetailClient({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;
  const event = slug ? getEventBySlug(locale, slug) : null;

  if (!event) {
    return (
      <div className="space-y-4">
        <h1 className="type-h2">{tx.education.event.notFound.title}</h1>
        <p className="type-body">{tx.education.event.notFound.body}</p>
        <ButtonLink href={`${base}/education`} variant="secondary" size="sm">
          {tx.education.common.backToEducation}
        </ButtonLink>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="type-kicker">
          {event.city} • {event.date}
        </p>
        <h1 className="type-h2">{event.title}</h1>
        <p className="type-body">{event.excerpt}</p>
        <p className="type-data">
          {tx.education.hub.labels.audience}: {event.audience.join(", ")}
        </p>
        <div className="flex gap-3 pt-2">
          <ButtonLink href={`${base}/education`} variant="secondary" size="sm">
            {tx.education.common.backToEducation}
          </ButtonLink>
          <ButtonLink href={`${base}/contact`} size="sm">
            {event.cta_label}
          </ButtonLink>
        </div>
      </header>

      <div className="space-y-4">
        {event.body.map((p, idx) => (
          <p key={idx} className="type-body text-foreground-soft">
            {p}
          </p>
        ))}
      </div>

      <footer className="type-data border-t border-border pt-6">
        {tx.education.event.note}
      </footer>
    </article>
  );
}
