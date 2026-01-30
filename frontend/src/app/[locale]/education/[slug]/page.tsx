import StaggerReveal from "@/components/ui/StaggerReveal";
import Link from "next/link";

/**
 * Event Detail Page
 * Design V2: Editorial layout for event information.
 * Migrated from (v2) to production route.
 */

// Mock event data - would come from CMS in production
const MOCK_EVENT = {
    id: "1",
    title: "Advanced Color Techniques Workshop",
    date: "2026-02-15",
    time: "09:00 - 17:00 WIB",
    location: "Alfa Beauty Training Center, Jakarta",
    type: "workshop",
    description: `
        Join us for an exclusive hands-on workshop exploring advanced color techniques with 
        Alfaparf Milano's latest color innovations. This intensive one-day session covers:
        
        - Modern balayage and highlighting methods
        - Color correction and damage repair
        - Latest Italian color trends
        - Product application best practices
    `,
    instructor: "Marco Rossi",
    instructorTitle: "International Color Director, Alfaparf Milano",
    capacity: 20,
    price: "Rp 2.500.000",
    image: "/images/events/color-workshop.jpg",
};

export default function EventDetailPage({ params }: { params: { slug: string } }) {
    // In production, fetch event by params.slug
    const event = MOCK_EVENT;

    return (
        <main className="min-h-screen bg-background pt-32 pb-24">
            <div className="container mx-auto px-6 lg:px-12">
                <StaggerReveal delay={0.1} staggerDelay={0.1}>
                    {/* Back Link */}
                    <Link
                        href="/education"
                        className="inline-flex items-center gap-2 type-data text-muted hover:text-foreground transition-colors mb-8"
                    >
                        <span>←</span>
                        <span>Back to Education</span>
                    </Link>

                    {/* Event Header */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        {/* Image */}
                        <div
                            className="aspect-video rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900"
                            style={{ boxShadow: "var(--shadow-elegant)" }}
                        />

                        {/* Details */}
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-panel type-data text-muted mb-4 capitalize">
                                {event.type}
                            </span>

                            <h1 className="type-h1 text-foreground mb-6">
                                {event.title}
                            </h1>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="type-body text-muted">📅</span>
                                    <span className="type-body text-foreground">{event.date}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="type-body text-muted">🕐</span>
                                    <span className="type-body text-foreground">{event.time}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="type-body text-muted">📍</span>
                                    <span className="type-body text-foreground">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="type-body text-muted">👤</span>
                                    <span className="type-body text-foreground">{event.instructor}</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-panel border border-border">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="type-data text-muted">Investment</span>
                                    <span className="type-h3 text-foreground">{event.price}</span>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="type-data text-muted">Available Seats</span>
                                    <span className="type-body text-foreground">{event.capacity}</span>
                                </div>
                                <a
                                    href="#"
                                    className="ui-btn-primary w-full py-4 text-center type-nav rounded-full block transition-all duration-[var(--transition-elegant)]"
                                >
                                    Register Now
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="max-w-3xl">
                        <h2 className="type-h2 text-foreground mb-6">About This Event</h2>
                        <div className="type-body text-foreground-muted whitespace-pre-line">
                            {event.description}
                        </div>

                        <div className="mt-8 p-6 rounded-2xl bg-panel border border-border">
                            <h3 className="type-h3 text-foreground mb-2">Instructor</h3>
                            <p className="type-body text-foreground">{event.instructor}</p>
                            <p className="type-data text-muted">{event.instructorTitle}</p>
                        </div>
                    </div>
                </StaggerReveal>
            </div>
        </main>
    );
}
