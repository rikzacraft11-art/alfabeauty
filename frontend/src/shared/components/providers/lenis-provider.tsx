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

type LenisScrollToOptions = Parameters<Lenis["scrollTo"]>[1];

interface LenisContextValue {
    stop: () => void;
    start: () => void;
    scrollTo: (target: number | HTMLElement | string, options?: LenisScrollToOptions) => void;
}

const LenisContext = createContext<LenisContextValue>({
    stop: () => {},
    start: () => {},
    scrollTo: () => {},
});

export function useLenisControl() {
    const ctx = useContext(LenisContext);
    return { stop: ctx.stop, start: ctx.start, scrollTo: ctx.scrollTo };
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    const stop = useCallback(() => {
        lenisRef.current?.stop();
    }, []);

    const start = useCallback(() => {
        lenisRef.current?.start();
    }, []);

    const scrollTo = useCallback((target: number | HTMLElement | string, options?: LenisScrollToOptions) => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(target, {
                duration: 1.0,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                ...options,
            });
        } else if (typeof target === "number") {
            window.scrollTo({ top: target, behavior: "smooth" });
        } else if (typeof target === "string") {
            const el = document.querySelector(target);
            el?.scrollIntoView({ behavior: "smooth" });
        } else if (target instanceof HTMLElement) {
            target.scrollIntoView({ behavior: "smooth" });
        }
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
        if (typeof window !== "undefined") {
            (window as Window & { __lenis?: Lenis }).__lenis = lenis;
        }

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
            if (typeof window !== "undefined") {
                delete (window as Window & { __lenis?: Lenis }).__lenis;
            }
        };
    }, []);

    const contextValue = useMemo(
        () => ({ stop, start, scrollTo }),
        [stop, start, scrollTo]
    );

    return (
        <LenisContext.Provider value={contextValue}>
            {children}
        </LenisContext.Provider>
    );
}
