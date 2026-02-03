"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import TextReveal from "@/components/ui/TextReveal";
import LineReveal from "@/components/ui/LineReveal";

type ExpertiseItem = {
    title: string;
    description: string;
};

type ExpertiseListProps = {
    items: ExpertiseItem[];
};

/**
 * ExpertiseList: Interactive list with animated number badges and hover effects.
 * Features: Staggered reveal, hover expansion, number indicators.
 */
export default function ExpertiseList({ items }: ExpertiseListProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    return (
        <motion.div
            ref={containerRef}
            className="grid gap-0"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: 0.15 }
                }
            }}
        >
            {items.map((item, index) => (
                <ExpertiseItem
                    key={item.title}
                    item={item}
                    index={index}
                />
            ))}
        </motion.div>
    );
}

function ExpertiseItem({ item, index }: { item: ExpertiseItem; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const,
            }
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top border line */}
            <LineReveal delay={index * 0.1} direction="left" className="mb-0" />

            <div className="py-8 md:py-10">
                <div className="grid md:grid-cols-12 gap-6 items-start">
                    {/* Number badge */}
                    <div className="md:col-span-1 hidden md:block">
                        <motion.span
                            className="type-ui-xs text-muted tabular-nums"
                            animate={{
                                x: isHovered ? 4 : 0,
                                color: isHovered ? "var(--color-foreground)" : "var(--color-muted)",
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            0{index + 1}
                        </motion.span>
                    </div>

                    {/* Title */}
                    <div className="md:col-span-4">
                        <motion.h3
                            className="type-h3 text-foreground relative inline-block"
                            animate={{
                                x: isHovered ? 8 : 0,
                            }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <TextReveal delay={0.2 + (index * 0.1)}>{item.title}</TextReveal>

                            {/* Underline animation */}
                            <motion.span
                                className="absolute -bottom-1 left-0 h-0.5 bg-foreground origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: isHovered ? 1 : 0 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </motion.h3>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-6">
                        <motion.p
                            className="type-body text-muted max-w-xl"
                            animate={{
                                color: isHovered ? "var(--color-foreground-muted)" : "var(--color-muted)",
                                x: isHovered ? 4 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {item.description}
                        </motion.p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="md:col-span-1 hidden md:flex justify-end">
                        <motion.span
                            className="text-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                x: isHovered ? 0 : -10
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            →
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* Hover background highlight */}
            <motion.div
                className="absolute inset-0 bg-subtle/50 -z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
}
