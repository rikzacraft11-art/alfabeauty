import { notFound } from "next/navigation";
import type { Metadata } from "next";

import StructuredData from "@/components/seo/StructuredData";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
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

  // Skip to content link is included in LayoutWrapper (SkipLink component)

  return (
    <LocaleProvider defaultLocale={locale}>
      <StructuredData />
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </LocaleProvider>
  );
}
