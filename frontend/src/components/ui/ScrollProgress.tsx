"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ScrollProgressProps = {
    className?: string;
};

/**
 * ScrollProgress: Fixed progress bar at top of page.
 * Shows scroll progress through the entire page.
 */
export default function ScrollProgress({ className = "" }: ScrollProgressProps) {
    const { scrollYProgress } = useScroll();

    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <motion.div
            className={`fixed top-0 left-0 right-0 h-[2px] bg-foreground origin-left z-[9999] ${className}`}
            style={{ scaleX }}
            aria-hidden="true"
        />
    );
}
