"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import AnimatedCounter from "./AnimatedCounter";

type Stat = {
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description?: string;
};

type StatsSectionProps = {
    stats: Stat[];
    className?: string;
};

/**
 * StatsSection: Animated statistics display with large numbers.
 * Numbers count up when section enters viewport.
 */
export default function StatsSection({ stats, className = "" }: StatsSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ${className}`}
        >
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    className="text-center lg:text-left"
                >
                    <div className="stat-number mb-2">
                        <AnimatedCounter
                            value={stat.value}
                            suffix={stat.suffix}
                            prefix={stat.prefix}
                            delay={index * 0.15}
                        />
                    </div>
                    <div className="stat-label mb-1">{stat.label}</div>
                    {stat.description && (
                        <p className="type-body text-muted text-sm">{stat.description}</p>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
}
