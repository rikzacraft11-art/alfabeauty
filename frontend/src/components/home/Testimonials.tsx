"use client";

import * as React from "react";
import Image from "next/image";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getTestimonials, getTestimonialsContent } from "@/content/homepage";
import { IconQuote } from "@/components/ui/icons";

// =============================================================================
// Types
// =============================================================================

interface TestimonialCardProps {
    quote: string;
    author: string;
    role: string;
    location: string;
    avatar: string;
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * TestimonialCard - Individual testimonial with quote and author
 * Enterprise pattern: Large quote, professional headshot fallback, location
 */
function TestimonialCard({ quote, author, role, location, avatar }: TestimonialCardProps) {
    const [imgError, setImgError] = React.useState(false);
    const initials = author.split(" ").map(n => n[0]).join("").toUpperCase();

    return (
        <div className="bg-background border border-border p-6 sm:p-8 ui-radius flex flex-col h-full">
            {/* Quote Icon */}
            <div className="mb-4">
                <IconQuote className="h-8 w-8 text-foreground/20" />
            </div>

            {/* Quote */}
            <blockquote className="type-body text-foreground flex-1 mb-6">
                &ldquo;{quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
                {/* Avatar */}
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-subtle flex-shrink-0">
                    {!imgError ? (
                        <Image
                            src={avatar}
                            alt={author}
                            fill
                            className="object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center type-data-strong text-foreground-muted">
                            {initials}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <p className="type-body-strong text-foreground">{author}</p>
                    <p className="type-data text-foreground-muted">{role}</p>
                    <p className="type-data text-muted">{location}</p>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Testimonials - Partner testimonials for social proof
 * 
 * Features:
 * - 3-column grid on desktop
 * - Horizontal scroll on mobile
 * - Quote marks and professional styling
 * 
 * Usage: Place after StatsBar or before CTA for maximum credibility impact
 */
export default function Testimonials() {
    const { locale } = useLocale();
    const testimonials = getTestimonials(locale);
    const content = getTestimonialsContent(locale);

    return (
        <section
            className="py-12 sm:py-16 lg:py-20 bg-subtle"
            aria-labelledby="testimonials-title"
        >
            <div className="px-4 sm:px-6 lg:px-10 max-w-[120rem] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <p className="type-kicker mb-2">{content.kicker}</p>
                    <h2 id="testimonials-title" className="type-h2">
                        {content.title}
                    </h2>
                </div>

                {/* Testimonials Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.id}
                            quote={testimonial.quote}
                            author={testimonial.author}
                            role={testimonial.role}
                            location={testimonial.location}
                            avatar={testimonial.avatar}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
