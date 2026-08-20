"use client";

import { useEffect, useRef, useState, createContext, useContext, useCallback, useMemo } from "react";
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
    lenis: Lenis | null;
    stop: () => void;
    start: () => void;
}

const LenisContext = createContext<LenisContextValue>({
    lenis: null,
    stop: () => {},
    start: () => {},
});

export function useLenis(): Lenis | null {
    return useContext(LenisContext).lenis;
}

export function useLenisControl() {
    const ctx = useContext(LenisContext);
    return { stop: ctx.stop, start: ctx.start };
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const [instance, setInstance] = useState<Lenis | null>(null);

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
            lerp: 0.08,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;
        setInstance(lenis);

        let rafId: number;
        let isRunning = false;

        function raf(time: number) {
            lenis.raf(time);
            if (lenis.isScrolling) {
                rafId = requestAnimationFrame(raf);
            } else {
                isRunning = false;
            }
        }

        function startRaf() {
            if (!isRunning) {
                isRunning = true;
                rafId = requestAnimationFrame(raf);
            }
        }

        // Only run RAF when user is actually scrolling
        window.addEventListener("scroll", startRaf, { passive: true });
        window.addEventListener("wheel", startRaf, { passive: true });
        window.addEventListener("touchmove", startRaf, { passive: true });
        startRaf(); // initial kick

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", startRaf);
            window.removeEventListener("wheel", startRaf);
            window.removeEventListener("touchmove", startRaf);
            lenis.destroy();
            lenisRef.current = null;
            setInstance(null);
        };
    }, []);

    const contextValue = useMemo(
        () => ({ lenis: instance, stop, start }),
        [instance, stop, start]
    );

    return (
        <LenisContext.Provider value={contextValue}>
            {children}
        </LenisContext.Provider>
    );
}
