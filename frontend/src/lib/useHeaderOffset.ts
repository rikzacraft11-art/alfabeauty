"use client";

import { useEffect, RefObject } from "react";

/**
 * Hook to sync header height to CSS custom property.
 * Uses ResizeObserver when available, falls back to resize event.
 */
export function useHeaderOffset(
    headerRef: RefObject<HTMLElement | null>,
    cssVar = "--header-offset"
) {
    useEffect(() => {
        const root = document.documentElement;
        const headerEl = headerRef.current;
        if (!headerEl) return;

        const updateOffset = () => {
            const height = headerEl.offsetHeight;
            root.style.setProperty(cssVar, `${height}px`);
        };

        updateOffset();

        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(() => updateOffset());
            observer.observe(headerEl);
            return () => observer.disconnect();
        }

        window.addEventListener("resize", updateOffset);
        return () => window.removeEventListener("resize", updateOffset);
    }, [headerRef, cssVar]);
}
