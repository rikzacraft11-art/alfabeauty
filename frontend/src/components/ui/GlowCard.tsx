"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

type GlowCardProps = {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    glowSize?: number;
};

/**
 * GlowCard: Card with mouse-following glow effect.
 * Inspired by Linear, Raycast, and Vercel design systems.
 */
export default function GlowCard({
    children,
    className = "",
    glowColor = "rgba(24, 24, 27, 0.08)",
    glowSize = 400,
}: GlowCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative overflow-hidden ${className}`}
            style={{ isolation: "isolate" }}
        >
            {/* Glow Effect Layer */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(${glowSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Border Glow */}
            <motion.div
                className="absolute inset-0 pointer-events-none rounded-[inherit]"
                style={{
                    background: `radial-gradient(${glowSize * 0.8}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(24, 24, 27, 0.15), transparent 40%)`,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "xor",
                    WebkitMaskComposite: "xor",
                    padding: "1px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
