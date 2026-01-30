import type { EducationEvent } from "@/lib/types";

type Props = {
    event: EducationEvent;
};

/**
 * Event JSON-LD structured data.
 * Provides rich snippets for search engines (Name, Date, Location, Organizer).
 */
export default function EventSchema({ event }: Props) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const eventUrl = `${siteUrl.replace(/\/$/, "")}/education/events/${event.slug}`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "EducationEvent",
        name: event.title,
        description: event.excerpt,
        startDate: event.date,
        // End date defaults to same day if not specified, simplified for this implementation
        endDate: event.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
            "@type": "Place",
            name: event.city, // Simplified location
            address: {
                "@type": "PostalAddress",
                addressLocality: event.city,
                addressCountry: "ID"
            }
        },
        image: [
            // Fallback placeholder
            `${siteUrl.replace(/\/$/, "")}/images/education/event-placeholder.jpg`
        ],
        organizer: {
            "@type": "Organization",
            name: "PT Alfa Beauty Cosmetica",
            url: siteUrl
        },
        url: eventUrl,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            url: eventUrl
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
