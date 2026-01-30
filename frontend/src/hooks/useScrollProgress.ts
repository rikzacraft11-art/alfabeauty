"use client";

import { useEffect, useState } from "react";

/**
 * useScrollProgress: Hook for parallax and scroll-based animations.
 * Returns a value from 0 to 1 representing scroll progress.
 * 
 * @param elementRef - Optional ref to track element visibility
 * @returns scrollProgress (0-1)
 */
export function useScrollProgress(elementRef?: React.RefObject<HTMLElement>) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function handleScroll() {
            if (elementRef?.current) {
                const rect = elementRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementTop = rect.top;
                const elementHeight = rect.height;

                // Calculate progress based on element position
                const start = windowHeight;
                const end = -elementHeight;
                const current = elementTop;
                const rawProgress = (start - current) / (start - end);

                setProgress(Math.max(0, Math.min(1, rawProgress)));
            } else {
                // Global scroll progress
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener("scroll", handleScroll);
    }, [elementRef]);

    return progress;
}
