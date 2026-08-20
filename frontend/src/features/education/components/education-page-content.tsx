import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Calendar,
    MapPin,
    MessageCircle,
    Star,
    Users,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { WhatsAppCTA } from "@/shared/components/ui/whatsapp-cta";
import { formatDate } from "@/shared/lib/utils";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { EducationEventsFilter } from "@/features/education/components/education-events-filter";
import {
    articles,
    getEventTypeLabel,
    getFeaturedEvent,
    getPastEvents,
    getUpcomingEvents,
} from "@/features/education/components/education-data";
import { YEARS_OF_EXPERIENCE } from "@/shared/lib/config";

/* ─────────────────────────────────────────────────────────────────────
 * Education & Events Page — Agency-Level Polish
 *
 *   §1. Hero
 *   §2. Stats strip
 *   §3. Featured event
 *   §4. Upcoming events grid
 *   §5. Past events
 *   §6. Articles / Insights
 *   §7. CTA band
 * ───────────────────────────────────────────────────────────────────── */

export function EducationPageContent() {
    const featuredEvent = getFeaturedEvent();
    const upcomingEvents = getUpcomingEvents().filter(
        (e) => !e.isFeatured
    );
    const pastEvents = getPastEvents();

    return (
        <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
            {/* ─── §1: Hero Banner ─── */}
            <section className="bg-surface py-14 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
                        {/* Text side */}
                        <div className="flex flex-col justify-center">
                            <p className="eyebrow">
                                Education & Events
                            </p>
                            <h1 className="mt-4 heading-display text-foreground">
                                Educating the
                                <br />
                                Professional Market
                            </h1>
                            <p className="mt-7 max-w-lg body-prose">
                                Supported by a solid technical and sales
                                team, we actively educate the salon and
                                barber industry through technical
                                trainings, trend insights, and skill
                                enhancement for hairdressers, barbers, and
                                salon teams.
                            </p>
                            <p className="mt-6 text-[13px] italic leading-[1.85] text-text-muted">
                                &ldquo;We believe long-term success is
                                built on knowledge, not short-term
                                tactics.&rdquo;
                            </p>
                        </div>

                        {/* Image placeholder */}
                        <div className="flex items-center justify-center">
                            <div className="flex aspect-[16/9] sm:aspect-[4/3] w-full items-center justify-center border border-dashed border-border-warm/60 bg-surface-elevated">
                                <div className="text-center">
                                    <BookOpen className="mx-auto h-10 w-10 text-text-muted/30" />
                                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                        Education &amp; Training
                                    </p>
                                    <p className="mt-1 text-[11px] text-text-muted">
                                        Photo placeholder
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── §2: Stats Strip ─── */}
            <FadeIn>
            <section
                className="border-y border-border-warm/60 bg-background py-14"
            >
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-3 sm:px-8 lg:px-12">
                    {[
                        {
                            value: YEARS_OF_EXPERIENCE,
                            label: "Years of Experience",
                            sub: "In salon & barber industry",
                        },
                        {
                            value: "4",
                            label: "Global Brands",
                            sub: "Italy & Spain",
                        },
                        {
                            value: "Nationwide",
                            label: "Training Network",
                            sub: "Jakarta, Surabaya, Bandung, Bali & more",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center lg:text-left"
                        >
                            <p className="text-[2rem] font-bold tracking-tight text-foreground lg:text-[2.5rem]">
                                {stat.value}
                            </p>
                            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                                {stat.label}
                            </p>
                            <p className="mt-1 text-[12px] text-text-muted">
                                {stat.sub}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            </FadeIn>

            {/* ─── §3: Featured Event ─── */}
            {featuredEvent && (
                <FadeIn>
                <section
                    className="bg-background py-14 sm:py-20 lg:py-28"
                >
                    <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                        <p className="eyebrow">
                            Featured Event
                        </p>
                        <h2 className="mt-3 heading-section text-foreground">
                            Don&apos;t Miss This
                        </h2>

                        <Link
                            href={`/education/events/${featuredEvent.id}`}
                            className="group mt-10 block"
                        >
                            <div className="grid grid-cols-1 gap-0 overflow-hidden border border-border-warm/60 transition-all duration-300 hover:shadow-sm lg:grid-cols-2">
                                {/* Image area */}
                                <div className="relative flex aspect-[16/9] sm:aspect-[16/10] items-center justify-center bg-gradient-to-br from-foreground/[0.02] to-foreground/[0.06] lg:aspect-auto lg:min-h-[400px]">
                                    <div className="text-center">
                                        <Star className="mx-auto h-12 w-12 text-foreground/15" />
                                        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                            {featuredEvent.brand}
                                        </p>
                                        <p className="mt-1 text-[11px] text-text-muted">
                                            Event photo placeholder
                                        </p>
                                    </div>
                                    {/* Type badge */}
                                    <span className="absolute left-4 top-4 inline-block bg-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                                        {getEventTypeLabel(
                                            featuredEvent.type
                                        )}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-12">
                                    <div className="flex flex-wrap items-center gap-4 text-[12px] text-text-muted">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {formatDate(
                                                featuredEvent.date
                                            )}
                                            {featuredEvent.endDate &&
                                                ` – ${formatDate(featuredEvent.endDate)}`}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {featuredEvent.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Users className="h-3.5 w-3.5" />
                                            {featuredEvent.capacity}{" "}
                                            seats
                                        </span>
                                    </div>

                                    <h3 className="mt-5 text-[1.5rem] font-bold leading-[1.2] tracking-[-0.015em] text-foreground transition-colors group-hover:text-foreground/70 lg:text-[1.75rem]">
                                        {featuredEvent.title}
                                    </h3>

                                    <p className="mt-4 text-[14px] leading-[1.85] text-charcoal">
                                        {featuredEvent.description}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Badge
                                            variant="outline"
                                            className="border-border-warm/60 text-[10px] uppercase tracking-[0.15em] text-text-muted"
                                        >
                                            {featuredEvent.brand}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="border-border-warm/60 text-[10px] uppercase tracking-[0.15em] text-text-muted"
                                        >
                                            {featuredEvent.audience ===
                                                "both"
                                                ? "Salon & Barber"
                                                : featuredEvent.audience ===
                                                    "salon"
                                                    ? "Salon"
                                                    : "Barber"}
                                        </Badge>
                                    </div>

                                    <div className="mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                        View Details
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
                </FadeIn>
            )}

            {/* ─── §4: Upcoming Events Grid ─── */}
            <FadeIn>
            <section
                className="bg-surface py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <EducationEventsFilter events={upcomingEvents} />
                </div>
            </section>
            </FadeIn>

            {/* ─── §5: Past Events ─── */}
            <FadeIn>
            <section
                className="bg-background py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <p className="eyebrow">
                        Track Record
                    </p>
                    <h2 className="mt-3 heading-section text-foreground">
                        Past Events
                    </h2>

                    <div className="mt-10 space-y-0 divide-y divide-border-warm/40 border-y border-border-warm/40">
                        {pastEvents.map((event) => (
                            <Link
                                key={event.id}
                                href={`/education/events/${event.id}`}
                                className="group flex flex-col gap-3 py-5 transition-colors hover:bg-surface/50 sm:flex-row sm:items-center sm:gap-6 px-4 -mx-4"
                            >
                                <span className="shrink-0 text-[12px] font-semibold text-text-muted w-28">
                                    {formatDate(event.date)}
                                </span>
                                <span className="text-[14px] font-semibold text-foreground transition-colors group-hover:text-foreground/70 flex-1">
                                    {event.title}
                                </span>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant="outline"
                                        className="border-border-warm/60 text-[10px] uppercase tracking-[0.15em] text-text-muted shrink-0"
                                    >
                                        {event.brand}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-border-warm/60 text-[10px] uppercase tracking-[0.15em] text-text-muted shrink-0"
                                    >
                                        {event.location}
                                    </Badge>
                                    <ArrowRight className="h-3.5 w-3.5 text-text-muted transition-transform duration-300 group-hover:translate-x-0.5 shrink-0" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            </FadeIn>

            <Separator className="mx-auto max-w-[1400px] bg-border-warm/40" />

            {/* ─── §6: Articles / Insights ─── */}
            <FadeIn>
            <section
                className="bg-background py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="eyebrow">
                                Insights
                            </p>
                            <h2 className="mt-3 heading-section text-foreground">
                                Articles &amp; Knowledge
                            </h2>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/education/articles/${article.id}`}
                                className="group block border border-border-warm/60 bg-background transition-all duration-300 hover:shadow-sm"
                            >
                                {/* Image placeholder */}
                                <div className="flex aspect-[16/10] items-center justify-center bg-surface-elevated">
                                    <BookOpen className="h-8 w-8 text-text-muted/20" />
                                </div>

                                <div className="p-7">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                            {article.category}
                                        </span>
                                        <span className="text-[11px] text-text-muted">
                                            {article.readTime}
                                        </span>
                                    </div>

                                    <h3 className="mt-3 text-[14px] font-bold leading-snug text-foreground transition-colors group-hover:text-foreground/70 line-clamp-2">
                                        {article.title}
                                    </h3>

                                    <p className="mt-2 text-[13px] leading-[1.75] text-text-muted line-clamp-3">
                                        {article.excerpt}
                                    </p>

                                    <div className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                        Read Article
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            </FadeIn>

            {/* ─── §7: CTA Band ─── */}
            <FadeIn>
            <section
                className="bg-foreground py-14 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1400px] px-6 text-center sm:px-8 lg:px-12">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
                        Education Partnership
                    </p>
                    <h2 className="mt-5 heading-section text-white">
                        Want to host a training session?
                    </h2>
                    <p className="mx-auto mt-6 max-w-lg text-[14px] leading-[1.85] text-white/60">
                        We bring our education programs directly to your
                        salon or barbershop. Contact us to discuss custom
                        training sessions for your team.
                    </p>
                    <WhatsAppCTA
                        location="education_page"
                        message="Hi, saya ingin menanyakan tentang program edukasi dan training untuk tim kami."
                        className="mt-10 inline-flex items-center gap-2.5 bg-background px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:bg-background/90"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Consult via WhatsApp
                    </WhatsAppCTA>
                </div>
            </section>
            </FadeIn>
        </main>
    );
}

