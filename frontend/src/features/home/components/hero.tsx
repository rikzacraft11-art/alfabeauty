"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { AnimatedButton } from "@/shared/components/ui/animated-button";
import { TextReveal } from "@/shared/components/motion/text-reveal";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { NAV_LINKS, ESTABLISHED_YEAR } from "@/shared/lib/config";
import { getHeroTiming } from "@/shared/lib/motion";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
 * HeroSection — Minimalist Luxury Salon Vanity Mirror Scroll Transition
 *
 * 1. State 1 (Top / Scroll 0): Full-bleed cinematic video with exact
 *    original copy & 2 buttons.
 * 2. Scroll Morph: Video shrinks smoothly into a luxury landscape salon
 *    mirror (16:9) with champagne gold metallic bevel & warm LED halo.
 * 3. Text & buttons fade out cleanly on scroll.
 * 4. Zero clutter (no furniture, no flanking side text, no loop marquee).
 * 5. Flows directly into the Shop CTA & Solutions Showcase sections.
 * ───────────────────────────────────────────────────────────────────── */
export function HeroSection(): React.JSX.Element {
    const HERO_TIMING = getHeroTiming();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Streamlined scroll range (125vh) for crisp, responsive morphing without dead space
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // 1. Video morphs smoothly into a centered landscape salon mirror
    const videoScale = useTransform(scrollYProgress, (v) => 1 - Math.min(0.28, v * 0.56));
    const videoBorderRadius = useTransform(scrollYProgress, (v) => Math.min(20, v * 40));
    const mirrorFrameOpacity = useTransform(scrollYProgress, (v) => v < 0.08 ? 0 : Math.min(1, (v - 0.08) / 0.25));

    // 2. Initial State 1 Overlay (Fades out cleanly during initial scroll)
    const state1OverlayOpacity = useTransform(scrollYProgress, (v) => v < 0.25 ? 1 - (v / 0.25) : 0);
    const state1OverlayY = useTransform(scrollYProgress, (v) => -Math.min(40, v * 160));

    React.useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.src = "/videos/hero-bg.mp4";
                    video.load();
                    video.play().catch(() => {});
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative z-10 w-full min-h-[125vh] bg-black bg-dark-grain"
        >
            {/* Sticky Viewport Container */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                
                {/* ─── Hero Video & Dynamic Salon Mirror Container ─── */}
                <motion.div
                    style={{
                        scale: videoScale,
                        borderRadius: videoBorderRadius,
                    }}
                    className="relative z-10 w-full h-full overflow-hidden will-change-transform bg-black"
                >
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

                    {/* Neutral Clean Gradient for Crisp Text Readability at Scroll 0 */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                    </div>

                    {/* ─── 1:1 Authentic Luxury Salon Warm Yellow LED Illuminated Mirror Frame ─── */}
                    <motion.div
                        style={{ opacity: mirrorFrameOpacity }}
                        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] overflow-hidden"
                    >
                        {/* 1. Outer Glass Polished Warm Bevel Edge */}
                        <div className="absolute inset-0 rounded-[inherit] border-[2.5px] border-[#FBE6A2]/90 shadow-[inset_0_0_10px_rgba(251,230,162,0.5),0_0_22px_rgba(255,215,90,0.45)] pointer-events-none" />

                        {/* 2. Outer Glass Margin (Clear Polished Gap) */}
                        <div className="absolute inset-[10px] sm:inset-[16px] lg:inset-[22px] rounded-[24px] pointer-events-none">
                            {/* 3. The Iconic Salon Warm Yellow LED Illuminated Glowing Light Strip */}
                            <div className="absolute inset-0 rounded-[24px] border-[10px] sm:border-[14px] lg:border-[18px] border-[#FFE28A] shadow-[0_0_35px_rgba(255,215,90,0.95),0_0_75px_rgba(255,185,50,0.7),inset_0_0_22px_rgba(255,235,150,0.9)]" />
                            
                            {/* Inner Crisp Hairline Border along LED Edge */}
                            <div className="absolute inset-[10px] sm:inset-[14px] lg:inset-[18px] rounded-[16px] border border-[#FFE8A3]/70 pointer-events-none" />
                        </div>

                        {/* 4. Realistic Diagonal Glass Specular Warm Gold Light Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FFE699]/[0.09] to-transparent pointer-events-none" />
                    </motion.div>

                    {/* ─── Preserved State 1 Content (Exact Copy & 2 Buttons at Scroll 0) ─── */}
                    <motion.div
                        style={{
                            opacity: state1OverlayOpacity,
                            y: state1OverlayY,
                        }}
                        className="relative z-10 flex h-full items-center mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12"
                    >
                        <div className="max-w-3xl pt-[var(--header-height,80px)]">
                            <FadeIn delay={HERO_TIMING.eyebrow} blur scale>
                                <p className="eyebrow text-white/60 font-semibold tracking-[0.25em]">
                                    ESTABLISHED SINCE {ESTABLISHED_YEAR}
                                </p>
                            </FadeIn>

                            <div className="mt-5">
                                <TextReveal
                                    as="h1"
                                    className="heading-display text-white text-balance"
                                    delay={HERO_TIMING.heading}
                                    rootMargin="0px"
                                    split="char"
                                    blur
                                    lines={[
                                        "Connecting Global",
                                        "Hair Innovation to",
                                        "Indonesia\u2019s Professionals",
                                    ]}
                                />
                            </div>

                            <FadeIn delay={HERO_TIMING.body} blur>
                                <p className="mt-4 sm:mt-8 max-w-xl body-prose text-white/80">
                                    Exclusive importer and distributor of leading Italian
                                    and Spanish professional haircare brands, serving
                                    Indonesia&apos;s salon and barber industry for over
                                    18 years.
                                </p>
                            </FadeIn>

                            {/* Calvin Klein Minimalist Button & Underline Pair */}
                            <div className="mt-6 sm:mt-10 flex flex-col gap-5 sm:flex-row items-start sm:items-center">
                                <FadeIn delay={HERO_TIMING.cta} direction="up" blur>
                                    <Link
                                        href={NAV_LINKS.brands}
                                        className="inline-flex items-center justify-center gap-2 rounded-none bg-[#D9403A] px-8 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#5D221C]"
                                    >
                                        <span>Explore Brands</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </FadeIn>

                                <FadeIn delay={HERO_TIMING.cta + 0.12} direction="up" blur>
                                    <Link
                                        href={NAV_LINKS.partnership}
                                        className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-white border-b border-white/80 pb-1 transition-all duration-200 hover:border-[#EABD68] hover:text-[#EABD68]"
                                    >
                                        <span>Partner With Us</span>
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
