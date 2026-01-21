/**
 * ServicesExperience - Organism Component
 * 
 * @module components/organisms/ServicesExperience
 * @description Main section component for the Immersive Services Experience.
 * Orchestrates all molecules and manages global state including:
 * - Active service state
 * - Keyboard navigation
 * - Touch gestures
 * - Reduced motion preference
 * - Auto-advance timer with progress
 * - Initial entrance animation
 * 
 * @example
 * <ServicesExperience />
 */

'use client';

import {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import type { NavigationDirection, Locale } from '@/types/services.types';
import { services, getServicesExperienceContent } from '@/content/services';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { VideoBackground } from './VideoBackground';
import { ServiceContent } from './ServiceContent';
import { ServiceNav } from './ServiceNav';
import { ProgressBar } from '@/components/ui/ProgressBar';

// =============================================================================
// Types
// =============================================================================

export interface ServicesExperienceProps {
    /** Initial service index */
    readonly initialIndex?: number;
    /** Enable auto-advance between services */
    readonly autoAdvance?: boolean;
    /** Auto-advance interval in milliseconds */
    readonly autoAdvanceInterval?: number;
}

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_AUTO_ADVANCE_INTERVAL = 8000; // 8 seconds

// =============================================================================
// Custom Hooks
// =============================================================================

/**
 * Hook to detect reduced motion preference
 */
function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
}

/**
 * Hook for swipe gesture detection
 */
function useSwipeGesture(
    onSwipeLeft: () => void,
    onSwipeRight: () => void
) {
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    }, []);

    const onTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStart === null) return;

        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        const threshold = 50;

        if (diff > threshold) {
            onSwipeLeft();
        } else if (diff < -threshold) {
            onSwipeRight();
        }

        setTouchStart(null);
    }, [touchStart, onSwipeLeft, onSwipeRight]);

    return { onTouchStart, onTouchEnd };
}

/**
 * Hook for auto-advance timer with progress
 */
function useAutoAdvance(
    enabled: boolean,
    interval: number,
    onAdvance: () => void,
    isPaused: boolean
) {
    const [progress, setProgress] = useState(0);
    const startTimeRef = useRef<number>(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!enabled || isPaused) {
            setProgress(0);
            return;
        }

        startTimeRef.current = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min(elapsed / interval, 1);
            setProgress(newProgress);

            if (newProgress >= 1) {
                onAdvance();
                startTimeRef.current = Date.now();
                setProgress(0);
            }

            rafRef.current = requestAnimationFrame(updateProgress);
        };

        rafRef.current = requestAnimationFrame(updateProgress);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [enabled, interval, onAdvance, isPaused]);

    // Reset progress when paused
    useEffect(() => {
        if (isPaused) {
            setProgress(0);
        }
    }, [isPaused]);

    return progress;
}

/**
 * Hook to detect if element is in viewport
 */
function useInView(ref: React.RefObject<HTMLElement | null>): boolean {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [ref]);

    return isInView;
}

// =============================================================================
// Component
// =============================================================================

