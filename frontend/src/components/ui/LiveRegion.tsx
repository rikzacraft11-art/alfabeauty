"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Props for LiveRegion component
 */
interface LiveRegionProps {
    /** Content to announce */
    children: ReactNode;
    /** Politeness level: polite waits, assertive interrupts */
    politeness?: "polite" | "assertive";
    /** Whether the region is currently active */
    active?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * LiveRegion Component
 * 
 * Provides accessible announcements for dynamic content updates.
 * Uses ARIA live regions to notify screen reader users of changes.
 * 
 * Features:
 * - Supports polite (waits for pause) and assertive (immediate) modes
 * - Visually hidden by default for SR-only announcements
 * - Can be made visible when needed
 * 
 * Usage:
 * ```tsx
 * // For form submission feedback
 * <LiveRegion active={isSubmitted} politeness="polite">
 *   Form submitted successfully!
 * </LiveRegion>
 * 
 * // For urgent errors
 * <LiveRegion active={hasError} politeness="assertive">
 *   {errorMessage}
 * </LiveRegion>
 * ```
 */
export default function LiveRegion({
    children,
    politeness = "polite",
    active = true,
    className = "",
}: LiveRegionProps) {
    const regionRef = useRef<HTMLDivElement>(null);

    // Force re-announcement when content changes
    useEffect(() => {
        if (active && regionRef.current) {
            // Toggle atomic to force re-read
            regionRef.current.setAttribute("aria-atomic", "false");
            requestAnimationFrame(() => {
                regionRef.current?.setAttribute("aria-atomic", "true");
            });
        }
    }, [children, active]);

    if (!active) return null;

    return (
        <div
            ref={regionRef}
            role="status"
            aria-live={politeness}
            aria-atomic="true"
            className={`sr-only ${className}`}
        >
            {children}
        </div>
    );
}

/**
 * VisualLiveRegion Component
 * 
 * Same as LiveRegion but visible on screen for sighted users.
 * Useful for toast notifications, form feedback, etc.
 */
export function VisualLiveRegion({
    children,
    politeness = "polite",
    active = true,
    className = "",
}: LiveRegionProps) {
    if (!active) return null;

    return (
        <div
            role="status"
            aria-live={politeness}
            aria-atomic="true"
            className={className}
        >
            {children}
        </div>
    );
}
