"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SITE_SHORT_NAME } from "@/lib/config";
import { cinematicEase } from "@/lib/motion";

/**
 * Preloader V6 — Cinematic brand-reveal with session skip.
 *
 * V6 upgrades:
 *   - GAP-PRELOADER-01: Skip preloader on repeat visits within session
 *   - Uses sessionStorage to track if preloader has already played
 */

const PRELOADER_SEEN_KEY = "preloader-seen";

export function Preloader({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = React.useState(true);
    const [exit, setExit] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        /* If already seen in this session, skip entirely */
        if (sessionStorage.getItem(PRELOADER_SEEN_KEY) === "1") {
            setLoading(false);
            return;
        }

        // Mark as seen for future visits in this session
        sessionStorage.setItem(PRELOADER_SEEN_KEY, "1");
        // Animate progress counter 0→100 over 1.6s
        const start = performance.now();
        const duration = 1600;
        function tick(now: number) {
            const elapsed = now - start;
            const p = Math.min(elapsed / duration, 1);
            // Quintic ease-out for front-loaded feel
            const eased = 1 - Math.pow(1 - p, 5);
            setProgress(Math.round(eased * 100));
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);

        const exitTimer = setTimeout(() => setExit(true), 1800);
        const doneTimer = setTimeout(() => setLoading(false), 2600);
        return () => {
            clearTimeout(exitTimer);
            clearTimeout(doneTimer);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        className="fixed inset-0 z-[200] flex items-center justify-center"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: cinematicEase }}
                    >
                        {/* Split wipe — top half slides up */}
                        <motion.div
                            className="absolute inset-x-0 top-0 h-1/2 bg-foreground origin-top"
                            animate={exit ? { scaleY: 0 } : { scaleY: 1 }}
                            transition={{ duration: 0.9, ease: cinematicEase }}
                            style={{ transformOrigin: "top" }}
                        />
                        {/* Split wipe — bottom half slides down */}
                        <motion.div
                            className="absolute inset-x-0 bottom-0 h-1/2 bg-foreground origin-bottom"
                            animate={exit ? { scaleY: 0 } : { scaleY: 1 }}
                            transition={{ duration: 0.9, ease: cinematicEase }}
                            style={{ transformOrigin: "bottom" }}
                        />

                        {/* Logo + wordmark + progress */}
                        <motion.div
                            className="relative z-10 flex flex-col items-center gap-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={
                                exit
                                    ? { opacity: 0, scale: 1.06 }
                                    : { opacity: 1, scale: 1 }
                            }
                            transition={{
                                duration: exit ? 0.4 : 0.8,
                                ease: cinematicEase,
                                delay: exit ? 0 : 0.2,
                            }}
                        >
                            <motion.div
                            animate={exit ? {} : { scale: [1, 1.05, 1] }}
                                transition={exit ? {} : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Image
                                    src="/images/logo/alfa-beauty-mark.svg"
                                    alt=""
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 object-contain"
                                    priority
                                />
                            </motion.div>
                            <motion.span
                                className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/80"
                                initial={{ opacity: 0, y: 8 }}
                                animate={
                                    exit
                                        ? { opacity: 0, y: -8 }
                                        : { opacity: 1, y: 0 }
                                }
                                transition={{
                                    duration: 0.6,
                                    ease: cinematicEase,
                                    delay: exit ? 0 : 0.5,
                                }}
                            >
                                {SITE_SHORT_NAME}
                            </motion.span>

                            {/* Progress counter */}
                            <motion.span
                                className="mt-2 text-[10px] font-medium tabular-nums tracking-widest text-white/40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: exit ? 0 : 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                {progress}%
                            </motion.span>

                            {/* Loading bar with shimmer */}
                            <motion.div
                                className="mt-2 h-[2px] w-16 overflow-hidden bg-white/10 rounded-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: exit ? 0 : 1 }}
                                transition={{ delay: 0.5 }}
                                style={{ boxShadow: exit ? "none" : "0 0 12px rgba(255,255,255,0.15)" }}
                            >
                                <motion.div
                                    className="h-full bg-white/60 rounded-full shimmer-bar"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: exit ? 1 : 0.7 }}
                                    transition={{
                                        duration: exit ? 0.3 : 1.4,
                                        ease: "easeInOut",
                                    }}
                                    style={{ transformOrigin: "left" }}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </>
    );
}
