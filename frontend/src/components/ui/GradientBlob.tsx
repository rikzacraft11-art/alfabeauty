"use client";

import { motion } from "framer-motion";

type GradientBlobProps = {
    className?: string;
    colors?: string[];
    blur?: number;
    opacity?: number;
};

export default function GradientBlob({
    className = "",
    colors = ["#f4f4f5", "#e4e4e7", "#d4d4d8"],
    blur = 100,
    opacity = 0.5,
}: GradientBlobProps) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
            <motion.div
                className="absolute rounded-full"
                style={{ width: "40%", height: "40%", background: colors[0], filter: `blur(${blur}px)`, opacity, top: "10%", left: "10%" }}
                animate={{ x: [0, 50, 0, -50, 0], y: [0, -30, 0, 30, 0], scale: [1, 1.1, 1, 0.9, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}
