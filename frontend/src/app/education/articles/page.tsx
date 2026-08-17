import type { Metadata } from "next";
import { EducationPageContent } from "@/components/education/education-page-content";
import { PreFooterCTA } from "@/components/sections/pre-footer-cta";

export const metadata: Metadata = {
    title: "Articles & Knowledge Base — Alfa Beauty Academy",
    description:
        "Professional haircare insights, coloring guides, and salon business knowledge from industry experts.",
    alternates: { canonical: "/education/articles" },
};

export default function EducationArticlesPage(): React.JSX.Element {
    return (
        <>
            <EducationPageContent />
            <PreFooterCTA />
        </>
    );
}
