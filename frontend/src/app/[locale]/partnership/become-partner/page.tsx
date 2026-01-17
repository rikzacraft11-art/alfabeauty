import type { Metadata } from "next";

import BecomePartnerContent from "@/components/partnership/BecomePartnerContent";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tx = t(locale);
  const path = `/${locale}/partnership/become-partner`;

  return {
    title: tx.cta.becomePartner,
    description: tx.seo.becomePartnerDescription,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/partnership/become-partner",
        id: "/id/partnership/become-partner",
      },
    },
  };
}

export default function BecomePartnerPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-12">
      <BecomePartnerContent />
    </div>
  );
}
