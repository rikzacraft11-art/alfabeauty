import Link from "next/link";
import {
    ArrowRight,
    Calendar,
    ChevronRight,
    Clock,
    MapPin,
    Star,
    Users,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { WhatsAppCTA } from "@/shared/components/ui/whatsapp-cta";
import { formatDate } from "@/shared/lib/utils";
import { FadeIn } from "@/shared/components/motion/fade-in";
import {
    type EducationEvent,
    getEventTypeLabel,
    getRelatedEvents,
} from "@/features/education/components/education-data";

/* ─────────────────────────────────────────────────────────────────────
 * Event Detail — Agency-Level Polish
 *
 *   §1. Breadcrumbs
 *   §2. Two-column: Image (left, sticky) + Info (right)
 *   §3. Register CTA (WhatsApp)
 *   §4. Details — long description + highlights
 *   §5. Related events
 * ───────────────────────────────────────────────────────────────────── */

export function EventDetailContent({
    event,
}: {
    event: EducationEvent;
}): React.JSX.Element {
    const relatedEvents = getRelatedEvents(event);
    const audienceLabel =
        event.audience === "both"
            ? "Salon & Barber"
            : event.audience === "salon"
                ? "Salon"
                : "Barber";

    const whatsappMessage =
        `Hi, saya ingin mendaftar untuk ${event.title} pada tanggal ${formatDate(event.date)} di ${event.location}.`;

    return (
        <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
            {/* ─── Breadcrumbs ─── */}
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-1.5 py-6 text-[12px] text-text-muted"
                >
                    <Link
                        href="/"
                        className="transition-colors hover:text-foreground"
                    >
                        Home
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link
                        href="/education"
                        className="transition-colors hover:text-foreground"
                    >
                        Education
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-semibold text-foreground truncate max-w-[200px]">
                        {event.title}
                    </span>
                </nav>
            </div>

            <Separator className="bg-border-warm/40" />

            {/* ─── Two-column layout ─── */}
            <div className="mx-auto max-w-[1400px] px-6 py-12 sm:px-8 lg:px-12 lg:py-20">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Left: Event image — sticky on desktop */}
                    <div className="relative">
                        <div className="lg:sticky lg:top-[88px] lg:self-start">
                            <div className="relative flex aspect-[4/3] sm:aspect-square items-center justify-center border border-border-warm/60 bg-gradient-to-br from-foreground/[0.02] to-foreground/[0.06]">
                                <div className="text-center">
                                    <Star className="mx-auto h-14 w-14 text-foreground/10" />
                                    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                        {event.brand}
                                    </p>
                                    <p className="mt-1 text-[11px] text-text-muted">
                                        Event photo placeholder
                                    </p>
                                </div>

                                {/* Type badge */}
                                <span className="absolute left-4 top-4 inline-block bg-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                                    {getEventTypeLabel(event.type)}
                                </span>

                                {/* Upcoming badge */}
                                {event.isUpcoming && (
                                    <span className="absolute right-4 top-4 inline-block bg-foreground/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                                        Upcoming
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Event info */}
                    <div>
                        {/* Brand & type */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                className="border-border-warm/60 text-[10px] uppercase tracking-[0.15em] text-text-muted"
                            >
                                {event.brand}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="border-border-warm/60 text-[10px] uppercase tracking-[0.15em] text-text-muted"
                            >
                                {audienceLabel}
                            </Badge>
                        </div>

                        <h1 className="mt-5 heading-display text-foreground">
                            {event.title}
                        </h1>

                        <p className="mt-5 body-prose">
                            {event.description}
                        </p>

                        {/* Event details grid */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="border border-border-warm/60 p-5 transition-all duration-300 hover:shadow-sm">
                                <Calendar className="h-4 w-4 text-foreground/40" />
                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                    Date
                                </p>
                                <p className="mt-1 text-[13px] font-semibold text-foreground">
                                    {formatDate(event.date)}
                                    {event.endDate &&
                                        ` – ${formatDate(event.endDate)}`}
                                </p>
                            </div>
                            <div className="border border-border-warm/60 p-5 transition-all duration-300 hover:shadow-sm">
                                <MapPin className="h-4 w-4 text-foreground/40" />
                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                    Location
                                </p>
                                <p className="mt-1 text-[13px] font-semibold text-foreground">
                                    {event.location}
                                </p>
                            </div>
                            <div className="border border-border-warm/60 p-5 transition-all duration-300 hover:shadow-sm">
                                <Clock className="h-4 w-4 text-foreground/40" />
                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                    Duration
                                </p>
                                <p className="mt-1 text-[13px] font-semibold text-foreground">
                                    {event.duration}
                                </p>
                            </div>
                            <div className="border border-border-warm/60 p-5 transition-all duration-300 hover:shadow-sm">
                                <Users className="h-4 w-4 text-foreground/40" />
                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                    Capacity
                                </p>
                                <p className="mt-1 text-[13px] font-semibold text-foreground">
                                    {event.capacity} seats
                                </p>
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="mt-6 border border-border-warm/60 p-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                Instructor / Led by
                            </p>
                            <p className="mt-1.5 text-[14px] font-semibold text-foreground">
                                {event.instructor}
                            </p>
                        </div>

                        {/* Register CTA */}
                        {event.isUpcoming ? (
                            <WhatsAppCTA
                                location="event_register"
                                message={whatsappMessage}
                                className="mt-8 flex w-full items-center justify-center gap-2.5 bg-foreground px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-foreground/90"
                            >
                                Register via WhatsApp
                            </WhatsAppCTA>
                        ) : (
                            <div className="mt-8 flex w-full items-center justify-center gap-2 bg-surface px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                Event has ended
                            </div>
                        )}

                        <Separator className="my-12 bg-border-warm/40" />

                        {/* Long description */}
                        <div>
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                About This Event
                            </h2>
                            <p className="mt-5 body-prose">
                                {event.longDescription}
                            </p>
                        </div>

                        {/* Highlights */}
                        {event.highlights.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                    What You&apos;ll Learn
                                </h2>
                                <div className="mt-5 space-y-3">
                                    {event.highlights.map(
                                        (highlight, i) => (
                                            <div
                                                key={highlight}
                                                className="flex items-start gap-4 border border-border-warm/60 p-5 transition-all duration-300 hover:shadow-sm"
                                            >
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-foreground text-[11px] font-bold text-white">
                                                    {i + 1}
                                                </span>
                                                <p className="text-[14px] leading-[1.75] text-charcoal">
                                                    {highlight}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Help section */}
                        <div className="mt-12 bg-surface p-7">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                Questions about this event?
                            </p>
                            <p className="mt-3 text-[13px] leading-[1.85] text-text-muted">
                                Contact our education team for more
                                information about this event, custom
                                training sessions, or group registrations.
                            </p>
                            <WhatsAppCTA
                                location="event_help"
                                message={`Hi, saya ingin bertanya tentang event "${event.title}".`}
                                variant="ghost"
                                className="mt-4 inline-flex items-center gap-2 p-0 h-auto text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-foreground/70 hover:bg-transparent"
                            >
                                Chat with us
                            </WhatsAppCTA>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="bg-border-warm/40" />

            {/* ─── Related Events ─── */}
            {relatedEvents.length > 0 && (
                <section className="bg-surface py-20 lg:py-28">
                <FadeIn>
                    <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                        <p className="eyebrow">
                            Related
                        </p>
                        <h2 className="mt-3 heading-section text-foreground">
                            You Might Also Be Interested In
                        </h2>

                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedEvents.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/education/events/${rel.id}`}
                                    className="group block border border-border-warm/60 bg-background transition-all duration-300 hover:shadow-sm"
                                >
                                    <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                                        <div className="text-center">
                                            <Calendar className="mx-auto h-8 w-8 text-text-muted/20" />
                                            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                                {rel.brand}
                                            </p>
                                        </div>
                                        <span className="absolute left-3 top-3 inline-block bg-foreground px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                                            {getEventTypeLabel(
                                                rel.type
                                            )}
                                        </span>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-[11px] text-text-muted">
                                            {formatDate(rel.date)} ·{" "}
                                            {rel.location}
                                        </p>
                                        <h3 className="mt-2.5 text-[14px] font-bold leading-snug text-foreground transition-colors group-hover:text-foreground/70">
                                            {rel.title}
                                        </h3>
                                        <div className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                            View Details
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </FadeIn>
                </section>
            )}
        </main>
    );
}


