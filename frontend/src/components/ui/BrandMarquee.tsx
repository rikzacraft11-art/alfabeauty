"use client";

import { ReactNode } from "react";

type BrandMarqueeProps = {
    children: ReactNode;
    speed?: number;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    className?: string;
};

/**
 * BrandMarquee: Infinite scrolling marquee for brand logos.
 * CSS-powered animation with gradient fade edges.
 */
export default function BrandMarquee({
    children,
    speed = 40,
    direction = "left",
    pauseOnHover = true,
    className = "",
}: BrandMarqueeProps) {
    const animationStyle = {
        "--marquee-duration": `${speed}s`,
        animationDirection: direction === "right" ? "reverse" : "normal",
    } as React.CSSProperties;

    return (
        <div className={`marquee-fade overflow-hidden ${className}`}>
            <div
                className={`marquee-track ${pauseOnHover ? "" : "hover:!animation-play-state-running"}`}
                style={animationStyle}
            >
                {/* Original content */}
                <div className="flex shrink-0">
                    {children}
                </div>
                {/* Duplicated for seamless loop */}
                <div className="flex shrink-0" aria-hidden="true">
                    {children}
                </div>
            </div>
        </div>
    );
}
