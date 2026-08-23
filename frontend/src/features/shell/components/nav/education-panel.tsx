"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { NavigationMenuLink } from "@/shared/components/ui/navigation-menu";
import { getFeaturedEvent } from "@/features/education/components/education-data";

const EDUCATION_ITEMS = [
    {
        title: "Technical Training",
        description: "Cutting, colouring, and styling workshops with industry professionals.",
        href: "/education",
    },
    {
        title: "Product Knowledge",
        description: "Deep-dive sessions on formulations and application methods.",
        href: "/education",
    },
    {
        title: "Business Development",
        description: "Salon management, marketing, and client retention strategies.",
        href: "/education",
    },
    {
        title: "Events & Seminars",
        description: "Brand launches, live demos, and networking opportunities.",
        href: "/education/events",
    },
];

export const EducationPanel = React.memo(function EducationPanel() {
    const featured = getFeaturedEvent();

    return (
        <div className="mx-auto grid h-[440px] max-w-[1400px] grid-cols-[1.1fr_1fr] gap-0 px-8 py-10 lg:px-12">
            {/* Left: Featured Event Showcase */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-charcoal p-8 pr-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-crimson/15 via-charcoal to-charcoal" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                        {featured ? "Featured Event" : "Alfa Beauty Academy"}
                    </p>

                    {featured ? (
                        <>
                            <h3 className="mt-2 text-[1.5rem] font-bold leading-tight text-white">
                                {featured.title}
                            </h3>
                            <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {new Date(featured.date).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                    {featured.endDate && (
                                        <>
                                            {" – "}
                                            {new Date(featured.endDate).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </>
                                    )}
                                </span>
                                <span>·</span>
                                <span>{featured.location}</span>
                            </div>
                            <p className="mt-3 max-w-[340px] text-[13px] leading-relaxed text-white/50">
                                {featured.description}
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-[1.5rem] font-bold leading-tight text-white">
                                Elevate Your<br />Professional Craft
                            </h3>
                            <p className="mt-3 max-w-[340px] text-[13px] leading-relaxed text-white/50">
                                Professional education programs designed for salon and barber industry growth.
                            </p>
                        </>
                    )}
                </div>

                <div className="relative z-10 mt-auto pt-6">
                    <div className="mb-4 h-px bg-white/15" />
                    <NavigationMenuLink asChild>
                        <Link
                            href={featured ? `/education/events/${featured.id}` : "/education"}
                            className="flex flex-row items-center justify-between gap-0 rounded-none p-0 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 hover:text-white"
                        >
                            {featured ? "View Event Details" : "Explore Programs"}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </NavigationMenuLink>
                </div>
            </div>

            {/* Right: Education Programs Grid */}
            <div className="grid grid-cols-2 gap-px bg-border-warm/20">
                {EDUCATION_ITEMS.map((item) => (
                    <NavigationMenuLink key={item.title} asChild>
                        <Link
                            href={item.href}
                            className="group relative flex min-h-[120px] flex-col justify-end overflow-hidden bg-background p-5"
                        >
                            <h4 className="text-[13px] font-bold leading-snug group-hover:underline underline-offset-4 decoration-foreground/30">
                                {item.title}
                            </h4>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/60 transition-colors duration-300 group-hover:text-muted-foreground">
                                {item.description}
                            </p>
                            <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 transition-colors duration-300 group-hover:text-foreground">
                                Explore
                                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-crimson transition-[width] duration-500 group-hover:w-full" />
                        </Link>
                    </NavigationMenuLink>
                ))}
            </div>
        </div>
    );
});
