"use client";

import Link from "next/link";

import { getArticleBySlug } from "@/lib/education";
import { t } from "@/lib/i18n";

import { useLocale } from "@/components/i18n/LocaleProvider";
import Button from "@/components/ui/Button";

export default function EducationArticleDetailClient({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;
  const article = slug ? getArticleBySlug(locale, slug) : null;

  if (!article) {
    return (
      <div className="space-y-4">
        <h1 className="type-h2">{tx.education.article.notFound.title}</h1>
        <p className="type-body text-zinc-700">{tx.education.article.notFound.body}</p>
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
        <p className="type-kicker text-zinc-600">{article.date}</p>
        <h1 className="type-h2">{article.title}</h1>
        <p className="type-body text-zinc-700">{article.excerpt}</p>
        <div className="pt-2">
          <Link href={`${base}/education`}>
            <Button variant="secondary" size="sm">
              {tx.education.common.backToEducation}
            </Button>
          </Link>
        </div>
      </header>

      <div className="space-y-4">
        {article.body.map((p, idx) => (
          <p key={idx} className="type-body leading-7 text-zinc-800">
            {p}
          </p>
        ))}
      </div>

      <footer className="type-data border-t border-zinc-200 pt-6 text-zinc-600">
        {tx.education.article.footer}
      </footer>
    </article>
  );
}