export function ServicesExperience({
    initialIndex = 0,
    autoAdvance = true,
    autoAdvanceInterval = DEFAULT_AUTO_ADVANCE_INTERVAL,
}: ServicesExperienceProps) {
    // Refs
    const sectionRef = useRef<HTMLElement>(null);

    // Locale
    const { locale } = useLocale();
    const typedLocale = locale as Locale;
    const content = useMemo(() => getServicesExperienceContent(typedLocale), [typedLocale]);

    // State
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [direction, setDirection] = useState<NavigationDirection>(0);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [hasEnteredView, setHasEnteredView] = useState(false);

    // Derived state
    const activeService = services[activeIndex];
    const isReducedMotion = useReducedMotion();
    const isInView = useInView(sectionRef);

    // Mark as entered when first in view
    useEffect(() => {
        if (isInView && !hasEnteredView) {
            setHasEnteredView(true);
        }
    }, [isInView, hasEnteredView]);

    // ==========================================================================
    // Navigation Handlers
    // ==========================================================================

    const goToService = useCallback((index: number) => {
        if (index < 0 || index >= services.length || index === activeIndex) return;
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
        setIsUserInteracting(true);
        // Reset after delay
        setTimeout(() => setIsUserInteracting(false), 5000);
    }, [activeIndex]);

    const goNext = useCallback(() => {
        const nextIndex = activeIndex < services.length - 1 ? activeIndex + 1 : 0;
        setDirection(1);
        setActiveIndex(nextIndex);
    }, [activeIndex]);

    const goPrev = useCallback(() => {
        if (activeIndex > 0) {
            goToService(activeIndex - 1);
        }
    }, [activeIndex, goToService]);

    const handleManualNext = useCallback(() => {
        if (activeIndex < services.length - 1) {
            goToService(activeIndex + 1);
        }
    }, [activeIndex, goToService]);

    // ==========================================================================
    // Auto-Advance
    // ==========================================================================

    const shouldAutoAdvance = autoAdvance && isInView && !isUserInteracting && !isReducedMotion;
    const progress = useAutoAdvance(
        shouldAutoAdvance,
        autoAdvanceInterval,
        goNext,
        !isInView || isUserInteracting
    );

    // ==========================================================================
    // Keyboard Navigation
    // ==========================================================================

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle when section is in focus or no active element
            if (document.activeElement &&
                document.activeElement.tagName !== 'BODY' &&
                !document.activeElement.closest('[data-services-experience]')) {
                return;
            }

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    handleManualNext();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    goPrev();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleManualNext, goPrev]);

    // ==========================================================================
    // Touch Gestures
    // ==========================================================================

    const handleSwipeLeft = useCallback(() => {
        handleManualNext();
    }, [handleManualNext]);

    const handleSwipeRight = useCallback(() => {
        goPrev();
    }, [goPrev]);

    const { onTouchStart, onTouchEnd } = useSwipeGesture(handleSwipeLeft, handleSwipeRight);

    // ==========================================================================
    // Entrance Animation Variants
    // ==========================================================================

    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
    };

    // ==========================================================================
    // Render
    // ==========================================================================

    return (
        <motion.section
            ref={sectionRef}
            data-services-experience
            className="relative h-screen w-full overflow-hidden bg-foreground"
            aria-label={content.ariaLabel}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            variants={isReducedMotion ? undefined : sectionVariants}
            initial={isReducedMotion ? undefined : "hidden"}
            animate={hasEnteredView && !isReducedMotion ? "visible" : undefined}
        >
            {/* Video Background Layer */}
            <AnimatePresence mode="wait" initial={false}>
                <VideoBackground
                    key={activeService.id}
                    service={activeService}
                    isReducedMotion={isReducedMotion}
                />
            </AnimatePresence>

            {/* Content Layer */}
            <AnimatePresence mode="wait" initial={false}>
                <ServiceContent
                    key={activeService.id}
                    service={activeService}
                    locale={typedLocale}
                    direction={direction}
                    isReducedMotion={isReducedMotion}
                />
            </AnimatePresence>

            {/* Navigation Layer */}
            <ServiceNav
                services={services}
                activeIndex={activeIndex}
                locale={typedLocale}
                onNavigate={goToService}
                onPrev={goPrev}
                onNext={handleManualNext}
            />

            {/* Auto-Advance Progress Bar */}
            {shouldAutoAdvance && (
                <div className="absolute bottom-0 left-0 right-0 z-40">
                    <ProgressBar
                        value={progress}
                        height={2}
                        ariaLabel="Auto-advance progress"
                    />
                </div>
            )}

            {/* Keyboard Hint (desktop only) */}
            {!isReducedMotion && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 hidden lg:block">
                    <p className="type-data text-white/30">
                        {content.keyboardHint}
                    </p>
                </div>
            )}
        </motion.section>
    );
}

ServicesExperience.displayName = 'ServicesExperience';

