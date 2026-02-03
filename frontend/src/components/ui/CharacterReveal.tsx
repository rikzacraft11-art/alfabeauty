"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";

type CharacterRevealProps = {
    children: string;
    delay?: number;
    staggerDelay?: number;
    className?: string;
    once?: boolean;
};

/**
 * CharacterReveal: Ineo-Sense style character-by-character text reveal.
 * Each character animates from below with stagger timing.
 */
export default function CharacterReveal({
    children,
    delay = 0,
    staggerDelay = 0.02,
    className = "",
    once = true,
}: CharacterRevealProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once, margin: "-5%" });

    const characters = useMemo(() => {
        return children.split("").map((char, index) => ({
            char: char === " " ? "\u00A0" : char,
            key: `${char}-${index}`,
        }));
    }, [children]);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                delayChildren: delay,
                staggerChildren: staggerDelay,
            },
        },
    };

    const charVariants = {
        hidden: {
            y: "100%",
            opacity: 0,
            rotateX: -90,
        },
        visible: {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
    };

    return (
        <motion.span
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`inline-block ${className}`}
            aria-label={children}
        >
            {characters.map(({ char, key }) => (
                <span key={key} className="inline-block overflow-hidden">
                    <motion.span
                        variants={charVariants}
                        className="inline-block origin-bottom"
                        style={{ transformStyle: "preserve-3d" }}
                        aria-hidden="true"
                    >
                        {char}
                    </motion.span>
                </span>
            ))}
            <span className="sr-only">{children}</span>
        </motion.span>
    );
}
