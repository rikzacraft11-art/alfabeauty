"use client";

import { useEffect } from "react";

/**
 * FocusManager: Ensures focus is properly managed with Lenis scroll.
 * Design V2 accessibility pattern - syncs focus with smooth scroll.
 */
export default function FocusManager() {
    useEffect(() => {
        // Handle hash navigation focus
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    // Wait for Lenis to complete scroll
                    setTimeout(() => {
                        (element as HTMLElement).focus({ preventScroll: true });
                    }, 600); // Match Lenis duration
                }
            }
        };

        // Handle skip link functionality
        const handleSkipLink = (e: KeyboardEvent) => {
            if (e.key === "Tab" && !e.shiftKey) {
                const activeElement = document.activeElement;
                if (activeElement?.classList.contains("skip-link")) {
                    // Skip link is focused, allow normal behavior
                }
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        document.addEventListener("keydown", handleSkipLink);

        // Initial hash check
        handleHashChange();

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
            document.removeEventListener("keydown", handleSkipLink);
        };
    }, []);

    return null;
}
