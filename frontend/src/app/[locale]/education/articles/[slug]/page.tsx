import type { Metadata } from "next";

import EducationArticleDetailClient from "@/components/education/EducationArticleDetailClient";
import { getArticleBySlug, listArticles } from "@/lib/education";
import type { Locale } from "@/lib/i18n";

export function generateStaticParams(): Array<{ locale: Locale; slug: string }> {
  return [
    ...listArticles("en").map((a) => ({ locale: "en" as const, slug: a.slug })),
    ...listArticles("id").map((a) => ({ locale: "id" as const, slug: a.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const article =
    getArticleBySlug(locale, slug) ?? getArticleBySlug(locale === "en" ? "id" : "en", slug);
  const path = `/${locale}/education/articles/${slug}`;

  return {
    title: article?.title ?? "Article",
    description: article?.excerpt,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/education/articles/${slug}`,
        id: `/id/education/articles/${slug}`,
      },
    },
  };
}

export default async function EducationArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug } = await params;
  return <EducationArticleDetailClient slug={slug} />;
}
