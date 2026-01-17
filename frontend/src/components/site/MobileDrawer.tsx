"use client";

import { useRef, type ReactNode, type RefObject, useEffect } from "react";

import { useScrollLock } from "@/lib/useScrollLock";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface MobileDrawerProps {
    /** Whether the drawer is open */
    isOpen: boolean;
    /** Callback when drawer should close */
    onClose: () => void;
    /** Drawer content */
    children: ReactNode;
    /** Aria label for the dialog */
    ariaLabel?: string;
    /** Ref to the element that opened the drawer (for focus return) */
    openerRef?: RefObject<HTMLElement | null>;
}

/**
 * Full-viewport mobile drawer (CK-style).
 * - 100vw width
 * - Fixed positioning outside parent constraints
 * - Focus trap with Escape to close
 * - Scroll lock when open
 */
export default function MobileDrawer({
    isOpen,
    onClose,
    children,
    ariaLabel = "Menu",
    openerRef,
}: MobileDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const returnFocusElRef = useRef<HTMLElement | null>(null);

    // Match reference cutoff: collapse → desktop nav happens at ~992px.
    const desktopNav = useMediaQuery("(min-width: 992px)");
    const enabled = !desktopNav;

    // Lock body scroll when drawer is open
    useScrollLock(isOpen && enabled);

    // Focus return + Escape-to-close parity.
    useEffect(() => {
        if (!enabled) return;

        if (isOpen) {
            // Store opener (or current focus) so we can restore when closing.
            returnFocusElRef.current = openerRef?.current ?? (document.activeElement as HTMLElement | null);
        } else {
            // Drawer just closed: restore focus.
            returnFocusElRef.current?.focus();
        }

        if (!isOpen) return;

        function onKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;
            e.preventDefault();
            onClose();
        }

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [enabled, isOpen, onClose, openerRef]);

    if (!enabled) return null;

    const visible = Boolean(isOpen);
    const motionClass = visible
        ? "translate-y-0 opacity-100 pointer-events-auto"
        : "-translate-y-2 opacity-0 pointer-events-none";

    return (
        <div
            className={`fixed inset-x-0 top-[var(--header-offset)] z-50 h-[calc(var(--vh,100dvh)-var(--header-offset))] transform-gpu transition-[transform,opacity] duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${motionClass}`}
            data-drawer-open={visible ? "true" : "false"}
        >
            <nav
                id="mobile-nav"
                ref={drawerRef}
                aria-label={ariaLabel}
                aria-hidden={visible ? undefined : true}
                className={`h-full overflow-auto bg-background ${visible ? "is-visible" : ""}`}
            >
                {visible ? children : null}
            </nav>
        </div>
    );
}
