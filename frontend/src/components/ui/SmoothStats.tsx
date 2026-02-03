"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

type StatItem = {
    value: number;
    suffix?: string;
    label: string;
};

type SmoothStatsProps = {
    stats: StatItem[];
    className?: string;
};

/**
 * Animated counter with spring physics
 */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const steps = 60;
        const stepValue = value / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(stepValue * step), value);
            setCount(current);

            if (step >= steps) {
                clearInterval(timer);
                setCount(value);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isInView, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {count}{suffix}
        </span>
    );
}

/**
 * SmoothStats: Inline horizontal stats with animated counters
 * Replaces floating popup stats with clean, integrated design
 */
export default function SmoothStats({ stats, className = "" }: SmoothStatsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-5%" });

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
            className={`flex flex-wrap items-center gap-6 md:gap-10 ${className}`}
        >
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.22, 1, 0.36, 1] as const,
                    }}
                    className="group flex items-baseline gap-2"
                >
                    <span className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                        <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-sm text-muted uppercase tracking-wider">
                        {stat.label}
                    </span>

                    {/* Separator dot (not on last item) */}
                    {index < stats.length - 1 && (
                        <span className="ml-4 md:ml-6 w-1 h-1 rounded-full bg-muted hidden md:block" />
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
}
