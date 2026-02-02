import type { Locale } from "@/lib/i18n";
import type { EducationEvent, EducationArticle } from "@/lib/types";

export type { EducationEvent, EducationArticle };

import articlesEn from "@/content/education/articles.en.json";
import articlesId from "@/content/education/articles.id.json";
import eventsEn from "@/content/education/events.en.json";
import eventsId from "@/content/education/events.id.json";

export function listEvents(locale: Locale): EducationEvent[] {
  return (locale === "id" ? eventsId : eventsEn) as EducationEvent[];
}

export function listArticles(locale: Locale): EducationArticle[] {
  return (locale === "id" ? articlesId : articlesEn) as EducationArticle[];
}

export function getEventBySlug(locale: Locale, slug: string): EducationEvent | null {
  return listEvents(locale).find((e) => e.slug === slug) ?? null;
}


export function calculateReadTime(content: string[]): number {
  const text = content.join(" ");
  if (!text.trim()) return 0;
  const wpm = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}

export function getArticleBySlug(locale: Locale, slug: string): (EducationArticle & { readTime: number }) | null {
  const article = listArticles(locale).find((a) => a.slug === slug);
  if (!article) return null;

  return {
    ...article,
    readTime: calculateReadTime(article.body)
  };
}

