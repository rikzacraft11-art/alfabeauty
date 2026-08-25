import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventDetailContent } from "@/features/education/components/event-detail-content";
import {
    getAllEventIds,
    getEventById,
} from "@/features/education/components/education-data";
import { SITE_DOMAIN, SITE_NAME } from "@/shared/lib/config";

/* Static generation for all event pages */
export function generateStaticParams(): { id: string }[] {
    return getAllEventIds().map((id) => ({ id }));
}

/* Dynamic metadata */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const event = getEventById(id);
    if (!event) return { title: "Event Not Found" };

    return {
        title: event.title,
        description: event.description,
        alternates: { canonical: `/education/events/${id}` },
    };
}

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
    const { id } = await params;
    const event = getEventById(id);

    if (!event) notFound();

    const eventJsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationEvent",
        name: event.title,
        description: event.description,
        startDate: event.date,
        location: {
            "@type": "Place",
            name: event.location,
        },
        organizer: {
            "@type": "Organization",
            name: `${SITE_NAME} Academy`,
            url: `${SITE_DOMAIN}/education`,
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_DOMAIN,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Education",
                item: `${SITE_DOMAIN}/education`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: event.title,
                item: `${SITE_DOMAIN}/education/events/${id}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <EventDetailContent event={event} />
        </>
    );
}
