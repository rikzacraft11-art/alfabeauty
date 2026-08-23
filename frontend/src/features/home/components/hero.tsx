"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { AnimatedButton } from "@/shared/components/ui/animated-button";
import { TextReveal } from "@/shared/components/motion/text-reveal";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { ESTABLISHED_YEAR, NAV_LINKS, BRAND_COLORS } from "@/shared/lib/config";
import { getHeroTiming } from "@/shared/lib/motion";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
 * HeroSection (Dynamic Full-Bleed Video Canvas + Centered Salon Morph)
 * Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function HeroSection(): React.JSX.Element {
    const { dict } = useLanguage();
    const HERO_TIMING = getHeroTiming();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Extended, stable scroll track (175vh) for ample comfortable viewing of the docked state
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // 1. Video morphs smoothly into a perfectly centered salon screen
    // videoY shifts down by 36px when scaled down to balance the 80px fixed header at the top
    const videoScale = useTransform(scrollYProgress, [0, 0.42], [1, 0.76], { clamp: true });
    const videoY = useTransform(scrollYProgress, [0, 0.42], [0, 36], { clamp: true });
    const videoBorderRadius = useTransform(scrollYProgress, [0, 0.42], [0, 24], { clamp: true });
    
    // Backlight glow fades in smoothly as video scales down away from edges
    const mirrorFrameOpacity = useTransform(scrollYProgress, [0.12, 0.40], [0, 1], { clamp: true });

    // 2. Initial State 1 Copywriting Overlay & Gradient (Fades out smoothly within initial scroll)
    const state1OverlayOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0], { clamp: true });
    const state1OverlayY = useTransform(scrollYProgress, [0, 0.12], [0, -40], { clamp: true });
    const state1Display = useTransform(scrollYProgress, (v) => v > 0.08 ? "none" : "flex");
    const state1PointerEvents = useTransform(scrollYProgress, (v) => v > 0.04 ? "none" : "auto");
    const gradientOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0], { clamp: true });

    React.useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!video.src) {
                        video.src = "/videos/hero-bg.mp4";
                        video.load();
                    }
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
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
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-visible bg-transparent p-0">
                
                {/* ─── Hero Video Container with Fullbleed Edge-to-Edge State 1 & Centered Morph ─── */}
                <motion.div
                    style={{
                        scale: videoScale,
                        y: videoY,
                        borderRadius: videoBorderRadius,
                    }}
                    className="relative z-10 w-full h-full will-change-transform bg-black origin-center gpu-layer"
                >
                    {/* 1. Luminous Golden Backlight Shadow (Fades in smoothly as video scales inward) */}
                    <motion.div
                        style={{ opacity: mirrorFrameOpacity }}
                        className="pointer-events-none absolute -inset-3 sm:-inset-6 lg:-inset-10 rounded-[inherit] bg-[#EABD68]/30 blur-2xl sm:blur-3xl -z-10 gpu-layer"
                        aria-hidden="true"
                    />

                    {/* 2. Video Screen Wrapper (Clean Frameless Video with Subtle Soft Border Glow) */}
                    <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
                        {/* Background Video (Natural, Crisp Color) */}
                        <div className="pointer-events-none absolute inset-0 z-0">
                            <video
                                ref={videoRef}
                                className="absolute inset-0 h-full w-full object-cover"
                                muted
                                loop
                                playsInline
                                preload="none"
                                poster="/videos/hero-poster.jpg"
                                disablePictureInPicture
                                disableRemotePlayback
                                aria-hidden="true"
                            />
                        </div>

                        {/* Neutral Clean Gradient for Crisp Text Readability at Scroll 0 (Fades out cleanly on scroll) */}
                        <motion.div 
                            style={{ opacity: gradientOpacity }}
                            className="absolute inset-0 pointer-events-none z-0"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                        </motion.div>
                    </div>

                    {/* ─── Preserved State 1 Content (Fades out completely and sets display: none on scroll) ─── */}
                    <motion.div
                        style={{
                            opacity: state1OverlayOpacity,
                            y: state1OverlayY,
                            display: state1Display,
                            pointerEvents: state1PointerEvents,
                        }}
                        className="relative z-10 h-full items-center mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12"
                    >
                        <div className="max-w-3xl pt-[var(--header-height,80px)]">
                            <FadeIn delay={HERO_TIMING.eyebrow} blur scale>
                                <p className="eyebrow text-white/60 font-semibold tracking-[0.25em]">
                                    {dict.hero.eyebrow}
                                </p>
                            </FadeIn>

                            <div className="mt-5">
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
                                <p className="mt-4 sm:mt-8 max-w-xl body-prose text-white/80">
                                    {dict.hero.description}
                                </p>
                            </FadeIn>

                            {/* Minimalist Professional Button & Underline Pair */}
                            <div className="mt-6 sm:mt-10 flex flex-col gap-5 sm:flex-row items-start sm:items-center">
                                <FadeIn delay={HERO_TIMING.cta} direction="up" blur>
                                    <Link
                                        href={NAV_LINKS.brands}
                                        className="inline-flex items-center justify-center gap-2 rounded-none bg-brand-crimson px-8 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#5D221C]"
                                    >
                                        <span>{dict.hero.exploreBrands}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </FadeIn>

                                <FadeIn delay={HERO_TIMING.cta + 0.12} direction="up" blur>
                                    <Link
                                        href={NAV_LINKS.partnership}
                                        className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-white border-b border-white/80 pb-1 transition-all duration-200 hover:border-[#EABD68] hover:text-[#EABD68]"
                                    >
                                        <span>{dict.hero.partnerWithUs}</span>
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                </FadeIn>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
