"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextReveal } from "@/shared/components/motion/text-reveal";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { NAV_LINKS } from "@/shared/lib/config";
import { getHeroTiming } from "@/shared/lib/motion";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
 * HeroSection (Dynamic Full-Bleed Video Canvas + Centered Salon Morph)
 * Copywriting & buttons remain steadfastly in place without fading.
 * Minimalist "Scroll to explore" guide provides subtle user guidance.
 * ───────────────────────────────────────────────────────────────────── */
export function HeroSection(): React.JSX.Element {
    const { dict } = useLanguage();
    const HERO_TIMING = getHeroTiming();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Extended, stable scroll track (175vh) for smooth docked viewing
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // 1. Video morphs smoothly into a perfectly centered salon screen
    const videoScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.78], { clamp: true });
    const videoY = useTransform(scrollYProgress, [0, 0.35], [0, 36], { clamp: true });
    const videoBorderRadius = useTransform(scrollYProgress, [0, 0.35], [0, 24], { clamp: true });
    
    // Backlight glow fades in smoothly as video scales down away from edges
    const mirrorFrameOpacity = useTransform(scrollYProgress, [0.10, 0.35], [0, 1], { clamp: true });

    // 2. Minimalist Scroll Prompt Indicator (Guides user at scroll 0, dissolves upon initial movement)
    const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0], { clamp: true });
    const scrollPromptY = useTransform(scrollYProgress, [0, 0.06], [0, 16], { clamp: true });

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

                        {/* Neutral Clean Gradient for Crisp Text Readability Across All Video Frames */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
                        </div>
                    </div>

                    {/* ─── Copywriting & Action Buttons (Permanently Preserved & Crisp) ─── */}
                    <div className="relative z-10 h-full flex items-center mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12">
                        <div className="max-w-3xl pt-[var(--header-height,80px)]">
                            <FadeIn delay={HERO_TIMING.eyebrow} blur scale>
                                <p className="eyebrow text-white/70 font-semibold tracking-[0.25em]">
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
                    </div>
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
