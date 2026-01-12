import type { Metadata } from "next";

import EducationEventDetailClient from "@/components/education/EducationEventDetailClient";
import { getEventBySlug, listEvents } from "@/lib/education";
import type { Locale } from "@/lib/i18n";

export function generateStaticParams(): Array<{ locale: Locale; slug: string }> {
  return [
    ...listEvents("en").map((e) => ({ locale: "en" as const, slug: e.slug })),
    ...listEvents("id").map((e) => ({ locale: "id" as const, slug: e.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const event = getEventBySlug(locale, slug) ?? getEventBySlug(locale === "en" ? "id" : "en", slug);
  const path = `/${locale}/education/events/${slug}`;

  return {
    title: event?.title ?? "Event",
    description: event?.excerpt,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/education/events/${slug}`,
        id: `/id/education/events/${slug}`,
      },
    },
  };
}

export default async function EducationEventDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug } = await params;
  return <EducationEventDetailClient slug={slug} />;
}
