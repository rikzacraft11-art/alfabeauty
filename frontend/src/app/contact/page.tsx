import type { Metadata } from "next";
import { ContactPageContent } from "@/features/contact/components/contact-page-content";
import { PreFooterCTA } from "@/features/home";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Get in touch with PT Alfa Beauty Cosmetica. Reach out for product inquiries, partnership opportunities, training information, or general support.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage(): React.JSX.Element {
    return (
        <>
            <ContactPageContent />
            <PreFooterCTA />
        </>
    );
}
