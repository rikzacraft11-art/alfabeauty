"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ReducedMotionContextType = {
    prefersReducedMotion: boolean;
};

const ReducedMotionContext = createContext<ReducedMotionContextType>({
    prefersReducedMotion: false,
});

/**
 * ReducedMotionProvider: Respects user's motion preferences.
 * Design V2 accessibility pattern - WCAG 2.2 AA compliance.
 */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <ReducedMotionContext.Provider value={{ prefersReducedMotion }}>
            {children}
        </ReducedMotionContext.Provider>
    );
}

/**
 * Hook to check if user prefers reduced motion.
 */
export function useReducedMotion() {
    return useContext(ReducedMotionContext);
}

/**
 * Get motion props based on reduced motion preference.
 * Use this to conditionally disable animations.
 */
export function getMotionProps(prefersReducedMotion: boolean) {
    if (prefersReducedMotion) {
        return {
            initial: false,
            animate: false,
            exit: false,
            transition: { duration: 0 },
        };
    }
    return {};
}
