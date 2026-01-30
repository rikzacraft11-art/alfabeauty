"use client";

import type { ReactNode } from "react";

type SplitSectionProps = {
    left: ReactNode;
    right: ReactNode;
    ratio?: "60/40" | "50/50" | "40/60";
    reverse?: boolean;
    className?: string;
    gap?: "sm" | "md" | "lg";
};

/**
 * SplitSection: Asymmetric layout component.
 * TOGAF ARCH-23: Design V2 premium section layout.
 */
export default function SplitSection({
    left,
    right,
    ratio = "60/40",
    reverse = false,
    className = "",
    gap = "md",
}: SplitSectionProps) {
    const ratioClasses = {
        "60/40": "lg:grid-cols-[1.5fr_1fr]",
        "50/50": "lg:grid-cols-2",
        "40/60": "lg:grid-cols-[1fr_1.5fr]",
    };

    const gapClasses = {
        sm: "gap-6 lg:gap-8",
        md: "gap-8 lg:gap-12",
        lg: "gap-12 lg:gap-24",
    };

    return (
        <div
            className={`
        grid grid-cols-1 ${ratioClasses[ratio]} ${gapClasses[gap]}
        items-center
        ${className}
      `}
        >
            <div className={reverse ? "lg:order-2" : "lg:order-1"}>
                {left}
            </div>
            <div className={reverse ? "lg:order-1" : "lg:order-2"}>
                {right}
            </div>
        </div>
    );
}
