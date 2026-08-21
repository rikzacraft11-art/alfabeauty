"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { NavigationMenuLink } from "@/shared/components/ui/navigation-menu";

const PARTNERSHIP_GROUPS = [
    {
        title: "Partnership Tiers",
        items: [
            { label: "Exclusive Salon Partner Program", href: "/partnership" },
            { label: "Barbershop Hardware & Supplies", href: "/partnership" },
            { label: "Regional Authorized Distributor", href: "/partnership" },
            { label: "Custom Maklon OEM Solutions", href: "/partnership" },
        ],
    },
    {
        title: "Partner Benefits",
        items: [
            { label: "Direct European Factory Pricing", href: "/partnership" },
            { label: "Priority Stock & Guaranteed Supply", href: "/partnership" },
            { label: "Complimentary Academy Training", href: "/education" },
            { label: "Dedicated Account Management", href: "/contact" },
        ],
    },
];

export function PartnershipPanel(): React.JSX.Element {
    return (
        <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_2.5fr] gap-10 px-8 py-10 lg:px-12 bg-white text-black">
            {/* Left Column: Calvin Klein Teaser Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F5F2] group">
                <Image
                    src="/images/solutions/barber.jpg"
                    alt="Partnership Network"
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2D9A0] mb-1">
                        B2B Network
                    </p>
                    <p className="text-[13px] font-normal leading-snug mb-3">
                        Grow with Indonesia&apos;s leading beauty distribution network
                    </p>
                    <NavigationMenuLink asChild>
                        <Link
                            href="/partnership"
                            className="flex items-center justify-between bg-white px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-black transition-colors duration-200 hover:bg-[#ba181b] hover:text-white"
                        >
                            <span>Partner With Us</span>
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </NavigationMenuLink>
                </div>
            </div>

            {/* Right Columns: Calvin Klein Multi-Column Text Lists */}
            <div className="grid grid-cols-2 gap-10 py-2">
                {PARTNERSHIP_GROUPS.map((group) => (
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
                                            className="text-[13.5px] font-normal text-neutral-600 hover:text-[#ba181b] hover:underline decoration-1 underline-offset-4 transition-all"
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
