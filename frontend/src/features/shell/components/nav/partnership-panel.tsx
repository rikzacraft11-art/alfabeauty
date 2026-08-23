"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavigationMenuLink } from "@/shared/components/ui/navigation-menu";

const PARTNERSHIP_ITEMS = [
    {
        title: "Salon Partnership",
        description: "Exclusive pricing, priority access, and dedicated support for your salon.",
        href: "/partnership",
    },
    {
        title: "Distribution",
        description: "Become an authorized distributor. Nationwide opportunities available.",
        href: "/partnership",
    },
    {
        title: "Education Partner",
        description: "Collaborate with Alfa Beauty Academy to host training programs.",
        href: "/partnership",
    },
];

export const PartnershipPanel = React.memo(function PartnershipPanel() {
    return (
        <div className="mx-auto grid h-[440px] max-w-[1400px] grid-cols-[1.1fr_1fr] gap-0 px-8 py-10 lg:px-12">
            {/* Left: Partnership Showcase */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-charcoal p-8 pr-10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/30 via-charcoal to-charcoal" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                        Become a Partner
                    </p>
                    <h3 className="mt-2 text-[1.5rem] font-bold leading-tight text-white">
                        Grow With<br />Indonesia&apos;s Leading<br />Beauty Network
                    </h3>
                    <p className="mt-3 max-w-[340px] text-[13px] leading-relaxed text-white/50">
                        Join our network of professional salons, barbershops, and distributors across Indonesia.
                    </p>
                </div>

                <div className="relative z-10 mt-auto pt-6">
                    <div className="mb-4 h-px bg-white/15" />
                    <NavigationMenuLink asChild>
                        <Link
                            href="/partnership"
                            className="flex flex-row items-center justify-between gap-0 rounded-none p-0 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 hover:text-white"
                        >
                            Explore Partnership
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </NavigationMenuLink>
                </div>
            </div>

            {/* Right: Partnership Types Grid */}
            <div className="grid grid-cols-2 gap-px bg-border-warm/20">
                {PARTNERSHIP_ITEMS.map((item) => (
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
                                Learn More
                                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-crimson transition-[width] duration-500 group-hover:w-full" />
                        </Link>
                    </NavigationMenuLink>
                ))}

                {/* CTA cell */}
                <div className="flex flex-col justify-between bg-background p-5">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                            Ready to Partner?
                        </p>
                        <h4 className="mt-2 text-[14px] font-bold leading-snug">
                            Get Started Today
                        </h4>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/60">
                            Contact our partnership team to discuss the best option for your business.
                        </p>
                    </div>
                    <div className="mt-3">
                        <div className="mb-3 h-px bg-border-warm/40" />
                        <NavigationMenuLink asChild>
                            <Link
                                href="/contact"
                                className="flex flex-row items-center justify-between gap-0 rounded-none p-0 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/60 transition-colors duration-300 hover:text-foreground"
                            >
                                Contact Us
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </NavigationMenuLink>
                    </div>
                </div>
            </div>
        </div>
    );
});
