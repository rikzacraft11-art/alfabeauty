"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { cinematicEase } from "@/shared/lib/motion";

/* ─────────────────────────────────────────────────────────────────────
 * Marquee V5 — Dual-row, hover-pause, scale entrance.
 *
 * V5 upgrades:
 *   - `pauseOnHover` prop — CSS animation-play-state pauses on hover
 *   - `rows` prop (1|2) — second row runs in reverse direction for depth
 *   - Entrance: blur(6px)→0 + y:16→0 + scale(0.98)→1 (deeper reveal)
 *   - Items: hover micro-scale 1.06 + slight brightness lift
 *   - Viewport margin tightened to -50px for snappier trigger
 * ───────────────────────────────────────────────────────────────────── */

interface MarqueeProps {
    children: React.ReactNode;
    separator?: string;
    speed?: number;
    className?: string;
    gap?: number;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    rows?: 1 | 2 | 3 | 4;
}

export function Marquee({
    children,
    separator = "·",
    speed = 40,
    className,
    gap = 2.5,
    direction = "left",
    pauseOnHover = false,
    rows = 1,
}: MarqueeProps): React.JSX.Element {
    const items = React.Children.toArray(children);

    const renderItems = () =>
        items.map((child, i) => (
            <React.Fragment key={i}>
                <span className="shrink-0 transition-transform duration-300 hover:scale-[1.06] hover:brightness-110">{child}</span>
                {separator && (
                    <span
                        className="shrink-0 select-none text-text-muted/40"
                        aria-hidden="true"
                    >
                        {separator}
                    </span>
                )}
            </React.Fragment>
        ));

    const reverseDir = direction === "left" ? "right" : "left";

    const renderTrack = (dir: "left" | "right", ariaHidden?: boolean) => (
        <div
            className={cn(
                dir === "right" ? "marquee-track-reverse" : "marquee-track",
                pauseOnHover && "group-hover:[animation-play-state:paused] [&>*]:[animation-play-state:inherit]"
            )}
            style={{
                "--marquee-duration": `${speed}s`,
                gap: `${gap}rem`,
            } as React.CSSProperties}
            aria-hidden={ariaHidden}
        >
            <div className="flex shrink-0 items-center" style={{ gap: `${gap}rem` }}>
                {renderItems()}
            </div>
            <div className="flex shrink-0 items-center" style={{ gap: `${gap}rem` }} aria-hidden="true">
                {renderItems()}
            </div>
        </div>
    );

    return (
        <motion.div
            className={cn("group overflow-hidden", className)}
            aria-label="Scrolling keywords"
            role="region"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, ease: cinematicEase }}
        >
            {renderTrack(direction)}
            {rows >= 2 && (
                <div className="mt-3">
                    {renderTrack(reverseDir, true)}
                </div>
            )}
            {rows >= 3 && (
                <div className="mt-3">
                    {renderTrack(direction, true)}
                </div>
            )}
            {rows >= 4 && (
                <div className="mt-3">
                    {renderTrack(reverseDir, true)}
                </div>
            )}
        </motion.div>
    );
}
