"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FluidButtonProps = {
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    ariaLabel?: string;
};

/**
 * FluidButton: Gradient fill animation on hover.
 * TOGAF ARCH-17: Design V2 premium button component.
 */
export default function FluidButton({
    children,
    variant = "primary",
    size = "md",
    className = "",
    onClick,
    disabled = false,
    type = "button",
    ariaLabel,
}: FluidButtonProps) {
    const sizeClasses = {
        sm: "px-4 py-2 type-data",
        md: "px-6 py-3 type-nav",
        lg: "px-8 py-4 type-body",
    };

    const variantClasses = {
        primary: "bg-foreground text-background hover:bg-foreground-soft",
        secondary: "bg-panel border border-border text-foreground hover:bg-subtle",
        ghost: "bg-transparent text-foreground hover:bg-subtle",
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`
        relative overflow-hidden rounded-full
        transition-colors duration-[var(--transition-elegant)]
        focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
            whileHover={disabled ? undefined : { scale: 1.02 }}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            {/* Gradient fill overlay */}
            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}
