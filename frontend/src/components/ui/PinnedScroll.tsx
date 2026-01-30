"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

type PinnedScrollProps = {
    children: ReactNode;
    className?: string;
    /** Total scroll distance as viewport heights (e.g., 3 = 300vh) */
    scrollDistance?: number;
};

/**
 * PinnedScroll: Horizontal scroll triggered by vertical scroll.
 * TOGAF ARCH-24: Design V2 premium scroll component.
 * 
 * The container pins while the content scrolls horizontally.
 */
export default function PinnedScroll({
    children,
    className = "",
    scrollDistance = 3,
}: PinnedScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Transform vertical scroll to horizontal movement
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            style={{ height: `${scrollDistance * 100}vh` }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex items-center">
                <motion.div
                    ref={scrollRef}
                    className="flex gap-8"
                    style={{ x }}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}

/**
 * PinnedScrollItem: Individual item in a PinnedScroll container.
 */
export function PinnedScrollItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[40vw] ${className}`}>
            {children}
        </div>
    );
}
