"use client";

import * as React from "react";

/**
 * useScrollReveal - Intersection Observer hook for scroll-triggered animations
 * 
 * Usage:
 * const ref = useScrollReveal();
 * <div ref={ref} className="reveal">Content</div>
 * 
 * The element will get "visible" class added when it enters viewport.
 */
export function useScrollReveal(options?: IntersectionObserverInit) {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        // Optional: unobserve after reveal for performance
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [options]);

    return ref;
}

/**
 * ScrollReveal - Wrapper component for scroll-triggered animations
 * 
 * Props:
 * - stagger: Enable staggered animation for children
 * - delay: Delay before animation starts (ms)
 * - className: Additional classes
 */
interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    stagger?: boolean;
}

export default function ScrollReveal({
    children,
    className = "",
    stagger = false,
}: ScrollRevealProps) {
    const ref = useScrollReveal();

    const baseClass = stagger ? "reveal-stagger" : "reveal";

    return (
        <div ref={ref} className={`${baseClass} ${className}`}>
            {children}
        </div>
    );
}
