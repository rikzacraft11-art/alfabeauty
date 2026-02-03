"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import AppLink from "@/components/ui/AppLink";
import CardReveal from "@/components/ui/CardReveal";

type SolutionCardProps = {
    title: string;
    description: string;
    icon?: React.ReactNode;
    href: string;
    index: number;
};

/**
 * SolutionCard: Clean card for "Solutions" section.
 * Simple hover effects without heavy 3D transforms.
 */
export default function SolutionCard({
    title,
    description,
    icon,
    href,
    index,
}: SolutionCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <CardReveal
            delay={index * 0.1}
            direction="up"
            className="h-full"
        >
            <AppLink
                href={href}
                className="group relative flex flex-col h-full p-8 md:p-10 border border-border bg-panel rounded-lg overflow-hidden transition-all duration-300 hover:bg-background hover:border-foreground/20 hover:shadow-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Gradient overlay on hover */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br from-transparent to-subtle/50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden="true"
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div className="mb-6 text-foreground transition-transform duration-300 group-hover:scale-110 origin-left">
                        {icon}
                    </div>

                    {/* Title */}
                    <h3 className="type-h3 text-foreground mb-4 transition-transform duration-300 group-hover:translate-x-1">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="type-body text-muted mb-6 max-w-sm transition-colors duration-300 group-hover:text-foreground-muted">
                        {description}
                    </p>

                    {/* CTA */}
                    <div className="mt-auto flex items-center text-foreground font-medium relative overflow-hidden h-6">
                        <span className={`transition-transform duration-300 ${isHovered ? '-translate-y-full' : 'translate-y-0'}`}>
                            Learn more
                        </span>
                        <span className={`absolute transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                            Discover →
                        </span>
                    </div>
                </div>

                {/* Bottom accent line */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"
                    aria-hidden="true"
                />
            </AppLink>
        </CardReveal>
    );
}
