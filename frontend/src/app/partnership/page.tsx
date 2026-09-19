import type { Metadata } from "next";
import { PartnershipPageContent } from "@/features/partnership";
import { FAQSection, PreFooterCTA } from "@/features/home";
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
    `Partner with ${SITE_NAME}. Access trusted global professional haircare brands, technical education, and nationwide distribution support for your salon or barbershop.`;

export const metadata: Metadata = {
    title: "Become a Partner",
    description: PAGE_DESCRIPTION,
    alternates: { canonical: `${baseUrl}/partnership` },
};

export default function PartnershipPage(): React.JSX.Element {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/partnership#webpage`,
                name: `Become a Partner — ${SITE_NAME}`,
                description: PAGE_DESCRIPTION,
                url: `${baseUrl}/partnership`,
                inLanguage: "id-ID",
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Partnership", item: `${baseUrl}/partnership` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={structuredData} />
            <PartnershipPageContent />
            <FAQSection />
            <PreFooterCTA />
        </main>
    );
}
