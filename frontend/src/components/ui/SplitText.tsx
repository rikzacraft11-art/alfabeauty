"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";

type SplitTextProps = {
    children: string;
    splitBy?: "chars" | "words";
    delay?: number;
    staggerDelay?: number;
    className?: string;
    once?: boolean;
};

/**
 * SplitText: Animate text character-by-character or word-by-word.
 * Awwwards signature effect for hero headlines.
 */
export default function SplitText({
    children,
    splitBy = "chars",
    delay = 0,
    staggerDelay = 0.03,
    className = "",
    once = true,
}: SplitTextProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once, margin: "-50px" });

    const items = useMemo(() => {
        if (splitBy === "words") {
            return children.split(" ");
        }
        return children.split("");
    }, [children, splitBy]);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                delayChildren: delay,
                staggerChildren: staggerDelay,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: -90,
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1] as const,
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
            {items.map((item, index) => (
                <motion.span
                    key={`${item}-${index}`}
                    variants={itemVariants}
                    className="inline-block"
                    style={{
                        transformStyle: "preserve-3d",
                        whiteSpace: splitBy === "words" ? "pre" : undefined,
                    }}
                    aria-hidden="true"
                >
                    {item}
                    {splitBy === "words" && index < items.length - 1 ? " " : ""}
                </motion.span>
            ))}
        </motion.span>
    );
}
