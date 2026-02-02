import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EducationEventDetailClient from "@/components/education/EducationEventDetailClient";
import EventSchema from "@/components/seo/EventSchema";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const fullUrl = `${siteUrl.replace(/\/$/, "")}${path}`;
  const fallbackImage = `${siteUrl.replace(/\/$/, "")}/images/education/training-placeholder.jpg`;

  const title = event?.title ?? "Event";
  const description = event?.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: `/en/education/events/${slug}`,
        id: `/id/education/events/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Alfa Beauty Cosmetica",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
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

export default async function EducationEventDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug, locale } = await params;

  // Verify existence (Server-Side 404)
  const event = getEventBySlug(locale, slug) ?? getEventBySlug(locale === "en" ? "id" : "en", slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-12">
      <EventSchema event={event} locale={locale} />
      <EducationEventDetailClient slug={slug} />
    </div>
  );
}
