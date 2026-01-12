import type { Metadata } from "next";

import ContactContent from "@/components/contact/ContactContent";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tx = t(locale);
  const path = `/${locale}/contact`;

  return {
    title: tx.contact.title,
    description: tx.seo.contactDescription,
    alternates: {
      canonical: path,
      languages: {
        en: "/en/contact",
        id: "/id/contact",
      },
    },
  };
}

export default function ContactPage() {
  const fallbackEmail = process.env.NEXT_PUBLIC_FALLBACK_EMAIL;
  return <ContactContent fallbackEmail={fallbackEmail} />;
}
