/**
 * ServiceNumber - Atomic Number Display
 * 
 * @module components/atoms/ServiceNumber
 * @description Large number display (01, 02, 03) with:
 * - Animated entrance
 * - Monospace typography
 * - Professional minimalist styling
 * 
 * @example
 * <ServiceNumber number="01" />
 */

'use client';

import { memo } from 'react';
import { motion, type Variants } from 'framer-motion';

// =============================================================================
// Types
// =============================================================================

export type ServiceNumberValue = '01' | '02' | '03';

export interface ServiceNumberProps {
    /** Number to display */
    readonly number: ServiceNumberValue;
    /** Animation direction (-1: left, 0: none, 1: right) */
    readonly direction?: -1 | 0 | 1;
    /** Skip animation */
    readonly skipAnimation?: boolean;
    /** Additional CSS classes */
    readonly className?: string;
}

// =============================================================================
// Animation Variants
// =============================================================================

const numberVariants: Variants = {
    enter: (direction: number) => ({
        y: direction >= 0 ? 40 : -40,
        opacity: 0,
    }),
    center: {
        y: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        y: direction >= 0 ? -40 : 40,
        opacity: 0,
    }),
};

const transition = {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1] as const,
};

// =============================================================================
// Component
// =============================================================================

export const ServiceNumber = memo(function ServiceNumber({
    number,
    direction = 0,
    skipAnimation = false,
    className = '',
}: ServiceNumberProps) {
    if (skipAnimation) {
        return (
            <span
                className={`
          block
          font-mono font-extralight
          text-white/20
          select-none
          ${className}
        `}
                style={{
                    fontSize: 'var(--service-number-size, clamp(4rem, 15vw, 10rem))',
                    lineHeight: 1,
                    letterSpacing: '0.1em',
                }}
                aria-hidden="true"
            >
                {number}
            </span>
        );
    }

    return (
        <motion.span
            className={`
        block
        font-mono font-extralight
        text-white/20
        select-none
        ${className}
      `}
            style={{
                fontSize: 'var(--service-number-size, clamp(4rem, 15vw, 10rem))',
                lineHeight: 1,
                letterSpacing: '0.1em',
            }}
            aria-hidden="true"
            variants={numberVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={transition}
        >
            {number}
        </motion.span>
    );
});

ServiceNumber.displayName = 'ServiceNumber';
