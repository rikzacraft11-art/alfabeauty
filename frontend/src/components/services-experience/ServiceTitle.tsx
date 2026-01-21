/**
 * ServiceTitle - Atomic Title Display
 * 
 * @module components/atoms/ServiceTitle
 * @description Animated service title with:
 * - Letter spacing animation
 * - Slide-up entrance
 * - Professional typography
 * 
 * @example
 * <ServiceTitle title="Products" />
 */

'use client';

import { memo } from 'react';
import { motion, type Variants } from 'framer-motion';

// =============================================================================
// Types
// =============================================================================

export interface ServiceTitleProps {
    /** Title text */
    readonly title: string;
    /** Animation direction (-1: left, 0: none, 1: right) */
    readonly direction?: -1 | 0 | 1;
    /** Skip animation */
    readonly skipAnimation?: boolean;
    /** Animation delay in ms */
    readonly delay?: number;
    /** Additional CSS classes */
    readonly className?: string;
}

// =============================================================================
// Animation Variants
// =============================================================================

const titleVariants: Variants = {
    enter: (direction: number) => ({
        y: direction >= 0 ? 60 : -60,
        opacity: 0,
        letterSpacing: '0.3em',
    }),
    center: {
        y: 0,
        opacity: 1,
        letterSpacing: '0.15em',
    },
    exit: (direction: number) => ({
        y: direction >= 0 ? -40 : 40,
        opacity: 0,
        letterSpacing: '0.05em',
    }),
};

// =============================================================================
// Component
// =============================================================================

export const ServiceTitle = memo(function ServiceTitle({
    title,
    direction = 0,
    skipAnimation = false,
    delay = 0,
    className = '',
}: ServiceTitleProps) {
    const baseClasses = `
    block
    text-white
    uppercase
    font-light
    tracking-[0.15em]
    ${className}
  `;

    const baseStyle = {
        fontSize: 'var(--service-title-size, clamp(2.5rem, 8vw, 6rem))',
        lineHeight: 1.1,
    };

    if (skipAnimation) {
        return (
            <h2 className={baseClasses} style={baseStyle}>
                {title}
            </h2>
        );
    }

    return (
        <motion.h2
            className={baseClasses}
            style={baseStyle}
            variants={titleVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: delay / 1000,
            }}
        >
            {title}
        </motion.h2>
    );
});

ServiceTitle.displayName = 'ServiceTitle';
