"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type StaggerRevealProps = {
    children: ReactNode;
    delay?: number;
    staggerDelay?: number;
    className?: string;
};

/**
 * StaggerReveal: Animate children with staggered entrance.
 * Design V2 pattern for elegant text reveals.
 */
export default function StaggerReveal({
    children,
    delay = 0,
    staggerDelay = 0.1,
    className = "",
}: StaggerRevealProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
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
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1] as const, // Elegant ease-out
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={className}
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div variants={itemVariants}>{children}</motion.div>
            )}
        </motion.div>
    );
}
