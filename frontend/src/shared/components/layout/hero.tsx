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

/* ─────────────────────────────────────────────────────────────────────
 * HeroSection V8 — Cinematic hero with enhanced depth & atmosphere.
 *
 * V9 — Cinematic hero with video background, TextReveal heading,
 *   and dual CTA buttons. Pillar cards removed for cleaner layout.
 * ───────────────────────────────────────────────────────────────────── */
export function HeroSection(): React.JSX.Element {
    const HERO_TIMING = getHeroTiming();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const sectionRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        const video = videoRef.current;
        const section = sectionRef.current;
        if (!video || !section) return;

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
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-dvh items-center overflow-hidden bg-foreground"
        >
            {/* Background video — static, no parallax tracking */}
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

            {/* Simplified gradient overlay — 2 layers instead of 5 for performance */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            </div>

            {/* Product cutout removed per user request */}

            {/* Content — orchestrated delays via HERO_TIMING */}
            <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div className="max-w-3xl pt-[var(--header-height)]">
                    <FadeIn delay={HERO_TIMING.eyebrow} blur scale>
                        <p className="eyebrow text-white/45">
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
            </div>
        </section>
    );
}
