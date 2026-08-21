"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { NavigationMenuLink } from "@/shared/components/ui/navigation-menu";

const EDUCATION_GROUPS = [
    {
        title: "Technical Mastery",
        items: [
            { label: "Italian Color Theory & Bleaching", href: "/education" },
            { label: "Japanese Digital Heat Perming", href: "/education" },
            { label: "Precision Barbering & Fading", href: "/education" },
            { label: "CMC Lipid Hair Reconstruction", href: "/education" },
        ],
    },
    {
        title: "Academy & Events",
        items: [
            { label: "Hands-on Masterclasses 2026", href: "/education/events" },
            { label: "Salon Business & Management", href: "/education" },
            { label: "European Educator Live Demos", href: "/education/events" },
            { label: "Alfa Certified Stylist Program", href: "/education" },
        ],
    },
];

export function EducationPanel(): React.JSX.Element {
    return (
        <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_2.5fr] gap-10 px-8 py-10 lg:px-12 bg-white text-black">
            {/* Left Column: Calvin Klein Teaser Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F5F2] group">
                <Image
                    src="/images/solutions/colouring.jpg"
                    alt="Education Academy"
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2D9A0] mb-1">
                        Alfa Academy
                    </p>
                    <p className="text-[13px] font-normal leading-snug mb-3">
                        Professional Education & Hands-on Workshops
                    </p>
                    <NavigationMenuLink asChild>
                        <Link
                            href="/education"
                            className="flex items-center justify-between bg-white px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-black transition-colors duration-200 hover:bg-[#D9403A] hover:text-white"
                        >
                            <span>Explore Academy</span>
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </NavigationMenuLink>
                </div>
            </div>

            {/* Right Columns: Calvin Klein Multi-Column Text Lists */}
            <div className="grid grid-cols-2 gap-10 py-2">
                {EDUCATION_GROUPS.map((group) => (
                    <div key={group.title} className="flex flex-col">
                        <h4 className="text-[12px] font-bold uppercase tracking-[0.16em] text-black border-b border-black/20 pb-2 mb-4">
                            {group.title}
                        </h4>
                        <ul className="flex flex-col space-y-3.5">
                            {group.items.map((item) => (
                                <li key={item.label}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className="text-[13.5px] font-normal text-neutral-600 hover:text-[#D9403A] hover:underline decoration-1 underline-offset-4 transition-all"
                                        >
                                            {item.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
