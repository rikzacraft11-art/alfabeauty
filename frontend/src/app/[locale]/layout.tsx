import { notFound } from "next/navigation";
import type { Metadata } from "next";

import WebVitalsReporter from "@/components/analytics/WebVitalsReporter";
import StructuredData from "@/components/seo/StructuredData";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import V2LayoutWrapper from "@/components/v2/V2LayoutWrapper";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "id") return {};

  return {
    openGraph: {
      locale: locale === "id" ? "id_ID" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: Locale }> {
  return [{ locale: "en" }, { locale: "id" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "id") notFound();

  // V2 skips manual "Skip to content" link here as it's included in V2LayoutWrapper (SkipLink component)

  return (
    <LocaleProvider defaultLocale={locale}>
      <StructuredData />
      <WebVitalsReporter />
      <V2LayoutWrapper>
        {children}
      </V2LayoutWrapper>
    </LocaleProvider>
  );
}
