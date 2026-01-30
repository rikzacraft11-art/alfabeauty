"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type MarqueeProps = {
    children: ReactNode;
    speed?: number; // pixels per second
    pauseOnHover?: boolean;
    className?: string;
};

/**
 * Marquee: Infinite horizontal scroll animation.
 * Design V2 pattern for brand logo strips.
 */
export default function Marquee({
    children,
    speed = 50,
    pauseOnHover = true,
    className = "",
}: MarqueeProps) {
    return (
        <div
            className={`overflow-hidden ${pauseOnHover ? "group" : ""} ${className}`}
        >
            <motion.div
                className="flex gap-8 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    x: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    },
                }}
                style={{
                    animationPlayState: pauseOnHover ? "running" : "running",
                }}
            >
                {/* Duplicate children for seamless loop */}
                <div className="flex gap-8 shrink-0 group-hover:[animation-play-state:paused]">
                    {children}
                </div>
                <div className="flex gap-8 shrink-0 group-hover:[animation-play-state:paused]" aria-hidden>
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
