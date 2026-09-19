import type { Metadata } from "next";
import { TermsPageContent } from "@/features/legal";
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
    `Terms and Conditions for ${SITE_NAME}'s website and services.`;

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description: PAGE_DESCRIPTION,
    alternates: { canonical: `${baseUrl}/terms` },
};

export default function TermsPage(): React.JSX.Element {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/terms#webpage`,
                name: `Terms & Conditions — ${SITE_NAME}`,
                description: PAGE_DESCRIPTION,
                url: `${baseUrl}/terms`,
                inLanguage: "id-ID",
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Terms & Conditions", item: `${baseUrl}/terms` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={structuredData} />
            <TermsPageContent />
        </main>
    );
}