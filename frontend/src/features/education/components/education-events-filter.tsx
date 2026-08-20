"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Calendar,
    Clock,
    MapPin,
    Scissors,
    Search,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn, formatDate } from "@/shared/lib/utils";
import type { EducationEvent } from "@/features/education/components/education-data";
import {
    type EventType,
    eventTypeFilters,
    getEventTypeLabel,
} from "@/features/education/components/education-constants";

export function EducationEventsFilter({
    events,
}: {
    events: EducationEvent[];
}) {
    const [activeFilter, setActiveFilter] = useState<EventType | "all">(
        "all"
    );
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEvents = events.filter((event) => {
        const matchesType =
            activeFilter === "all" || event.type === activeFilter;
        const matchesSearch =
            searchQuery === "" ||
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="eyebrow">Upcoming Events</p>
                    <h2 className="mt-3 heading-section text-foreground">
                        Trainings &amp; Workshops
                    </h2>
                </div>

                {/* Search */}
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        aria-label="Search events"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-border-warm/60 bg-background py-2.5 pl-10 pr-4 text-[13px] outline-none transition-colors focus:border-foreground"
                    />
                </div>
            </div>

            {/* Type filter tabs */}
            <div className="mt-8 flex flex-wrap gap-2">
                {eventTypeFilters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        aria-pressed={activeFilter === filter.id}
                        className={cn(
                            "rounded-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            activeFilter === filter.id
                                ? "bg-foreground text-white shadow-sm"
                                : "bg-background text-text-muted border border-border-warm/60 hover:border-foreground/40 hover:text-foreground"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Events grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="mt-10 py-16 text-center">
                    <Scissors className="mx-auto h-10 w-10 text-text-muted/20" />
                    <p className="mt-4 text-[14px] font-semibold text-foreground">
                        No events found
                    </p>
                    <p className="mt-1.5 text-[13px] text-text-muted">
                        Try adjusting your filters or search terms.
                    </p>
                    <Button
                        variant="link"
                        onClick={() => {
                            setActiveFilter("all");
                            setSearchQuery("");
                        }}
                        className="mt-5 text-[12px] font-semibold text-foreground underline underline-offset-4 hover:text-foreground/70"
                    >
                        Clear all filters
                    </Button>
                </div>
            )}
        </>
    );
}

/* ─── Event Card Component ─── */

function EventCard({ event }: { event: EducationEvent }) {
    return (
        <Link
            href={`/education/events/${event.id}`}
            className="group block border border-border-warm/60 bg-background transition-all duration-300 hover:shadow-sm"
        >
            {/* Image placeholder */}
            <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                <div className="text-center">
                    <Calendar className="mx-auto h-8 w-8 text-text-muted/20" />
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                        {event.brand}
                    </p>
                </div>
                {/* Type badge */}
                <span className="absolute left-3 top-3 inline-block bg-foreground px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                    {getEventTypeLabel(event.type)}
                </span>
            </div>

            <div className="p-6">
                {/* Date row */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                    </span>
                </div>

                <h3 className="mt-3 text-[14px] font-bold leading-snug text-foreground transition-colors group-hover:text-foreground/70">
                    {event.title}
                </h3>

                <p className="mt-2 text-[13px] leading-[1.75] text-text-muted line-clamp-2">
                    {event.description}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge
                        variant="outline"
                        className="border-border-warm/60 text-[9px] uppercase tracking-[0.15em] text-text-muted"
                    >
                        {event.audience === "both"
                            ? "Salon & Barber"
                            : event.audience === "salon"
                                ? "Salon"
                                : "Barber"}
                    </Badge>
                    <Badge
                        variant="outline"
                        className="border-border-warm/60 text-[9px] uppercase tracking-[0.15em] text-text-muted"
                    >
                        <Clock className="mr-1 h-2.5 w-2.5" />
                        {event.duration}
                    </Badge>
                </div>

                <div className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                    View Details
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
            </div>
        </Link>
    );
}
