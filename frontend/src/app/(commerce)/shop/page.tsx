import * as React from "react";
import type { Metadata } from "next";
import { ShopGrid } from "@/features/catalog";
import { PreFooterCTA } from "@/features/home";

export const metadata: Metadata = {
    title: "Shop — Professional Haircare Distribution",
    description: "Browse and purchase professional haircare products from leading Italian and Spanish brands. Fast delivery across Indonesia.",
    alternates: { canonical: "/shop" },
};

export default function ShopPage(): React.JSX.Element {
    return (
        <>
            <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
                <ShopGrid />
            </React.Suspense>
            <PreFooterCTA />
        </>
    );
}
