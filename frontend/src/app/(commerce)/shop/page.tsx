import * as React from "react";
import type { Metadata } from "next";
import { ShopGrid } from "@/features/catalog";
import { PreFooterCTA } from "@/features/home";
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import { JsonLd, CatalogLoadingSkeleton, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
    "Browse and purchase professional haircare products from leading Italian and Spanish brands.";

export const metadata: Metadata = {
    title: "Shop — Professional Haircare Distribution",
    description: `${PAGE_DESCRIPTION} Fast delivery across Indonesia.`,
    alternates: { canonical: `${baseUrl}/shop` },
};

export default function ShopPage(): React.JSX.Element {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${baseUrl}/shop#webpage`,
                name: `Shop — ${SITE_NAME}`,
                description: PAGE_DESCRIPTION,
                url: `${baseUrl}/shop`,
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Shop", item: `${baseUrl}/shop` },
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
