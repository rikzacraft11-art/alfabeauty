"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cinematicEase } from "@/shared/lib/motion";

/**
 * PageTransition V6 — Crossfade-inspired route transition.
 *
 * V6 upgrades:
 *   - GAP-TRANSITION-01: Shorter blur (6px) for snappier crossfade feel
 *   - Reduced scale shift (0.992) for subtlety
 *   - Faster duration (0.45s) — tighter timing feels more app-like
 *   - Will-change hint for filter perf
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                    duration: 0.35,
                    ease: cinematicEase,
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
