"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

type HorizontalScrollProps = {
    children: ReactNode;
    className?: string;
};

/**
 * HorizontalScroll: Scroll-triggered horizontal section.
 * Content moves horizontally as user scrolls vertically.
 */
export default function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Calculate how far to scroll based on content width
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

    return (
        <div
            ref={containerRef}
            className={`horizontal-scroll-container ${className}`}
            style={{ height: "300vh" }}  // 3 screens worth of scroll
        >
            <div className="horizontal-scroll-track">
                <motion.div
                    ref={contentRef}
                    style={{ x }}
                    className="horizontal-scroll-content"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
