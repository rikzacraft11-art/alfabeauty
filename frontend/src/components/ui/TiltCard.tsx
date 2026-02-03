"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

type TiltCardProps = {
    children: React.ReactNode;
    className?: string;
    tiltAmount?: number; // degrees of tilt
    perspective?: number;
    scale?: number; // scale on hover
};

/**
 * TiltCard: 3D perspective tilt effect on hover.
 * Premium interactive card effect for Awwwards-quality design.
 */
export default function TiltCard({
    children,
    className = "",
    tiltAmount = 10,
    perspective = 1000,
    scale = 1.02,
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Use springs for smooth animation
    const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
    const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
    const scaleValue = useSpring(1, { stiffness: 300, damping: 30 });

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const percentX = (e.clientX - centerX) / (rect.width / 2);
            const percentY = (e.clientY - centerY) / (rect.height / 2);

            rotateX.set(-percentY * tiltAmount);
            rotateY.set(percentX * tiltAmount);
        },
        [tiltAmount, rotateX, rotateY]
    );

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        scaleValue.set(scale);
    }, [scale, scaleValue]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        rotateX.set(0);
        rotateY.set(0);
        scaleValue.set(1);
    }, [rotateX, rotateY, scaleValue]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective,
                transformStyle: "preserve-3d",
            }}
            className={className}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    scale: scaleValue,
                    transformStyle: "preserve-3d",
                }}
                className="relative"
            >
                {/* Subtle shine effect on tilt */}
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, transparent 100%)",
                    }}
                    animate={{ opacity: isHovered ? 0.5 : 0 }}
                    transition={{ duration: 0.3 }}
                />
                {children}
            </motion.div>
        </motion.div>
    );
}
