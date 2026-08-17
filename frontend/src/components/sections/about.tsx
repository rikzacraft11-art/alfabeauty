"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { LineGrow, useCountUp } from "@/hooks/use-animations";
import { AnimatedButton } from "@/components/ui/animated-button";
import { SITE_NAME, YEARS_OF_EXPERIENCE, NAV_LINKS } from "@/lib/config";
import {
    cinematicEase,
    PARALLAX,
    glassBadgeReveal,
    counterStagger,
    counterFadeUp,
    dividerReveal,
} from "@/lib/motion";

/* ─────────────────────────────────────────────────────────────────────
 * AboutSection V8 — Cinematic counters & atmospheric depth.
 *
 * V8 upgrades over V7:
 *   - Counter glow pulse animation on completion (counter-glow class)
 *   - Image ambient Ken Burns subtle drift for living depth
 *   - Enhanced glassmorphism on glass badge (increased blur)
 *   - Deeper stat divider with dual-phase grow animation
 *   - Image gradient overlay enhancement with warm tinting
 * ───────────────────────────────────────────────────────────────────── */

const yearsNum = new Date().getFullYear() - 2007;

function Counter({
    target,
    suffix,
    label,
    delay = 0,
}: {
    target: number;
    suffix: string;
    label: string;
    delay?: number;
}) {
    const [completed, setCompleted] = React.useState(false);
    const { ref, display } = useCountUp({
        target,
        suffix,
        delay,
        onComplete: () => setCompleted(true),
    });
    return (
        <motion.div variants={counterFadeUp}>
            <p
                ref={ref as React.RefObject<HTMLParagraphElement>}
                className={`text-[2rem] font-bold text-brand-crimson lg:text-[2.5rem] transition-[filter,box-shadow] duration-700 ${completed ? "counter-glow drop-shadow-[0_0_12px_rgba(164,22,26,0.3)]" : ""}`}
            >
                {display}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                {label}
            </p>
        </motion.div>
    );
}

function StatDivider() {
    return (
        <motion.div
            className="hidden sm:block h-16 w-px bg-border-warm self-center"
            variants={dividerReveal}
            style={{ transformOrigin: "center" }}
        />
    );
}

export function AboutSection(): React.JSX.Element {
    return (
        <section id="about" className="bg-background py-12 sm:py-16 lg:py-32">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-16">
                    {/* Left column — Image with clipPath reveal + parallax */}
                    <div className="lg:col-span-5">
                        <FadeIn blur scale>
                            <p className="eyebrow">About Us</p>
                        </FadeIn>
                        <div className="mt-3">
                            <TextReveal
                                as="h2"
                                className="heading-section"
                                split="word"
                                blur
                                lines={[
                                    `${YEARS_OF_EXPERIENCE} Years of`,
                                    "Professional Excellence",
                                ]}
                            />
                        </div>

                        {/* Image with clipPath reveal + ambient scale */}
                        <div className="relative mt-8 hidden overflow-hidden shadow-warm-md lg:block lg:min-h-[480px]">
                            <motion.div
                                className="absolute inset-0"
                                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                                whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 1.4, ease: cinematicEase }}
                            >
                                <div className="relative h-full w-full bg-surface/50 border border-border-warm/30 flex items-center justify-center" style={{ transform: 'scale(1.04)' }}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-elevated to-background opacity-95" />
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(164,22,26,0.08)_0%,transparent_60%)]" />
                                    <div className="relative flex flex-col items-center justify-center z-10 opacity-60 text-center px-8">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-crimson mb-3">18+ Years Heritage</span>
                                        <p className="text-sm font-semibold tracking-tight text-foreground/80">Authorized National Distributor</p>
                                        <div className="h-[1px] w-12 bg-border-warm mt-4" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                </div>
                            </motion.div>

                            {/* Glass badge with enhanced blur */}
                            <motion.div
                                className="absolute bottom-6 left-6 z-10 glass-strong px-5 py-3"
                                variants={glassBadgeReveal}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                                    Since 2007
                                </p>
                            </motion.div>
                        </div>

                        {/* Mobile accent bar */}
                        <div className="mt-6 h-1 w-16 bg-brand-crimson lg:hidden" />
                    </div>

                    {/* Right column — body copy + stats */}
                    <div className="lg:col-span-7">
                        <FadeIn delay={0.2} blur>
                            <p className="body-prose">
                                {SITE_NAME} is a professional haircare distribution
                                company specializing in salon and barber products and
                                solutions. With nationwide coverage and more than{" "}
                                {YEARS_OF_EXPERIENCE.replace("+", "")} years of experience,
                                we represent globally recognized professional hair brands
                                and deliver them to the Indonesian market through a
                                structured, reliable, and long-term partnership approach.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.4} blur>
                            <p className="body-prose mt-6">
                                We bridge the gap between international innovation and
                                local market needs, powered by a technical and sales team
                                that actively educates the industry through hands-on
                                training and knowledge sharing.
                            </p>
                        </FadeIn>

                        <div className="mt-6 sm:mt-12">
                            <LineGrow className="h-px bg-border-warm" />
                        </div>

                        {/* Counters with dividers between */}
                        <motion.div
                            className="mt-6 sm:mt-12 grid grid-cols-3 gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-6"
                            variants={counterStagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <Counter target={yearsNum} suffix="+" label="Years of Experience" delay={0} />
                            <StatDivider />
                            <Counter target={4} suffix="" label="International Brands" delay={0.15} />
                            <StatDivider />
                            <Counter target={34} suffix="" label="Provinces Reached" delay={0.3} />
                        </motion.div>

                        <FadeIn delay={0.6} blur dramatic>
                            <div className="mt-10">
                                <AnimatedButton
                                    href={NAV_LINKS.about}
                                    fillClass="bg-foreground"
                                    fillTextClass="text-white"
                                    className="bg-surface-elevated text-foreground border border-border-warm"
                                >
                                    Learn More About Us
                                    <ArrowRight className="h-4 w-4" />
                                </AnimatedButton>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
