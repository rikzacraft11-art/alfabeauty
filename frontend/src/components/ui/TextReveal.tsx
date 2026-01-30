"use client";

import { motion } from "framer-motion";


type TextRevealProps = {
    children: string;
    className?: string;
    delay?: number;
};

/**
 * TextReveal: Word-by-word mask animation.
 * Design V2 pattern for elegant headline reveals.
 */
export default function TextReveal({
    children,
    className = "",
    delay = 0,
}: TextRevealProps) {
    const words = children.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: delay,
                staggerChildren: 0.08,
            },
        },
    };

    const word = {
        hidden: {
            y: "100%",
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1] as const,
            },
        },
    };

    return (
        <motion.span
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`inline-flex flex-wrap ${className}`}
        >
            {words.map((w, i) => (
                <span key={i} className="overflow-hidden mr-[0.25em]">
                    <motion.span variants={word} className="inline-block">
                        {w}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}
