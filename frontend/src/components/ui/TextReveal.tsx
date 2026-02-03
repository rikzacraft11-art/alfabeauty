"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";

type TextRevealProps = {
    children: string;
    delay?: number;
    staggerDelay?: number;
    className?: string;
    as?: "h1" | "h2" | "h3" | "p" | "span";
    once?: boolean;
    direction?: "up" | "down";
};

/**
 * TextReveal: Ineo-Sense style text reveal animation.
 * Each line/word slides up from behind a mask with elegant easing.
 * Used for hero headlines and section titles.
 */
export default function TextReveal({
    children,
    delay = 0,
    staggerDelay = 0.08,
    className = "",
    as: Component = "span",
    once = true,
    direction = "up",
}: TextRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin: "-10%" });

    // Split text by words for the reveal effect
    const words = useMemo(() => children.split(" "), [children]);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                delayChildren: delay,
                staggerChildren: staggerDelay,
            },
        },
    };

    const wordVariants = {
        hidden: {
            y: direction === "up" ? "100%" : "-100%",
            opacity: 0,
        },
        visible: {
            y: "0%",
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const, // Ineo-Sense style easing
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`inline-flex flex-wrap ${className}`}
            aria-label={children}
        >
            {words.map((word, index) => (
                <span
                    key={`${word}-${index}`}
                    className="overflow-hidden inline-block"
                    style={{ marginRight: "0.25em" }}
                >
                    <Component className="sr-only">{word}</Component>
                    <motion.span
                        variants={wordVariants}
                        className="inline-block"
                        aria-hidden="true"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </motion.div>
    );
}
