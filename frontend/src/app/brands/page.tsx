import * as React from "react";
import type { Metadata } from "next";
import { BrandDirectoryShowcase } from "@/features/brands";
import { PreFooterCTA } from "@/features/home";

export const metadata: Metadata = {
    title: "Brand Portfolios — PT Alfa Beauty Cosmetica",
    description: "Explore our world-class brand portfolios: Alfaparf Milano, Farmavita, Montibello, Gamma+ Professional, CORE, and SMOOVEE Hair & Body Care.",
    alternates: { canonical: "/brands" },
};

export default function BrandsPage(): React.JSX.Element {
    return (
        <main className="relative z-10 bg-[#FAF9F7]">
            <BrandDirectoryShowcase />
            <PreFooterCTA />
        </main>
    );
}
