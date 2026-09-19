import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";
import { EducationPageContent } from "@/features/education";
import { PreFooterCTA } from "@/features/home";

const baseUrl = SITE_BASE_URL;

const PAGE_TITLE = `Articles & Knowledge Base — ${SITE_SHORT_NAME} Academy`;
const PAGE_DESCRIPTION =
    "Professional haircare insights, coloring guides, and salon business knowledge from industry experts.";

export const metadata: Metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: `${baseUrl}/education/articles` },
};

export default function EducationArticlesPage(): React.JSX.Element {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}/education/articles#webpage`,
                name: PAGE_TITLE,
                description: PAGE_DESCRIPTION,
                url: `${baseUrl}/education/articles`,
                inLanguage: "id-ID",
                isPartOf: {
                    "@type": "EducationalOrganization",
                    name: `${SITE_SHORT_NAME} Academy`,
                    url: `${baseUrl}/education`,
                },
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Education", item: `${baseUrl}/education` },
                { name: "Articles", item: `${baseUrl}/education/articles` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={structuredData} />
            <EducationPageContent />
            <PreFooterCTA />
        </main>
    );
}

