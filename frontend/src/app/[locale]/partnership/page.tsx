import type { Metadata } from "next";

import PartnershipContent from "@/components/partnership/PartnershipContent";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tx = t(locale);
  const path = `/${locale}/partnership`;

  return {
    title: tx.partnership.title,
    description: tx.seo.partnershipDescription,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/partnership",
        id: "/id/partnership",
      },
    },
  };
}

export default function PartnershipPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-12">
      <PartnershipContent />
    </div>
  );
}
