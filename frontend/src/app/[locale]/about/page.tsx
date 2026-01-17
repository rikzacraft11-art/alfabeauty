import type { Metadata } from "next";

import AboutContent from "@/components/about/AboutContent";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tx = t(locale);
  const path = `/${locale}/about`;

  return {
    title: tx.about.title,
    description: tx.seo.aboutDescription,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/about",
        id: "/id/about",
      },
    },
  };
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-12">
      <AboutContent />
    </div>
  );
}
