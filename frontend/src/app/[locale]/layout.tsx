import { notFound } from "next/navigation";
import type { Metadata } from "next";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import WhatsAppStickyCTA from "@/components/site/WhatsAppStickyCTA";
import WebVitalsReporter from "@/components/analytics/WebVitalsReporter";
import StructuredData from "@/components/seo/StructuredData";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "id") return {};

  // Locale-correct OpenGraph hint (important for bilingual SEO).
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

  return (
    <LocaleProvider defaultLocale={locale}>
      <div className="min-h-dvh bg-white text-zinc-950">
        <StructuredData />
        <SiteHeader />
        <WebVitalsReporter />
        <main className="mx-auto w-full max-w-[80rem] px-4 py-10 sm:px-6">{children}</main>
        <SiteFooter />
        <WhatsAppStickyCTA />
      </div>
    </LocaleProvider>
  );
}
