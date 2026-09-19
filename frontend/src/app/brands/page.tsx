import * as React from "react";
import type { Metadata } from "next";
import { BrandDirectoryShowcase } from "@/features/brands";
import { brands } from "@/features/brands/data/brands";
import { PreFooterCTA } from "@/features/home";
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
    "Explore our world-class brand portfolios: Alfaparf Milano, Farmavita, Montibello, Gamma+ Professional, CORE, and SMOOVEE Hair & Body Care.";

export const metadata: Metadata = {
    title: `Brand Portfolios — ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: `${baseUrl}/brands` },
};

export default function BrandsPage(): React.JSX.Element {
    const brandsJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}/brands#webpage`,
                url: `${baseUrl}/brands`,
                name: `Brand Portfolios — ${SITE_NAME}`,
                description: PAGE_DESCRIPTION,
                inLanguage: "id-ID",
                mainEntity: {
                    "@type": "ItemList",
                    itemListElement: brands.map((brand, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        name: brand.fullName,
                        url: `${baseUrl}/brands/${brand.slug}`,
                    })),
                },
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Brands", item: `${baseUrl}/brands` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-surface-elevated">
            <JsonLd data={brandsJsonLd} />
            <BrandDirectoryShowcase />
            <PreFooterCTA />
        </main>
    );
}
