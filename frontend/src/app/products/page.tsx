import * as React from "react";
import type { Metadata } from "next";
import { ProductsPageContent } from "@/components/products/products-page-content";
import {
    type ProductListItem,
    products,
    categories,
    brandFilters,
    audienceFilters,
} from "@/components/products/product-data";
import { PreFooterCTA } from "@/components/sections/pre-footer-cta";

export const metadata: Metadata = {
    title: "Product Catalog",
    description: "Browse our complete catalog of professional products from Alfaparf, Farmavita, Montibello, Gamma+, and CORE.",
    alternates: { canonical: "/products" },
};

const productListItems: ProductListItem[] = products.map(
    ({ id, name, brand, category, audience, description, image, variants, isNew }) => ({
        id, name, brand, category, audience, description, image, variants, isNew,
    })
);

export default function ProductsPage(): React.JSX.Element {
    return (
        <>
            <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
                <ProductsPageContent
                    products={productListItems}
                    categories={categories}
                    brandFilters={brandFilters}
                    audienceFilters={audienceFilters}
                />
            </React.Suspense>
            <PreFooterCTA />
        </>
    );
}
