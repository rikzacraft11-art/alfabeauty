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
        <div ref={containerRef} className="relative min-h-[125vh] bg-background">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                
                {/* ─── Layer 1: Morphing Video into Luxury Landscape Salon Mirror (100% Edge-to-Edge) ─── */}
                <motion.div
                    style={{
                        scale: videoScale,
                        borderRadius: videoBorderRadius,
                    }}
                    className="relative z-10 w-full h-full overflow-hidden will-change-transform shadow-[0_20px_60px_rgba(0,0,0,0.20)]"
                >
                    {/* Background Video */}
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

                    {/* Gradient Overlay for Text Readability at State 1 */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                    </div>

                    {/* ─── Professional Luxury Salon Mirror Frame ─── */}
                    <motion.div
                        style={{ opacity: mirrorFrameOpacity }}
                        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] border-[4px] border-[#D4AF37]/90 shadow-[inset_0_0_24px_rgba(255,240,200,0.5),inset_0_1px_3px_rgba(255,255,255,0.8),0_0_40px_rgba(212,175,55,0.45),0_25px_60px_rgba(0,0,0,0.25)]"
                    >
                        {/* Subtle Optical Mirror Bevel Reflection */}
                        <div className="absolute inset-0 rounded-[inherit] border border-white/40 pointer-events-none" />
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
                                <p className="eyebrow text-white/50">
                                    Established since {ESTABLISHED_YEAR}
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
                                <p className="mt-4 sm:mt-8 max-w-xl body-prose text-white/70">
                                    Exclusive importer and distributor of leading Italian
                                    and Spanish professional haircare brands, serving
                                    Indonesia&apos;s salon and barber industry for over
                                    18 years.
                                </p>
                            </FadeIn>

                            {/* Exactly Two Buttons */}
                            <div className="mt-6 sm:mt-10 flex flex-col gap-4 sm:flex-row">
                                <FadeIn delay={HERO_TIMING.cta} direction="up" blur>
                                    <AnimatedButton
                                        href={NAV_LINKS.brands}
                                        fillClass="bg-white"
                                        fillTextClass="text-brand-crimson"
                                        className="bg-brand-crimson text-white"
                                    >
                                        Explore Our Brands
                                        <ArrowRight className="h-4 w-4" />
                                    </AnimatedButton>
                                </FadeIn>

                                <FadeIn delay={HERO_TIMING.cta + 0.12} direction="up" blur>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="border-white/20 bg-transparent px-8 py-6 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/10"
                                    >
                                        <Link href={NAV_LINKS.partnership}>Partner With Us</Link>
                                    </Button>
                                </FadeIn>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
