"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type ImageRevealProps = {
    src: string;
    alt: string;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
};

/**
 * ImageReveal: Mask reveal animation for images on scroll.
 * Image is revealed with a clip-path animation when entering viewport.
 */
export default function ImageReveal({
    src,
    alt,
    className = "",
    direction = "up",
    delay = 0,
}: ImageRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const getClipPath = () => {
        switch (direction) {
            case "up": return { initial: "inset(100% 0 0 0)", final: "inset(0 0 0 0)" };
            case "down": return { initial: "inset(0 0 100% 0)", final: "inset(0 0 0 0)" };
            case "left": return { initial: "inset(0 100% 0 0)", final: "inset(0 0 0 0)" };
            case "right": return { initial: "inset(0 0 0 100%)", final: "inset(0 0 0 0)" };
            default: return { initial: "inset(100% 0 0 0)", final: "inset(0 0 0 0)" };
        }
    };

    const { initial, final } = getClipPath();

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ clipPath: initial, scale: 1.2 }}
                animate={isInView ? { clipPath: final, scale: 1 } : { clipPath: initial, scale: 1.2 }}
                transition={{
                    duration: 1.2,
                    delay,
                    ease: [0.22, 1, 0.36, 1] as const,
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            </motion.div>
        </div>
    );
}
