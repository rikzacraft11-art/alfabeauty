"use client";

import { useEffect } from "react";

/**
 * Custom hook for locking body scroll
 * 
 * Used when modals, drawers, or overlays are open.
 * Automatically restores scroll on unmount.
 * 
 * @param locked - Whether scroll should be locked
 */
export function useScrollLock(locked: boolean) {
    useEffect(() => {
        if (typeof document === "undefined") return;

        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;

        if (locked) {
            // Calculate scrollbar width to prevent layout shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            document.body.style.overflow = "hidden";
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        }

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, [locked]);
}
