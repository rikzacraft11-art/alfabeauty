"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type LineRevealProps = {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    once?: boolean;
    direction?: "left" | "right" | "center";
};

/**
 * LineReveal: Animated decorative line that grows on scroll.
 * Ineo-Sense style divider/accent element.
 */
export default function LineReveal({
    children,
    delay = 0,
    className = "",
    once = true,
    direction = "left",
}: LineRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin: "-10%" });

    const getOrigin = () => {
        switch (direction) {
            case "right":
                return "right";
            case "center":
                return "center";
            case "left":
            default:
                return "left";
        }
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                    duration: 1,
                    delay,
                    ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: getOrigin() }}
            />
            {children}
        </div>
    );
}
