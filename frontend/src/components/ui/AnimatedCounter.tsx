"use client";

import { motion, useInView, useSpring, useTransform, MotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";

type AnimatedCounterProps = {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    delay?: number;
    className?: string;
};

/**
 * AnimatedCounter: Counts up from 0 to target value with spring animation.
 * Triggers when element enters viewport.
 */
export default function AnimatedCounter({
    value,
    suffix = "",
    prefix = "",
    duration = 2,
    delay = 0,
    className = "",
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const [hasAnimated, setHasAnimated] = useState(false);

    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 30,
        duration: duration * 1000,
    });

    const displayValue = useTransform(springValue, (latest) => {
        return Math.round(latest);
    });

    useEffect(() => {
        if (isInView && !hasAnimated) {
            const timeout = setTimeout(() => {
                springValue.set(value);
                setHasAnimated(true);
            }, delay * 1000);
            return () => clearTimeout(timeout);
        }
    }, [isInView, hasAnimated, springValue, value, delay]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            <motion.span>{displayValue}</motion.span>
            {suffix}
        </span>
    );
}
