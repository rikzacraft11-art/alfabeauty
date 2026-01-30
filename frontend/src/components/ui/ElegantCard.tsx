"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

type ElegantCardProps = {
    children: ReactNode;
    className?: string;
    tiltIntensity?: number;
    shadowIntensity?: number;
};

/**
 * ElegantCard: Multi-layer shadow with 3D tilt effect on hover.
 * TOGAF ARCH-16: Design V2 premium card component.
 */
export default function ElegantCard({
    children,
    className = "",
    tiltIntensity = 10,
    shadowIntensity = 1,
}: ElegantCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 300, damping: 20 };
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), springConfig);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), springConfig);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        x.set((e.clientX - centerX) / rect.width);
        y.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            className={`bg-panel rounded-2xl p-6 ${className}`}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1000,
                boxShadow: `
          0 ${2 * shadowIntensity}px ${4 * shadowIntensity}px rgba(0, 0, 0, 0.02),
          0 ${8 * shadowIntensity}px ${16 * shadowIntensity}px rgba(0, 0, 0, 0.04),
          0 ${24 * shadowIntensity}px ${48 * shadowIntensity}px rgba(0, 0, 0, 0.06)
        `,
            }}
            whileHover={{
                boxShadow: `
          0 ${4 * shadowIntensity}px ${8 * shadowIntensity}px rgba(0, 0, 0, 0.03),
          0 ${16 * shadowIntensity}px ${32 * shadowIntensity}px rgba(0, 0, 0, 0.06),
          0 ${32 * shadowIntensity}px ${64 * shadowIntensity}px rgba(0, 0, 0, 0.08)
        `,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
}
