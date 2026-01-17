import type { Metadata } from "next";

import EducationHub from "@/components/education/EducationHub";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tx = t(locale);
  const path = `/${locale}/education`;

  return {
    title: tx.nav.education,
    description: tx.seo.educationDescription,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/education",
        id: "/id/education",
      },
    },
  };
}

export default function EducationPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-10 py-12">
      <EducationHub />
    </div>
  );
}
