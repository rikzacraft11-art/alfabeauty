"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

type AnimatedCounterProps = {
    value: number;
    duration?: number;
    delay?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    once?: boolean;
};

/**
 * AnimatedCounter: Animates a number from 0 to target value.
 * Scroll-triggered with spring physics for smooth counting.
 */
export default function AnimatedCounter({
    value,
    duration = 2,
    delay = 0,
    suffix = "",
    prefix = "",
    className = "",
    once = true,
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once, margin: "-50px" });
    const [hasActivated, setHasActivated] = useState(false);

    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: duration * 1000,
    });

    const displayValue = useTransform(springValue, (latest) => Math.round(latest));
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        if (isInView && !hasActivated) {
            const timer = setTimeout(() => {
                springValue.set(value);
                setHasActivated(true);
            }, delay * 1000);
            return () => clearTimeout(timer);
        }
    }, [isInView, hasActivated, value, delay, springValue]);

    useEffect(() => {
        const unsubscribe = displayValue.on("change", (latest) => {
            setCurrentValue(latest);
        });
        return () => unsubscribe();
    }, [displayValue]);

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay }}
        >
            {prefix}
            {currentValue.toLocaleString()}
            {suffix}
        </motion.span>
    );
}
