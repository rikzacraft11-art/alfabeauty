import type { Metadata } from "next";
import { PartnershipPageContent } from "@/features/partnership/components/partnership-page-content";
import { FAQSection } from "@/shared/components/layout/faq-section";
import { PreFooterCTA } from "@/shared/components/layout/pre-footer-cta";

export const metadata: Metadata = {
    title: "Become a Partner",
    description:
        "Partner with PT Alfa Beauty Cosmetica. Access trusted global professional haircare brands, technical education, and nationwide distribution support for your salon or barbershop.",
    alternates: { canonical: "/partnership" },
};

export default function PartnershipPage(): React.JSX.Element {
    return (
        <>
            <PartnershipPageContent />
            <FAQSection />
            <PreFooterCTA />
        </>
    );
}
