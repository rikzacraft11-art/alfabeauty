import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventDetailContent } from "@/features/education/components/event-detail-content";
import {
    getAllEventIds,
    getEventById,
} from "@/features/education/components/education-data";
import { SITE_BASE_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

/* Static generation for all event pages */
export function generateStaticParams(): { id: string }[] {
    return getAllEventIds().map((id) => ({ id }));
}

type Props = {
    params: Promise<{ id: string }>;
};

/* Dynamic metadata */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const event = getEventById(id);
    if (!event) return { title: "Event Not Found" };

    return {
        title: event.title,
        description: event.description,
        alternates: { canonical: `${baseUrl}/education/events/${id}` },
        openGraph: {
            title: event.title,
            description: event.description,
            url: `${baseUrl}/education/events/${id}`,
            type: "website",
            images: [
                {
                    url: `${baseUrl}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: event.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: event.title,
            description: event.description,
            images: [`${baseUrl}/opengraph-image`],
        },
    };
}

export default async function EventDetailPage({ params }: Props): Promise<React.JSX.Element> {
    const { id } = await params;
    const event = getEventById(id);

    if (!event) notFound();

    const eventJsonLd = {
        "@type": "EducationEvent",
        "@id": `${baseUrl}/education/events/${id}#event`,
        url: `${baseUrl}/education/events/${id}`,
        name: event.title,
        description: event.description,
        inLanguage: "id-ID",
        startDate: event.date,
        ...(event.endDate ? { endDate: event.endDate } : {}),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
            "@type": "Place",
            name: event.location,
        },
        organizer: {
            "@type": "Organization",
            name: `${SITE_SHORT_NAME} Academy`,
            url: `${baseUrl}/education`,
        },
    };

    const breadcrumbJsonLd = createBreadcrumbList([
        { name: "Home", item: baseUrl },
        { name: "Education", item: `${baseUrl}/education` },
        { name: "Events", item: `${baseUrl}/education/events` },
        { name: event.title, item: `${baseUrl}/education/events/${id}` },
    ]);

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [eventJsonLd, breadcrumbJsonLd],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={structuredData} />
            <EventDetailContent event={event} />
        </main>
    );
}
