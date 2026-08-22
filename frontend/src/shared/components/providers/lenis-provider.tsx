"use client";

import { useEffect, useRef, createContext, useContext, useCallback, useMemo } from "react";
import Lenis from "lenis";

/**
 * LenisProvider V6 — Smooth scrolling with stop/start support.
 *
 * V6 changes:
 *   - Exposes stop() / start() via context for mega-menu scroll lock
 *   - Uses useState for Lenis instance to trigger re-renders in consumers
 *   - duration 1.4, lerp 0.1, touchMultiplier 2.0
 *   - wheelMultiplier 1.0
 */

interface LenisContextValue {
    stop: () => void;
    start: () => void;
}

const LenisContext = createContext<LenisContextValue>({
    stop: () => {},
    start: () => {},
});

export function useLenisControl() {
    const ctx = useContext(LenisContext);
    return { stop: ctx.stop, start: ctx.start };
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    const stop = useCallback(() => {
        lenisRef.current?.stop();
    }, []);

    const start = useCallback(() => {
        lenisRef.current?.start();
    }, []);

    useEffect(() => {
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReduced) return;

        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.2,
        });

        lenisRef.current = lenis;

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    const contextValue = useMemo(
        () => ({ stop, start }),
        [stop, start]
    );

    return (
        <LenisContext.Provider value={contextValue}>
            {children}
        </LenisContext.Provider>
    );
}
