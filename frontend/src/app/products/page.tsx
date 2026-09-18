import * as React from "react";
import type { Metadata } from "next";
import { ShopGrid } from "@/features/catalog";
import { PreFooterCTA } from "@/features/home";
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import { JsonLd, CatalogLoadingSkeleton, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
    "Browse our complete catalog of professional Italian & Spanish salon products from Alfaparf, Farmavita, Montibello, Gamma+, and CORE.";

export const metadata: Metadata = {
    title: `Product Catalog — ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: `${baseUrl}/products` },
};

export default function ProductsPage(): React.JSX.Element {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}/products#webpage`,
                name: `Product Catalog — ${SITE_NAME}`,
                description: PAGE_DESCRIPTION,
                url: `${baseUrl}/products`,
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Products", item: `${baseUrl}/products` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={structuredData} />
            <React.Suspense fallback={<CatalogLoadingSkeleton label="Loading product catalog..." />}>
                <ShopGrid />
            </React.Suspense>
            <PreFooterCTA />
        </main>
    );
}
