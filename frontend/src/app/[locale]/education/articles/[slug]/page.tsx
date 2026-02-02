import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EducationArticleDetailClient from "@/components/education/EducationArticleDetailClient";
import ArticleSchema from "@/components/seo/ArticleSchema";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const fullUrl = `${siteUrl.replace(/\/$/, "")}${path}`;
  const fallbackImage = `${siteUrl.replace(/\/$/, "")}/images/education/training-placeholder.jpg`;

  const title = article?.title ?? "Article";
  const description = article?.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/education/articles/${slug}`,
        id: `/id/education/articles/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Alfa Beauty Cosmetica",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
      publishedTime: article?.date ? new Date(article.date).toISOString() : undefined,
      images: [{ url: fallbackImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fallbackImage],
    },
  };
}

export default async function EducationArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug, locale } = await params;

  // Verify existence (Server-Side 404)
  const article = getArticleBySlug(locale, slug) ?? getArticleBySlug(locale === "en" ? "id" : "en", slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-12">
      <ArticleSchema article={article} locale={locale} />
      <EducationArticleDetailClient slug={slug} />
    </div>
  );
}
