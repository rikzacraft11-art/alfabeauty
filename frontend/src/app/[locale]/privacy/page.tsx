import type { Metadata } from "next";

import PrivacyPageContent from "@/components/legal/PrivacyPageContent";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tx = t(locale);
  const path = `/${locale}/privacy`;

  return {
    title: tx.legal.privacyTitle,
    description: tx.seo.privacyDescription,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/privacy",
        id: "/id/privacy",
      },
    },
  };
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-12">
      <PrivacyPageContent />
    </div>
  );
}
