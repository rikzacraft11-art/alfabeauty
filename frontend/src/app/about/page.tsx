import type { Metadata } from "next";
import { AboutPageContent } from "@/features/about";
import { FAQSection, CertificationBadges, PreFooterCTA } from "@/features/home";
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
    `${SITE_NAME} is a professional haircare distribution company specializing in salon and barber products. 18+ years of experience serving Indonesia's professional haircare industry.`;

export const metadata: Metadata = {
    title: "About Us",
    description: PAGE_DESCRIPTION,
    alternates: { canonical: `${baseUrl}/about` },
};

export default function AboutPage(): React.JSX.Element {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "@id": `${baseUrl}/about#webpage`,
                name: `About Us — ${SITE_NAME}`,
                description: PAGE_DESCRIPTION,
                url: `${baseUrl}/about`,
                inLanguage: "id-ID",
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "About Us", item: `${baseUrl}/about` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={structuredData} />
            <AboutPageContent />
            <FAQSection />
            <CertificationBadges />
            <PreFooterCTA />
        </main>
    );
}
