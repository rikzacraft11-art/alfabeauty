import type { Metadata } from "next";
import { EducationPageContent } from "@/features/education/components/education-page-content";
import { PreFooterCTA } from "@/features/home";
import { SITE_BASE_URL, SITE_NAME, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

export const metadata: Metadata = {
    title: "Education & Events",
    description:
        "Technical trainings, workshops, and masterclasses for salon and barber professionals. Supported by Alfaparf Milano, Farmavita, Montibello, and Gamma+ Professional.",
    alternates: { canonical: `${baseUrl}/education` },
};

export default function EducationPage(): React.JSX.Element {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "EducationalOrganization",
                "@id": `${baseUrl}/education#academy`,
                name: `${SITE_SHORT_NAME} Academy`,
                url: `${baseUrl}/education`,
                description:
                    "Technical trainings, workshops, and masterclasses for salon and barber professionals in Indonesia.",
                parentOrganization: {
                    "@type": "Organization",
                    name: SITE_NAME,
                    url: baseUrl,
                },
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Education", item: `${baseUrl}/education` },
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
