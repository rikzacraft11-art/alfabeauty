import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventDetailContent } from "@/features/education/components/event-detail-content";
import {
    getAllEventIds,
    getEventById,
} from "@/features/education/components/education-data";

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

    return (
        <>
            <EventDetailContent event={event} />
        </>
    );
}
