"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TextReveal } from "@/shared/components/motion/text-reveal";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { NAV_LINKS } from "@/shared/lib/config";
import { getHeroTiming } from "@/shared/lib/motion";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { cn } from "@/shared/lib/utils";
import { motion, useScroll, useTransform, AnimatePresence, type Transition } from "framer-motion";

interface HeroSlideItem {
    id: string;
    type: "video" | "image";
    videoSrc?: string;
    posterSrc?: string;
    imageSrc?: string;
    badge: string;
}

const HERO_SLIDES: HeroSlideItem[] = [
    {
        id: "salon-studio",
        type: "video",
        videoSrc: "/videos/hero-bg.mp4",
        posterSrc: "/videos/hero-poster.jpg",
        badge: "ALFA BEAUTY STUDIO",
    },
    {
        id: "italian-colour",
        type: "image",
        imageSrc: "/images/solutions/colouring.jpg",
        badge: "ITALIAN COLOUR ART",
    },
    {
        id: "barber-texture",
        type: "image",
        imageSrc: "/images/solutions/barber.jpg",
        badge: "BARBER & TEXTURE MASTERCLASS",
    },
];

interface PersistentHeroVideoProps {
    src?: string;
    poster?: string;
    className?: string;
    sharedTimeRef: React.RefObject<number>;
    isIntersectingRef: React.RefObject<boolean>;
}

function PersistentHeroVideo({
    src,
    poster,
    className,
    sharedTimeRef,
    isIntersectingRef,
}: PersistentHeroVideoProps): React.JSX.Element {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const restoreTimeAndPlay = () => {
            if (sharedTimeRef.current > 0 && Math.abs(video.currentTime - sharedTimeRef.current) > 0.3) {
                try {
                    video.currentTime = sharedTimeRef.current;
                } catch {
                    // Ignore seek errors if video is not ready
                }
            }
            if (isIntersectingRef.current) {
                video.play().catch(() => {});
            }
        };

        const handleTimeUpdate = () => {
            if (video.currentTime > 0) {
                sharedTimeRef.current = video.currentTime;
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", restoreTimeAndPlay);

        if (video.readyState >= 1) {
            restoreTimeAndPlay();
        } else if (isIntersectingRef.current) {
            video.play().catch(() => {});
        }

        return () => {
            if (video) {
                if (video.currentTime > 0) {
                    sharedTimeRef.current = video.currentTime;
                }
                video.removeEventListener("timeupdate", handleTimeUpdate);
                video.removeEventListener("loadedmetadata", restoreTimeAndPlay);
            }
        };
    }, [sharedTimeRef, isIntersectingRef]);

    return (
        <video
            ref={videoRef}
            src={src}
            poster={poster}
            className={className}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
        />
    );
}

/* ─────────────────────────────────────────────────────────────────────
 * HeroSection (Dynamic Full-Bleed 3-Panel Panoramic Carousel Showcase)
 * Center frame hosts persistent copywriting & CTAs.
 * Side frames glide in from left & right upon scroll into an infinite loop.
 * ───────────────────────────────────────────────────────────────────── */
