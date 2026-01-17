"use client";

import { useEffect, useRef, useState } from "react";

interface UseHeaderScrollOptions {
    /** Scroll threshold in pixels before hide/show behavior activates. Default: 88 (header height) */
    threshold?: number;
    /** If true, header will not hide (e.g., when menu is open) */
    disabled?: boolean;
}

interface UseHeaderScrollResult {
    /** True when scrolled past threshold (for visual treatment like border) */
    scrolled: boolean;
    /** True when header should be hidden (scroll down detection) */
    headerHidden: boolean;
    /** The threshold value being used */
    scrollThreshold: number;
}

/**
 * Hook to manage header scroll behavior (CK-style):
 * - `scrolled`: true when past threshold (for transparent → solid transition)
 * - `headerHidden`: true when scrolling down, false when scrolling up
 */
export function useHeaderScroll(options: UseHeaderScrollOptions = {}): UseHeaderScrollResult {
    const { threshold = 88, disabled = false } = options;

    const [scrolled, setScrolled] = useState(false);
    const [headerHidden, setHeaderHidden] = useState(false);
    const lastScrollYRef = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const currentScrollY = window.scrollY;
            const lastScrollY = lastScrollYRef.current;
            const delta = currentScrollY - lastScrollY;

            // Update scrolled state (transparent → solid transition)
            setScrolled(currentScrollY > threshold);

            // Only apply hide/show logic after passing threshold
            if (currentScrollY > threshold) {
                // Scrolling down - hide header (unless disabled)
                if (delta > 10 && !disabled) {
                    setHeaderHidden(true);
                }
                // Scrolling up - show header
                else if (delta < -10) {
                    setHeaderHidden(false);
                }
            } else {
                // At top of page - always show
                setHeaderHidden(false);
            }

            lastScrollYRef.current = currentScrollY;
        };

        // Seed initial state on the next frame (avoid synchronous setState-in-effect lint).
        // Homepage is the only route that uses transparent tone at the top,
        // so initializing from the restored scroll position prevents flicker.
        const raf = window.requestAnimationFrame(() => {
            lastScrollYRef.current = window.scrollY;
            onScroll();
        });

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
        };
    }, [threshold, disabled]);

    return { scrolled, headerHidden, scrollThreshold: threshold };
}
