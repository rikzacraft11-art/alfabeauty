"use client";

import { getArticleBySlug } from "@/lib/education";
import { t } from "@/lib/i18n";

import { useLocale } from "@/components/i18n/LocaleProvider";
import ButtonLink from "@/components/ui/ButtonLink";

export default function EducationArticleDetailClient({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;
  const article = slug ? getArticleBySlug(locale, slug) : null;

  if (!article) {
    return (
      <div className="space-y-4">
        <h1 className="type-h2">{tx.education.article.notFound.title}</h1>
        <p className="type-body">{tx.education.article.notFound.body}</p>
        <ButtonLink href={`${base}/education`} variant="secondary" size="sm">
          {tx.education.common.backToEducation}
        </ButtonLink>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="type-kicker">{article.date}</p>
        <h1 className="type-h2">{article.title}</h1>
        <p className="type-body">{article.excerpt}</p>
        <div className="pt-2">
          <ButtonLink href={`${base}/education`} variant="secondary" size="sm">
            {tx.education.common.backToEducation}
          </ButtonLink>
        </div>
      </header>

      <div className="space-y-4">
        {article.body.map((p, idx) => (
          <p key={idx} className="type-body text-foreground-soft">
            {p}
          </p>
        ))}
      </div>

      <footer className="type-data border-t border-border pt-6">
        {tx.education.article.footer}
      </footer>
    </article>
  );
}
