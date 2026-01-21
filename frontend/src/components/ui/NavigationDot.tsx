/**
 * NavigationDot - Atomic Navigation Indicator
 * 
 * @module components/atoms/NavigationDot
 * @description A single dot indicator for navigation with:
 * - Active/inactive states
 * - Focus ring for accessibility
 * - Keyboard accessible
 * - Scale animation on hover
 * 
 * @example
 * <NavigationDot 
 *   isActive={true} 
 *   label="Products" 
 *   onClick={() => {}} 
 * />
 */

'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

// =============================================================================
// Types
// =============================================================================

export interface NavigationDotProps {
    /** Whether this dot is active */
    readonly isActive: boolean;
    /** Accessible label */
    readonly label: string;
    /** Click handler */
    readonly onClick: () => void;
    /** Disable interaction */
    readonly disabled?: boolean;
    /** Size of dot in pixels */
    readonly size?: number;
    /** Show label text */
    readonly showLabel?: boolean;
    /** Additional CSS classes */
    readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export const NavigationDot = memo(function NavigationDot({
    isActive,
    label,
    onClick,
    disabled = false,
    size = 10,
    showLabel = false,
    className = '',
}: NavigationDotProps) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className={`
        group
        relative
        flex flex-col items-center gap-2
        py-2 px-1
        focus:outline-none
        focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            {/* Dot */}
            <span className="relative">
                <span
                    className={`
            block rounded-full
            transition-all duration-300
            ${isActive
                            ? 'bg-white scale-100'
                            : 'bg-white/40 scale-75 group-hover:bg-white/60 group-hover:scale-90'
                        }
          `}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                    }}
                />

                {/* Active ring indicator */}
                {isActive && (
                    <motion.span
                        layoutId="service-nav-ring"
                        className="absolute inset-0 -m-1 border border-white/50 rounded-full"
                        transition={{
                            type: 'spring',
                            bounce: 0.2,
                            duration: 0.6,
                        }}
                    />
                )}
            </span>

            {/* Label (optional) */}
            {showLabel && (
                <span
                    className={`
            type-data uppercase tracking-wider
            transition-colors duration-300
            ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'}
          `}
                >
                    {label}
                </span>
            )}
        </button>
    );
});

NavigationDot.displayName = 'NavigationDot';
