"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor: Awwwards-style custom cursor with blend mode.
 * - Follows mouse with smooth lerp
 * - Scales up on interactive elements
 * - Hidden on touch devices
 */
export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Mouse position with lerp smoothing
    const mouse = useRef({ x: 0, y: 0 });
    const cursor = useRef({ x: 0, y: 0 });
    const rafId = useRef<number>(0);

    useEffect(() => {
        // Check if touch device
        const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        if (isTouchDevice) return;

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.classList.contains("cursor-hover") ||
                target.dataset.cursorHover === "true";

            if (isInteractive) {
                setIsHovering(true);
            }
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
        };

        // Animation loop
        const animate = () => {
            // Lerp factor (higher = faster, lower = smoother)
            const lerp = 0.15;

            cursor.current.x += (mouse.current.x - cursor.current.x) * lerp;
            cursor.current.y += (mouse.current.y - cursor.current.y) * lerp;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${cursor.current.x}px, ${cursor.current.y}px)`;
            }

            rafId.current = requestAnimationFrame(animate);
        };

        // Add event listeners
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseover", handleMouseEnter);
        document.addEventListener("mouseout", handleMouseLeave);

        rafId.current = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseover", handleMouseEnter);
            document.removeEventListener("mouseout", handleMouseLeave);
            cancelAnimationFrame(rafId.current);
        };
    }, [isVisible]);

    // Don't render on touch devices
    if (typeof window !== "undefined") {
        const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        if (isTouchDevice) return null;
    }

    return (
        <div
            ref={cursorRef}
            className="cursor-wrapper"
            style={{
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.3s ease"
            }}
            aria-hidden="true"
        >
            <div
                className={`cursor-dot ${isHovering ? "is-hovering" : ""}`}
            />
        </div>
    );
}
