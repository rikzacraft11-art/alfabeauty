"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

type CardRevealProps = {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    once?: boolean;
    direction?: "up" | "left" | "right";
    distance?: number;
};

/**
 * CardReveal: Ineo-Sense style card reveal animation on scroll.
 * Card slides in from specified direction with fade effect.
 * Perfect for grid cards and content sections.
 */
export default function CardReveal({
    children,
    delay = 0,
    className = "",
    once = true,
    direction = "up",
    distance = 60,
}: CardRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin: "-15%" });

    const getInitialPosition = () => {
        switch (direction) {
            case "left":
                return { x: -distance, y: 0 };
            case "right":
                return { x: distance, y: 0 };
            case "up":
            default:
                return { x: 0, y: distance };
        }
    };

    const initial = getInitialPosition();

    const variants: Variants = {
        hidden: {
            opacity: 0,
            x: initial.x,
            y: initial.y,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                delay,
                ease: [0.22, 1, 0.36, 1] as const, // Ineo-Sense easing
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={className}
        >
            {children}
        </motion.div>
    );
}
