"use client";

import Link from "next/link";

import { getEventBySlug } from "@/lib/education";
import { t } from "@/lib/i18n";

import { useLocale } from "@/components/i18n/LocaleProvider";
import Button from "@/components/ui/Button";

export default function EducationEventDetailClient({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;
  const event = slug ? getEventBySlug(locale, slug) : null;

  if (!event) {
    return (
      <div className="space-y-4">
        <h1 className="type-h2">{tx.education.event.notFound.title}</h1>
        <p className="type-body text-zinc-700">{tx.education.event.notFound.body}</p>
          <Link href={`${base}/education`}>
          <Button variant="secondary" size="sm">
            {tx.education.common.backToEducation}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="type-kicker text-zinc-600">
          {event.city} • {event.date}
        </p>
        <h1 className="type-h2">{event.title}</h1>
        <p className="type-body text-zinc-700">{event.excerpt}</p>
        <p className="type-data text-zinc-600">
          {tx.education.hub.labels.audience}: {event.audience.join(", ")}
        </p>
        <div className="flex gap-3 pt-2">
          <Link href={`${base}/education`}>
            <Button variant="secondary" size="sm">
              {tx.education.common.backToEducation}
            </Button>
          </Link>
          <Link href={`${base}/contact`}>
            <Button size="sm">{event.cta_label}</Button>
          </Link>
        </div>
      </header>

      <div className="space-y-4">
        {event.body.map((p, idx) => (
          <p key={idx} className="type-body leading-7 text-zinc-800">
            {p}
          </p>
        ))}
      </div>

      <footer className="type-data border-t border-zinc-200 pt-6 text-zinc-600">
        {tx.education.event.note}
      </footer>
    </article>
  );
}
