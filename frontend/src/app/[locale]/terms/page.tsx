import type { Metadata } from "next";

import TermsPageContent from "@/components/legal/TermsPageContent";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tx = t(locale);
  const path = `/${locale}/terms`;

  return {
    title: tx.legal.termsTitle,
    description: tx.seo.termsDescription,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/terms",
        id: "/id/terms",
      },
    },
  };
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-12">
      <TermsPageContent />
    </div>
  );
}
