"use client";

import { useEffect, useRef, type RefObject } from "react";

interface UseFocusTrapOptions {
    /** Whether the focus trap is active */
    enabled: boolean;
    /** Callback when Escape is pressed */
    onEscape?: () => void;
    /** Element to focus when trap is activated */
    initialFocusRef?: RefObject<HTMLElement | null>;
    /** Element to return focus to when trap is deactivated */
    returnFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Returns focusable elements within a container
 */
function getFocusable(root: HTMLElement | null): HTMLElement[] {
    if (!root) return [];
    const nodes = root.querySelectorAll<HTMLElement>(
        [
            "a[href]",
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            "[tabindex]:not([tabindex='-1'])",
        ].join(","),
    );
    return Array.from(nodes).filter((n) => !n.hasAttribute("disabled") && n.tabIndex !== -1);
}

/**
 * Hook to trap keyboard focus within a container.
 * - Traps Tab cycling within the container
 * - Handles Escape key to close
 * - Manages focus on open/close
 */
export function useFocusTrap<T extends HTMLElement>(
    containerRef: RefObject<T | null>,
    options: UseFocusTrapOptions,
) {
    const { enabled, onEscape, initialFocusRef, returnFocusRef } = options;
    const returnFocusElRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!enabled) return;

        // Store the element to return focus to
        returnFocusElRef.current = returnFocusRef?.current ?? (document.activeElement as HTMLElement);

        // Focus the initial element
        const focusTimer = window.setTimeout(() => {
            if (initialFocusRef?.current) {
                initialFocusRef.current.focus();
            } else {
                // Focus first focusable in container
                const focusables = getFocusable(containerRef.current);
                if (focusables.length > 0) {
                    focusables[0].focus();
                }
            }
        }, 0);

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                e.preventDefault();
                onEscape?.();
                return;
            }

            if (e.key !== "Tab") return;

            const focusables = getFocusable(containerRef.current);
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;

            if (!active) return;

            if (e.shiftKey) {
                // Shift+Tab at first element -> go to last
                if (active === first || active === containerRef.current) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                // Tab at last element -> go to first
                if (active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        document.addEventListener("keydown", onKeyDown);

        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener("keydown", onKeyDown);
            // Return focus to the original element
            returnFocusElRef.current?.focus();
        };
    }, [enabled, onEscape, initialFocusRef, returnFocusRef, containerRef]);
}
