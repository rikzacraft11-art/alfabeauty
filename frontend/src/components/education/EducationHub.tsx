"use client";

import Link from "next/link";

import { t } from "@/lib/i18n";
import { listArticles, listEvents } from "@/lib/education";

import { useLocale } from "@/components/i18n/LocaleProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function EducationHub() {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;

  const events = listEvents(locale);
  const articles = listArticles(locale);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="type-kicker text-zinc-600">{tx.nav.education}</p>
        <h1 className="type-h2">{tx.education.hub.title}</h1>
        <p className="type-body max-w-2xl text-zinc-700">{tx.education.hub.lede}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="type-kicker text-zinc-900">{tx.education.hub.sections.events}</h2>

          <div className="space-y-3">
            {events.map((e) => (
              <Card key={e.slug} className="p-5">
                <div className="space-y-2">
                  <p className="type-kicker text-zinc-600">
                    {e.city} • {e.date}
                  </p>
                  <Link
                    href={`${base}/education/events/${e.slug}`}
                    className="type-h3 hover:underline"
                  >
                    {e.title}
                  </Link>
                  <p className="type-body text-zinc-700">{e.excerpt}</p>
                  <p className="type-data text-zinc-600">
                    {tx.education.hub.labels.audience}: {e.audience.join(", ")}
                  </p>
                  <div className="pt-2">
                    <Link href={`${base}/education/events/${e.slug}`}>
                      <Button variant="secondary" size="sm">
                        {tx.education.hub.actions.viewDetails}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="type-kicker text-zinc-900">{tx.education.hub.sections.articles}</h2>

          <div className="space-y-3">
            {articles.map((a) => (
              <Card key={a.slug} className="p-5">
                <div className="space-y-2">
                  <p className="type-kicker text-zinc-600">{a.date}</p>
                  <Link
                    href={`${base}/education/articles/${a.slug}`}
                    className="type-h3 hover:underline"
                  >
                    {a.title}
                  </Link>
                  <p className="type-body text-zinc-700">{a.excerpt}</p>
                  <div className="pt-2">
                    <Link href={`${base}/education/articles/${a.slug}`}>
                      <Button variant="secondary" size="sm">
                        {tx.education.hub.actions.read}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border border-zinc-200 bg-zinc-50 p-6">
        <p className="type-body text-zinc-700">{tx.education.hub.trainingNote}</p>
      </section>
    </div>
  );
}
