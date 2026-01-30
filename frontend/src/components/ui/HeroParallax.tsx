"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type HeroParallaxProps = {
    children?: React.ReactNode;
    className?: string;
};

/**
 * HeroParallax: Parallax effect wrapper for Hero visual elements.
 * Design V2: Creates depth and movement on scroll.
 * DEV-06: Hero parallax effect implementation.
 */
export default function HeroParallax({ children, className = "" }: HeroParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
    const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.5]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div
                style={{ y, scale, opacity }}
                className="will-change-transform"
            >
                {children || (
                    <div
                        className="aspect-square rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900"
                        style={{ boxShadow: "var(--shadow-elegant)" }}
                    />
                )}
            </motion.div>
        </div>
    );
}
