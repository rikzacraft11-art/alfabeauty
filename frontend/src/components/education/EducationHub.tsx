"use client";

import { t } from "@/lib/i18n";
import { listArticles, listEvents } from "@/lib/education";

import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
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
        <p className="type-kicker">{tx.nav.education}</p>
        <h1 className="type-h2">{tx.education.hub.title}</h1>
        <p className="type-body max-w-2xl">{tx.education.hub.lede}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="type-kicker text-foreground">{tx.education.hub.sections.events}</h2>

          <div className="space-y-3">
            {events.map((e) => (
              <Card key={e.slug} className="p-5">
                <div className="space-y-2">
                  <p className="type-kicker">
                    {e.city} • {e.date}
                  </p>
                  <AppLink
                    href={`${base}/education/events/${e.slug}`}
                    className="type-h3 hover:underline"
                  >
                    {e.title}
                  </AppLink>
                  <p className="type-body">{e.excerpt}</p>
                  <p className="type-data">
                    {tx.education.hub.labels.audience}: {e.audience.join(", ")}
                  </p>
                  <div className="pt-2">
                    <ButtonLink href={`${base}/education/events/${e.slug}`} variant="secondary" size="sm">
                      {tx.education.hub.actions.viewDetails}
                    </ButtonLink>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="type-kicker text-foreground">{tx.education.hub.sections.articles}</h2>

          <div className="space-y-3">
            {articles.map((a) => (
              <Card key={a.slug} className="p-5">
                <div className="space-y-2">
                  <p className="type-kicker">{a.date}</p>
                  <AppLink
                    href={`${base}/education/articles/${a.slug}`}
                    className="type-h3 hover:underline"
                  >
                    {a.title}
                  </AppLink>
                  <p className="type-body">{a.excerpt}</p>
                  <div className="pt-2">
                    <ButtonLink href={`${base}/education/articles/${a.slug}`} variant="secondary" size="sm">
                      {tx.education.hub.actions.read}
                    </ButtonLink>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border border-border bg-panel p-6">
        <p className="type-body">{tx.education.hub.trainingNote}</p>
      </section>
    </div>
  );
}
