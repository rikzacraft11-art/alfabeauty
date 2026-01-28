"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// =============================================================================
// Discord-Style Image Transition
// Clean instant fade - no bounce, no scale
// =============================================================================

interface ImageTransitionProps {
    src: string;
    alt: string;
    activeKey: string;
    direction?: number;
}

export function ImageTransition({
    src,
    alt,
    activeKey,
}: ImageTransitionProps) {
    const isReducedMotion = useReducedMotion();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={activeKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: isReducedMotion ? 0 : 0.2 }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 260px, 300px"
                    className="object-cover"
                    priority
                />
            </motion.div>
        </AnimatePresence>
    );
}

// =============================================================================
// Discord-Style Content Transition
// Clean fade with subtle spring on text
// =============================================================================

interface ContentTransitionProps {
    label: string;
    description: string;
    activeKey: string;
    ctaText: string;
}

export function ContentTransition({
    label,
    description,
    activeKey,
    ctaText
}: ContentTransitionProps) {
    const isReducedMotion = useReducedMotion();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={activeKey}
                initial={{ opacity: 0, y: isReducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={isReducedMotion ? { duration: 0 } : {
                    opacity: { duration: 0.2 },
                    y: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    },
                }}
                className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10"
            >
                {/* Eyebrow */}
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">
                    {ctaText}
                </p>

                {/* Title */}
                <h3 className="text-base sm:text-lg text-white font-medium mb-1">
                    {label}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-3">
                    {description}
                </p>

                {/* Arrow indicator */}
                <span className="inline-flex text-white/70 group-hover:text-white 
                               transition-colors duration-100">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="transition-transform duration-100 group-hover:translate-x-0.5"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </span>
            </motion.div>
        </AnimatePresence>
    );
}
