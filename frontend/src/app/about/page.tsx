import type { Metadata } from "next";
import { AboutPageContent } from "@/features/about/components/about-page-content";
import { FAQSection, CertificationBadges, PreFooterCTA } from "@/features/home";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "PT Alfa Beauty Cosmetica is a professional haircare distribution company specializing in salon and barber products. 18+ years of experience serving Indonesia's professional haircare industry.",
    alternates: { canonical: "/about" },
};

export default function AboutPage(): React.JSX.Element {
    return (
        <>
            <AboutPageContent />
            <FAQSection />
            <CertificationBadges />
            <PreFooterCTA />
        </>
    );
}
