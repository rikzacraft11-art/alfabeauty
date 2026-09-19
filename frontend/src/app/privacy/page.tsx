import type { Metadata } from "next";
import { PrivacyPageContent } from "@/features/legal";
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
    `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your personal data.`;

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: PAGE_DESCRIPTION,
    alternates: { canonical: `${baseUrl}/privacy` },
};

export default function PrivacyPage(): React.JSX.Element {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/privacy#webpage`,
                name: `Privacy Policy — ${SITE_NAME}`,
                description: PAGE_DESCRIPTION,
                url: `${baseUrl}/privacy`,
                inLanguage: "id-ID",
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Privacy Policy", item: `${baseUrl}/privacy` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={structuredData} />
            <PrivacyPageContent />
        </main>
    );
}