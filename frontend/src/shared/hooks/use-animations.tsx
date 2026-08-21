"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PARALLAX } from "@/shared/lib/motion";

/* ─────────────────────────────────────────────────────────────────────
 * useParallax V4 — Scroll-linked parallax offset with opacity fade.
 *
 * V4: Returns opacity transform for fade-out at section edges.
 * ───────────────────────────────────────────────────────────────────── */

export function useParallax({ speed = PARALLAX.default }: { speed?: number } = {}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

    return { ref, y, opacity, scrollYProgress };
}

/* ─────────────────────────────────────────────────────────────────────
 * Parallax — Declarative parallax wrapper component.
 * ───────────────────────────────────────────────────────────────────── */

interface ParallaxProps {
    children: React.ReactNode;
    speed?: number;
    className?: string;
    /** Enable opacity fade at edges (default false) */
    fade?: boolean;
}

export function Parallax({ children, speed = PARALLAX.default, className, fade }: ParallaxProps) {
    const { ref, y, opacity } = useParallax({ speed });
    return (
        <div ref={ref} className={className} style={{ overflow: "hidden" }}>
            <motion.div style={{ y, ...(fade ? { opacity } : {}) }}>
                {children}
            </motion.div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────
 * useScrollProgress — Global page scroll progress (0→1).
 *
 * Useful for scroll-linked progress bars, header opacity, etc.
 * ───────────────────────────────────────────────────────────────────── */

export function useScrollProgress() {
    const { scrollYProgress } = useScroll();
    return scrollYProgress;
}

/* ─────────────────────────────────────────────────────────────────────
 * useCountUp V4 — Enhanced counter with quintic easing.
 *
 * V4 improvements over V3:
 *   - Decimal support (e.g. 99.9%)
 *   - onComplete callback for pulse/glow effects
 *   - Configurable threshold
 * ───────────────────────────────────────────────────────────────────── */

export function useCountUp({
    target,
    duration = 2.4,
    suffix = "",
    prefix = "",
    delay = 0,
    format = true,
    decimals = 0,
    onComplete,
}: {
    target: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    delay?: number;
    /** Format with locale separators (default: true) */
    format?: boolean;
    /** Number of decimal places (default: 0) */
    decimals?: number;
    /** Called when animation completes */
    onComplete?: () => void;
}) {
    const ref = React.useRef<HTMLElement>(null);
    const [display, setDisplay] = React.useState(`${prefix}0${suffix}`);
    const hasTriggered = React.useRef(false);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTriggered.current) {
                    hasTriggered.current = true;
                    observer.disconnect();

                    const startTime = performance.now() + delay * 1000;
                    const animate = (now: number) => {
                        if (now < startTime) {
                            requestAnimationFrame(animate);
                            return;
                        }
                        const elapsed = (now - startTime) / 1000;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease-out quintic: sharper initial burst, softer landing
                        const eased = 1 - Math.pow(1 - progress, 5);
                        const value = eased * target;
                        let formatted: string;
                        if (decimals > 0) {
                            formatted = format
                                ? value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
                                : value.toFixed(decimals);
                        } else {
                            const rounded = Math.round(value);
                            formatted = format ? rounded.toLocaleString() : String(rounded);
                        }
                        setDisplay(`${prefix}${formatted}${suffix}`);
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            onComplete?.();
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration, suffix, prefix, delay, format, decimals, onComplete]);

    return { ref, display };
}

/* ─────────────────────────────────────────────────────────────────────
 * useLineGrow V4 — Animated horizontal/vertical line.
 *
 * V4: Tighter scroll offset, supports vertical (scaleY) option.
 * ───────────────────────────────────────────────────────────────────── */

export function useLineGrow({ vertical = false }: { vertical?: boolean } = {}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.9", "start 0.5"],
    });
    const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
    return { ref, ...(vertical ? { scaleY: scale } : { scaleX: scale }) };
}

interface LineGrowProps {
    className?: string;
    vertical?: boolean;
}

export function LineGrow({ className, vertical }: LineGrowProps) {
    const { ref, ...scaleProps } = useLineGrow({ vertical });
    return (
        <div ref={ref} className="overflow-hidden">
            <motion.div
                className={className ?? (vertical ? "w-px bg-border-warm h-full" : "h-px bg-border-warm")}
                style={{ ...scaleProps, transformOrigin: vertical ? "top" : "left" }}
            />
        </div>
    );
}
