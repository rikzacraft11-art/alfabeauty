import type { Metadata } from "next";
import { PrivacyPageContent } from "@/features/legal/components/privacy-page-content";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Privacy Policy for PT Alfa Beauty Cosmetica. Learn how we collect, use, and protect your personal data.",
    alternates: { canonical: "/privacy" },
};

export default function PrivacyPage(): React.JSX.Element {
    return (
        <>
            <PrivacyPageContent />
        </>
    );
}