export function HeroSection(): React.JSX.Element {
    const { dict } = useLanguage();
    const HERO_TIMING = getHeroTiming();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const videoTimeRef = React.useRef<number>(0);
    const isIntersectingRef = React.useRef<boolean>(true);

    // Extended, stable scroll track (175vh) for smooth docked viewing
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // 1. Center frame morphs from full-bleed (1.0) to docked salon screen (0.78)
    const videoScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.78], { clamp: true });
    const videoY = useTransform(scrollYProgress, [0, 0.35], [0, 36], { clamp: true });
    const videoBorderRadius = useTransform(scrollYProgress, [0, 0.35], [0, 24], { clamp: true });
    const mirrorFrameOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1], { clamp: true });

    // 2. Side cards glide in from offscreen into adjacent panoramic positions
    const leftCardX = useTransform(scrollYProgress, [0, 0.35], ["-105%", "-81%"], { clamp: true });
    const rightCardX = useTransform(scrollYProgress, [0, 0.35], ["105%", "81%"], { clamp: true });

    // 3. Navigation controls appear gracefully only at docked stage
    const navButtonsOpacity = useTransform(scrollYProgress, (v) => {
        if (v <= 0.12) return 0;
        if (v >= 0.28) return 1;
        return (v - 0.12) / (0.28 - 0.12);
    });
    const navButtonsScale = useTransform(scrollYProgress, (v) => {
        if (v <= 0.12) return 0.85;
        if (v >= 0.28) return 1;
        return 0.85 + 0.15 * ((v - 0.12) / (0.28 - 0.12));
    });
    const navButtonsPointerEvents = useTransform(scrollYProgress, (v) => v > 0.15 ? "auto" : "none");

    // 4. Minimalist Scroll Prompt Indicator (Guides user at scroll 0, dissolves upon initial movement)
    const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0], { clamp: true });
    const scrollPromptY = useTransform(scrollYProgress, [0, 0.06], [0, 16], { clamp: true });

    // Infinite loop carousel state with directional momentum (+1: Next, -1: Prev)
    const [[page, direction], setPage] = React.useState<[number, number]>([0, 0]);

    const activeIndex = (page % HERO_SLIDES.length + HERO_SLIDES.length) % HERO_SLIDES.length;
    const leftIndex = (activeIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    const rightIndex = (activeIndex + 1) % HERO_SLIDES.length;

    const currentSlide = HERO_SLIDES[activeIndex];
    const leftSlide = HERO_SLIDES[leftIndex];
    const rightSlide = HERO_SLIDES[rightIndex];

    const handleNext = React.useCallback(() => {
        setPage(([prev]) => [prev + 1, 1]);
    }, []);

    const handlePrev = React.useCallback(() => {
        setPage(([prev]) => [prev - 1, -1]);
    }, []);

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? "100%" : dir < 0 ? "-100%" : "0%",
            opacity: 1,
        }),
        center: {
            x: "0%",
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? "-100%" : dir < 0 ? "100%" : "0%",
            opacity: 1,
        }),
    };

    const slideTransition: Transition = {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
    };

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersectingRef.current = entry.isIntersecting;
            },
            { threshold: 0.05 }
        );
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={containerRef}
            id="hero"
            className="section section-hero relative z-10 w-full min-h-[175vh] bg-transparent"
        >
            {/* Sticky Viewport Container — Full-Bleed Edge-to-Edge at Scroll 0 */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black p-0">
                
                {/* ─── 3-Panel Panoramic Track Container ─── */}
                <div className="relative w-full h-full flex items-center justify-center">

                    {/* ◀ Left Preview Frame (Synchronized Smooth Slide with Fade & Scrim) */}
                    <motion.div
                        style={{
                            scale: videoScale,
                            y: videoY,
                            x: leftCardX,
                            borderRadius: videoBorderRadius,
                        }}
                        onClick={handlePrev}
                        className="group absolute inset-0 z-0 w-full h-full will-change-transform bg-black origin-center cursor-pointer overflow-hidden hidden md:block"
                        aria-label="Previous Showcase Frame"
                    >
                        <div className="relative h-full w-full overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={leftSlide.id + "-left-" + page}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={slideTransition}
                                    className="absolute inset-0 h-full w-full will-change-transform"
                                >
                                    {leftSlide.type === "video" ? (
                                        <PersistentHeroVideo
                                            src={leftSlide.videoSrc}
                                            poster={leftSlide.posterSrc}
                                            className="h-full w-full object-cover"
                                            sharedTimeRef={videoTimeRef}
                                            isIntersectingRef={isIntersectingRef}
                                        />
                                    ) : (
                                        <Image
                                            src={leftSlide.imageSrc || ""}
                                            alt={leftSlide.badge}
                                            fill
                                            sizes="100vw"
                                            className="object-cover"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Multi-Layer Scrim & Atmospheric Gradient Fade for Left Frame */}
                            <div className="pointer-events-none absolute inset-0 z-10 bg-black/60 transition-colors duration-300 group-hover:bg-black/35" />
                            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/40 to-black/60" />
                        </div>
                    </motion.div>

                    {/* ─── Center Active Hero Frame with Persistent Copywriting & Smooth Slide ─── */}
                    <motion.div
                        style={{
                            scale: videoScale,
                            y: videoY,
                            borderRadius: videoBorderRadius,
                        }}
                        onPanEnd={(_, info) => {
                            if (info.offset.x < -35) {
                                handleNext();
                            } else if (info.offset.x > 35) {
                                handlePrev();
                            }
                        }}
                        className="relative z-10 w-full h-full will-change-transform bg-black origin-center overflow-hidden touch-pan-y"
                    >
                        {/* Media Stage (Video or High-Res Solution Visual with Smooth Directional Slide) */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentSlide.id + "-center-" + page}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={slideTransition}
                                    className="absolute inset-0 h-full w-full pointer-events-none will-change-transform"
                                >
                                    {currentSlide.type === "video" ? (
                                        <PersistentHeroVideo
                                            src={currentSlide.videoSrc}
                                            poster={currentSlide.posterSrc}
                                            className="absolute inset-0 h-full w-full object-cover"
                                            sharedTimeRef={videoTimeRef}
                                            isIntersectingRef={isIntersectingRef}
                                        />
                                    ) : (
                                        <Image
                                            src={currentSlide.imageSrc || ""}
                                            alt={currentSlide.badge}
                                            fill
                                            priority
                                            sizes="100vw"
                                            className="object-cover"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Neutral Clean Gradient for Crisp Text Readability Across All Video Frames */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
                            </div>
                        </div>

                        {/* ─── Copywriting & Action Buttons (Permanently Preserved & Crisp) ─── */}
                        <div className="relative z-10 h-full flex items-center mx-auto w-full max-w-[1720px] px-6 sm:px-10 lg:px-16 xl:px-20">
                            <div className="max-w-3xl pt-[calc(var(--header-height,60px)+12px)] sm:pt-[var(--header-height,80px)]">
                                <FadeIn delay={HERO_TIMING.eyebrow} blur scale>
                                    <p className="eyebrow text-white/70 font-semibold tracking-[0.25em]">
                                        {dict.hero.eyebrow}
                                    </p>
                                </FadeIn>

                                <div className="mt-4 sm:mt-5">
                                    <TextReveal
                                        as="h1"
                                        className="heading-display text-white text-balance"
                                        delay={HERO_TIMING.heading}
                                        rootMargin="0px"
                                        split="word"
                                        blur
                                        lines={[
                                            dict.hero.titleLine1,
                                            dict.hero.titleLine2,
                                            dict.hero.titleLine3,
                                        ]}
                                    />
                                </div>

                                <FadeIn delay={HERO_TIMING.body} blur>
                                    <p className="mt-3 sm:mt-8 max-w-xl body-prose text-white/80">
                                        {dict.hero.description}
                                    </p>
                                </FadeIn>

                                {/* Minimalist Professional Button & Underline Pair */}
                                <div className="mt-6 sm:mt-10 flex flex-col gap-4 sm:gap-5 sm:flex-row items-start sm:items-center">
                                    <FadeIn delay={HERO_TIMING.cta} direction="up" blur>
                                        <Link
                                            href={NAV_LINKS.brands}
                                            className="inline-flex items-center justify-center gap-2 rounded-none bg-brand-crimson px-7 sm:px-8 py-3 sm:py-3.5 text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#5D221C]"
                                        >
                                            <span>{dict.hero.exploreBrands}</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </FadeIn>

                                    <FadeIn delay={HERO_TIMING.cta + 0.12} direction="up" blur>
                                        <Link
                                            href={NAV_LINKS.partnership}
                                            className="group inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-medium uppercase tracking-[0.14em] text-white border-b border-white/80 pb-1 transition-all duration-200 hover:border-[#EABD68] hover:text-[#EABD68]"
                                        >
                                            <span>{dict.hero.partnerWithUs}</span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                        </Link>
                                    </FadeIn>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ▶ Right Preview Frame (Synchronized Smooth Slide with Fade & Scrim) */}
                    <motion.div
                        style={{
                            scale: videoScale,
                            y: videoY,
                            x: rightCardX,
                            borderRadius: videoBorderRadius,
                        }}
                        onClick={handleNext}
                        className="group absolute inset-0 z-0 w-full h-full will-change-transform bg-black origin-center cursor-pointer overflow-hidden hidden md:block"
                        aria-label="Next Showcase Frame"
                    >
                        <div className="relative h-full w-full overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={rightSlide.id + "-right-" + page}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={slideTransition}
                                    className="absolute inset-0 h-full w-full will-change-transform"
                                >
                                    {rightSlide.type === "video" ? (
                                        <PersistentHeroVideo
                                            src={rightSlide.videoSrc}
                                            poster={rightSlide.posterSrc}
                                            className="h-full w-full object-cover"
                                            sharedTimeRef={videoTimeRef}
                                            isIntersectingRef={isIntersectingRef}
                                        />
                                    ) : (
                                        <Image
                                            src={rightSlide.imageSrc || ""}
                                            alt={rightSlide.badge}
                                            fill
                                            sizes="100vw"
                                            className="object-cover"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Multi-Layer Scrim & Atmospheric Gradient Fade for Right Frame */}
                            <div className="pointer-events-none absolute inset-0 z-10 bg-black/60 transition-colors duration-300 group-hover:bg-black/35" />
                            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-l from-black/90 via-black/40 to-black/60" />
                        </div>
                    </motion.div>
                </div>

                {/* ─── Viewport Atmospheric Edge Fades (Smoothly dissolves side cards into screen margins during docked scroll) ─── */}
                <motion.div
                    style={{ opacity: mirrorFrameOpacity }}
                    className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden md:block w-28 sm:w-44 lg:w-72 bg-gradient-to-r from-black via-black/85 to-transparent"
                    aria-hidden="true"
                />
                <motion.div
                    style={{ opacity: mirrorFrameOpacity }}
                    className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden md:block w-28 sm:w-44 lg:w-72 bg-gradient-to-l from-black via-black/85 to-transparent"
                    aria-hidden="true"
                />

                {/* ─── Infinite Carousel Nav Arrows (Minimalist Hairline Glass - Docked Only, Desktop & Tablet) ─── */}
                <motion.button
                    style={{
                        opacity: navButtonsOpacity,
                        scale: navButtonsScale,
                        pointerEvents: navButtonsPointerEvents,
                    }}
                    onClick={handlePrev}
                    aria-label="Previous Slide"
                    className="group absolute left-4 sm:left-8 lg:left-12 z-30 hidden md:flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 hover:border-brand-crimson hover:bg-brand-crimson hover:text-white hover:shadow-[0_0_20px_rgba(186,24,27,0.4)]"
                >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                </motion.button>

                <motion.button
                    style={{
                        opacity: navButtonsOpacity,
                        scale: navButtonsScale,
                        pointerEvents: navButtonsPointerEvents,
                    }}
                    onClick={handleNext}
                    aria-label="Next Slide"
                    className="group absolute right-4 sm:right-8 lg:right-12 z-30 hidden md:flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 hover:border-brand-crimson hover:bg-brand-crimson hover:text-white hover:shadow-[0_0_20px_rgba(186,24,27,0.4)]"
                >
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </motion.button>

                {/* ─── Mobile Interactive Pagination Dots (Docked Only) ─── */}
                <motion.div
                    style={{
                        opacity: navButtonsOpacity,
                        pointerEvents: navButtonsPointerEvents,
                    }}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex md:hidden items-center gap-2"
                    aria-label="Carousel Pagination"
                >
                    {HERO_SLIDES.map((slide, idx) => (
                        <button
                            key={slide.id}
                            onClick={() => setPage(() => [idx, idx > activeIndex ? 1 : -1])}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                idx === activeIndex
                                    ? "w-7 bg-brand-crimson"
                                    : "w-2 bg-white/40 hover:bg-white/70"
                            )}
                        />
                    ))}
                </motion.div>

                {/* ─── Minimalist Scroll Guide Indicator at Scroll 0 (Bottom Right) ─── */}
                <motion.div
                    style={{
                        opacity: scrollPromptOpacity,
                        y: scrollPromptY,
                    }}
                    className="pointer-events-none absolute bottom-8 sm:bottom-10 right-6 sm:right-12 z-30 flex items-center gap-3"
                    aria-hidden="true"
                >
                    <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-white/60">
                        {dict.hero.scrollPrompt || "SCROLL TO EXPLORE"}
                    </span>
                    <div className="relative h-9 w-5 rounded-full border border-white/30 flex justify-center p-1">
                        <motion.div
                            animate={{
                                y: [0, 10, 0],
                                opacity: [0.8, 0.2, 0.8],
                            }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="h-2 w-1 rounded-full bg-[#EABD68]"
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
