import * as React from "react";
import type { Metadata } from "next";
import { ShopGrid } from "@/features/catalog";
import { PreFooterCTA } from "@/features/home";

export const metadata: Metadata = {
    title: "Brand Portfolio & Product Catalog — Alfa Beauty Cosmetica",
    description: "Browse our complete catalog of professional products from Alfaparf, Farmavita, Montibello, Gamma+, and CORE.",
    alternates: { canonical: "/products" },
};

export default function BrandsPage(): React.JSX.Element {
    return (
        <>
            <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
                <ShopGrid />
            </React.Suspense>
            <PreFooterCTA />
        </>
    );
}
