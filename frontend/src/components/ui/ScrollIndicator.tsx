"use client";

import { motion, useScroll, useTransform } from "framer-motion";

type ScrollIndicatorProps = {
    className?: string;
    text?: string;
};

/**
 * ScrollIndicator: Animated scroll-down indicator for hero sections.
 * Fades out as user scrolls.
 */
export default function ScrollIndicator({
    className = "",
    text = "Scroll",
}: ScrollIndicatorProps) {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);

    return (
        <motion.div
            className={`flex flex-col items-center gap-2 ${className}`}
            style={{ opacity }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
        >
            <span className="type-ui-xs text-muted uppercase tracking-widest">
                {text}
            </span>
            <motion.div
                className="w-6 h-10 rounded-full border border-border flex items-start justify-center p-2"
                aria-hidden="true"
            >
                <motion.div
                    className="w-1 h-2 bg-muted rounded-full"
                    animate={{
                        y: [0, 12, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
        </motion.div>
    );
}
