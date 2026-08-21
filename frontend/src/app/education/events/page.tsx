import type { Metadata } from "next";
import { EducationPageContent } from "@/features/education/components/education-page-content";
import { PreFooterCTA } from "@/features/home";

export const metadata: Metadata = {
    title: "Events & Seminars — Alfa Beauty Academy",
    description:
        "Explore upcoming workshops, technical masterclasses, and product training sessions by Alfa Beauty Academy and international partner brands.",
    alternates: { canonical: "/education/events" },
};

export default function EducationEventsPage(): React.JSX.Element {
    return (
        <>
            <EducationPageContent />
            <PreFooterCTA />
        </>
    );
}
