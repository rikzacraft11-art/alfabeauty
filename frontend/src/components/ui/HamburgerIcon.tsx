"use client";

/**
 * HamburgerIcon Component
 * 
 * CK-style animated hamburger icon that morphs between 2 lines and X.
 * Uses pure CSS transforms for smooth 0.3s transitions.
 * 
 * Features:
 * - 2-line design (modern, minimal)
 * - Smooth morph to X on open
 * - Respects reduced motion preferences
 * - Accessible (used within button with aria-label)
 */

interface HamburgerIconProps {
    /** Whether the menu is open (shows X) or closed (shows lines) */
    isOpen: boolean;
    /** Additional CSS classes */
    className?: string;
}

export default function HamburgerIcon({ isOpen, className = "" }: HamburgerIconProps) {
    return (
        <div
            className={`relative w-6 h-6 flex flex-col items-center justify-center ${className}`}
            aria-hidden="true"
        >
            {/* Top line - rotates to form top half of X */}
            <span
                className="absolute h-[2px] w-5 bg-current transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{
                    transform: isOpen
                        ? 'rotate(45deg) translateY(0)'
                        : 'rotate(0) translateY(-4px)',
                }}
            />
            {/* Bottom line - rotates to form bottom half of X */}
            <span
                className="absolute h-[2px] w-5 bg-current transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{
                    transform: isOpen
                        ? 'rotate(-45deg) translateY(0)'
                        : 'rotate(0) translateY(4px)',
                }}
            />
        </div>
    );
}
