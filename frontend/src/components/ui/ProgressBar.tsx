/**
 * ProgressBar - Atomic Progress Indicator
 * 
 * @module components/atoms/ProgressBar
 * @description A minimal linear progress bar with:
 * - Animated fill
 * - Accessible (role="progressbar")
 * - CSS-only animation
 * 
 * @example
 * <ProgressBar value={0.5} />
 */

'use client';

import { memo } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface ProgressBarProps {
    /** Progress value from 0 to 1 */
    readonly value: number;
    /** Bar height in pixels */
    readonly height?: number;
    /** Show animated transition */
    readonly animated?: boolean;
    /** Additional CSS classes for container */
    readonly className?: string;
    /** Accessible label */
    readonly ariaLabel?: string;
}

// =============================================================================
// Component
// =============================================================================

export const ProgressBar = memo(function ProgressBar({
    value,
    height = 2,
    animated = true,
    className = '',
    ariaLabel = 'Progress',
}: ProgressBarProps) {
    // Clamp value between 0 and 1
    const normalizedValue = Math.max(0, Math.min(1, value));
    const percentage = Math.round(normalizedValue * 100);

    return (
        <div
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={ariaLabel}
            className={`relative overflow-hidden bg-white/20 ${className}`}
            style={{ height: `${height}px` }}
        >
            <div
                className={`
          absolute inset-y-0 left-0 
          bg-white
          ${animated ? 'transition-all duration-300 ease-out' : ''}
        `}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
});

ProgressBar.displayName = 'ProgressBar';
