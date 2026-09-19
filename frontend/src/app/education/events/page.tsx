import type { Metadata } from "next";
import { SITE_BASE_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";
import { EducationPageContent } from "@/features/education";
import { PreFooterCTA } from "@/features/home";

const baseUrl = SITE_BASE_URL;

const PAGE_TITLE = `Events & Seminars — ${SITE_SHORT_NAME} Academy`;
const PAGE_DESCRIPTION =
    `Explore upcoming workshops, technical masterclasses, and product training sessions by ${SITE_SHORT_NAME} Academy and international partner brands.`;

export const metadata: Metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: `${baseUrl}/education/events` },
};

export default function EducationEventsPage(): React.JSX.Element {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}/education/events#webpage`,
                name: PAGE_TITLE,
                description: PAGE_DESCRIPTION,
                url: `${baseUrl}/education/events`,
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
                { name: "Events", item: `${baseUrl}/education/events` },
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

