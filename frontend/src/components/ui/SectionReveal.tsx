"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionRevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
};

/**
 * SectionReveal: Viewport-triggered fade-up animation.
 * Design V2 pattern for elegant section entrances.
 */
export default function SectionReveal({
    children,
    className = "",
    delay = 0,
}: SectionRevealProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.16, 1, 0.3, 1] as const,
            }}
            className={className}
        >
            {children}
        </motion.section>
    );
}
