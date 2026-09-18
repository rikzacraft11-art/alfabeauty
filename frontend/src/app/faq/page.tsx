import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_NAME, SITE_SHORT_NAME } from "@/shared/lib/config";
import { FAQSection, DEFAULT_FAQ, PreFooterCTA } from "@/features/home";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: `Find answers to common questions about ${SITE_SHORT_NAME} products, ordering, shipping, and partnerships.`,
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
        description: "Official questions and answers about professional haircare products, salon partnerships, education, and distribution in Indonesia.",
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
