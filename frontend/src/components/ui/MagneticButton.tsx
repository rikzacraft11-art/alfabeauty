"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

type MagneticButtonProps = {
    children: React.ReactNode;
    className?: string;
    strength?: number; // Magnetic attraction strength
    as?: "button" | "a";
    href?: string;
    onClick?: () => void;
};

/**
 * MagneticButton: Button with magnetic hover attraction.
 * Design V2 pattern for elegant interaction feedback.
 */
export default function MagneticButton({
    children,
    className = "",
    strength = 0.3,
    as = "button",
    href,
    onClick,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = (e.clientX - centerX) * strength;
        const distanceY = (e.clientY - centerY) * strength;

        setPosition({ x: distanceX, y: distanceY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const Component = as === "a" ? motion.a : motion.button;

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
        >
            <Component
                href={as === "a" ? href : undefined}
                onClick={onClick}
                animate={{ x: position.x, y: position.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                className={className}
            >
                {children}
            </Component>
        </div>
    );
}
