import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_NAME, SITE_SHORT_NAME } from "@/shared/lib/config";
import { FAQSection, DEFAULT_FAQ, PreFooterCTA } from "@/features/home";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
  `Find answers to common questions about ${SITE_SHORT_NAME} products, ordering, shipping, education, and salon partnerships.`;

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${baseUrl}/faq` },
};

export default function FAQPage(): React.JSX.Element {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/faq#faq`,
        name: `Frequently Asked Questions — ${SITE_NAME}`,
        description: PAGE_DESCRIPTION,
        url: `${baseUrl}/faq`,
        inLanguage: "id-ID",
        mainEntity: DEFAULT_FAQ.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      createBreadcrumbList([
        { name: "Home", item: baseUrl },
        { name: "FAQ", item: `${baseUrl}/faq` },
      ]),
    ],
  };

  return (
    <main id="main-content" className="relative z-10 bg-background pt-[var(--header-height)]">
      <JsonLd data={structuredData} />
      <FAQSection />
      <PreFooterCTA />
    </main>
  );
}
