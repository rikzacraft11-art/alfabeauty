import { notFound } from "next/navigation";
import type { Metadata } from "next";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import WhatsAppStickyCTA from "@/components/site/WhatsAppStickyCTA";
import CookieConsent from "@/components/site/CookieConsent";
import BackToTop from "@/components/ui/BackToTop";
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

  const skipLabel = locale === "id" ? "Lewati ke konten" : "Skip to content";

  return (
    <LocaleProvider defaultLocale={locale}>
      <div className="min-h-dvh bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only type-ui ui-focus-ring ui-radius-tight focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-border focus:bg-background focus:px-3 focus:py-2 focus:text-foreground"
        >
          {skipLabel}
        </a>
        <StructuredData />
        <SiteHeader />
        <WebVitalsReporter />
        <main id="main-content" className="w-full">
          {children}
        </main>
        <SiteFooter />
        <WhatsAppStickyCTA />
        <BackToTop />
        <CookieConsent />
      </div>
    </LocaleProvider>
  );
}
