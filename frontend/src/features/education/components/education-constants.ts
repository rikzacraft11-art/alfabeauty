/* ─────────────────────────────────────────────────────────────────────
 * Education — Lightweight Constants (client-safe)
 *
 * Extracted from education-data.ts so that client components
 * (e.g. EducationEventsFilter) can import only these tiny constants
 * without pulling the full events/articles data into the client bundle.
 * ───────────────────────────────────────────────────────────────────── */

export type EventType = "training" | "workshop" | "masterclass" | "event";

const eventTypeLabels: Record<EventType, string> = {
    training: "Technical Training",
    workshop: "Workshop",
    masterclass: "Masterclass",
    event: "Industry Event",
};

export const eventTypeFilters: { id: EventType | "all"; label: string }[] = [
    { id: "all", label: "All Events" },
    { id: "training", label: "Training" },
    { id: "workshop", label: "Workshop" },
    { id: "masterclass", label: "Masterclass" },
    { id: "event", label: "Events" },
];

export function getEventTypeLabel(type: EventType): string {
    return eventTypeLabels[type];
}
