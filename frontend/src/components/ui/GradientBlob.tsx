"use client";

import { motion } from "framer-motion";

type GradientBlobProps = {
    className?: string;
    colors?: string[];
    blur?: number;
    opacity?: number;
};

/**
 * GradientBlob: Animated mesh gradient background.
 * Creates organic, fluid motion for premium hero sections.
 */
export default function GradientBlob({
    className = "",
    colors = ["#f4f4f5", "#e4e4e7", "#d4d4d8"],
    blur = 100,
    opacity = 0.5,
}: GradientBlobProps) {
    return (
        <div
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
            aria-hidden="true"
        >
            {/* Blob 1 */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: "40%",
                    height: "40%",
                    background: colors[0],
                    filter: `blur(${blur}px)`,
                    opacity,
                    top: "10%",
                    left: "10%",
                }}
                animate={{
                    x: [0, 50, 0, -50, 0],
                    y: [0, -30, 0, 30, 0],
                    scale: [1, 1.1, 1, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Blob 2 */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: "35%",
                    height: "35%",
                    background: colors[1] || colors[0],
                    filter: `blur(${blur}px)`,
                    opacity,
                    top: "40%",
                    right: "15%",
                }}
                animate={{
                    x: [0, -40, 0, 40, 0],
                    y: [0, 40, 0, -40, 0],
                    scale: [1, 0.95, 1, 1.05, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Blob 3 */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: "30%",
                    height: "30%",
                    background: colors[2] || colors[0],
                    filter: `blur(${blur}px)`,
                    opacity,
                    bottom: "10%",
                    left: "30%",
                }}
                animate={{
                    x: [0, 30, 0, -30, 0],
                    y: [0, -20, 0, 20, 0],
                    scale: [1, 1.08, 1, 0.92, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
