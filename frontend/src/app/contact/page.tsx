import type { Metadata } from "next";
import { ContactPageContent } from "@/features/contact/components/contact-page-content";
import { PreFooterCTA } from "@/features/home";
import {
    SITE_NAME,
    SITE_BASE_URL,
    WHATSAPP_NUMBER,
    SITE_ADDRESS,
    CONTACT_EMAIL,
    OPERATING_HOURS,
} from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
    `Get in touch with ${SITE_NAME}. Reach out for product inquiries, partnership opportunities, training information, or general support.`;

export const metadata: Metadata = {
    title: "Contact Us",
    description: PAGE_DESCRIPTION,
    alternates: { canonical: `${baseUrl}/contact` },
};

export default function ContactPage(): React.JSX.Element {
    const contactJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ContactPage",
                "@id": `${baseUrl}/contact#webpage`,
                url: `${baseUrl}/contact`,
                name: `Contact ${SITE_NAME}`,
                description:
                    `Official contact channel for ${SITE_NAME} customer support, brand partnerships, and academy masterclasses.`,
            },
            {
                "@type": "Organization",
                "@id": `${baseUrl}/#organization`,
                name: SITE_NAME,
                url: baseUrl,
                email: CONTACT_EMAIL,
                contactPoint: [
                    {
                        "@type": "ContactPoint",
                        telephone: `+${WHATSAPP_NUMBER}`,
                        email: CONTACT_EMAIL,
                        contactType: "customer service",
                        availableLanguage: ["Indonesian", "English"],
                        hoursAvailable: {
                            "@type": "OpeningHoursSpecification",
                            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                            opens: OPERATING_HOURS.opens,
                            closes: OPERATING_HOURS.closes,
                        },
                    },
                ],
                address: {
                    "@type": "PostalAddress",
                    addressLocality: SITE_ADDRESS,
                    addressCountry: "ID",
                },
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Contact", item: `${baseUrl}/contact` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={contactJsonLd} />
            <ContactPageContent />
            <PreFooterCTA />
        </main>
    );
}
