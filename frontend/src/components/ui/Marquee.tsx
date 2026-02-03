"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

type MarqueeProps = {
    children: React.ReactNode;
    speed?: number; // seconds for one complete cycle
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    className?: string;
    gap?: number; // gap between items in pixels
};

/**
 * Marquee: Infinite horizontal scroll component.
 * Inspired by Stripe, Linear, and premium landing pages.
 * Pauses on hover for accessibility.
 */
export default function Marquee({
    children,
    speed = 30,
    direction = "left",
    pauseOnHover = true,
    className = "",
    gap = 48,
}: MarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // If reduced motion, just show static content
    if (prefersReducedMotion) {
        return (
            <div className={`flex items-center overflow-hidden ${className}`}>
                <div className="flex items-center" style={{ gap }}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            style={{
                maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
        >
            <motion.div
                className="flex items-center"
                style={{ gap }}
                animate={{
                    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear",
                    },
                }}
                whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
            >
                {/* First copy */}
                <div className="flex items-center shrink-0" style={{ gap }}>
                    {children}
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex items-center shrink-0" style={{ gap }} aria-hidden="true">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
