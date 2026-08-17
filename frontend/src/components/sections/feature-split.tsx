"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { LineGrow } from "@/hooks/use-animations";
import { AnimatedButton } from "@/components/ui/animated-button";
import { NAV_LINKS } from "@/lib/config";
import { cinematicEase, PARALLAX, listStagger, listItemFadeIn, glassBadgeReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────
 * FeatureSplit V8 — Cinematic horizontal reveal & enhanced depth.
 *
 * V9 upgrades over V8:
 *   - GAP-SPLIT-01: Reverse layout prop for alternating direction
 *   - Support for custom image, badge text, head/body copy via props
 * ───────────────────────────────────────────────────────────────────── */

const capabilities = [
    "Connecting global innovation with local market needs",
    "Building brands through education and technical excellence",
    "Supporting sustainable growth for salons, barbershops, and professionals",
];

interface FeatureSplitProps {
    reverse?: boolean;
}

export function FeatureSplit({ reverse = false }: FeatureSplitProps): React.JSX.Element {
    return (
        <section id="education" className="relative bg-background py-0">
            <div className="absolute inset-0 bg-gradient-to-br from-surface/50 via-transparent to-surface/30 pointer-events-none" />

            <div className={cn(
                "relative mx-auto grid max-w-[1400px] grid-cols-1 gap-0 lg:grid-cols-2",
                reverse && "lg:[direction:rtl] [&>*]:lg:[direction:ltr]"
            )}>
                {/* Image side — horizontal clipPath + parallax + scale + ken-burns + grain */}
                <div className="relative hidden overflow-hidden shadow-warm-md lg:block lg:min-h-[650px]">
                    <motion.div
                        className="absolute inset-0"
                        initial={{ clipPath: reverse ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)" }}
                        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 1.5, ease: cinematicEase }}
                    >
                        <div
                            className="relative h-full w-full bg-surface/50 border border-border-warm/20 flex items-center justify-center"
                            style={{ transform: 'scale(1.08)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-surface to-background opacity-90" />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(164,22,26,0.06)_0%,transparent_60%)]" />
                            <div className="relative flex flex-col items-center justify-center z-10 opacity-30">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground mb-4">Space for Image</span>
                                <div className="h-[1px] w-16 bg-foreground" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/10 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </motion.div>

                    {/* Glass badge with enhanced blur */}
                    <motion.div
                        className="absolute bottom-8 left-8 z-10 glass-strong px-5 py-3"
                        variants={glassBadgeReveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                            Education & Training
                        </p>
                    </motion.div>
                </div>

                {/* Mobile accent bar */}
                <div className="mt-2 h-1 w-16 bg-brand-crimson lg:hidden" />

                {/* Text side — cascading reveal with blur */}
                <div className="flex items-center bg-surface p-6 sm:p-10 lg:p-16 xl:p-24">
                    <div className="w-full">
                        <FadeIn direction="right" delay={0.2} blur scale>
                            <p className="eyebrow">Our Role</p>
                        </FadeIn>

                        <div className="mt-3">
                            <TextReveal
                                as="h2"
                                className="heading-section"
                                split="word"
                                blur
                                lines={["More Than", "a Distributor"]}
                            />
                        </div>

                        <div className="mt-6">
                            <LineGrow className="h-px bg-border-warm" />
                        </div>

                        <FadeIn direction="right" delay={0.4} blur>
                            <p className="body-prose mt-6">
                                We act as a strategic bridge between international
                                principals and Indonesia&apos;s professional salon and
                                barber industry. Supported by a solid technical and sales
                                team, we actively educate the industry through
                                knowledge-first approach.
                            </p>
                        </FadeIn>

                        {/* List items with blur stagger */}
                        <motion.ul
                            className="mt-8 space-y-4"
                            variants={listStagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {capabilities.map((item, i) => (
                                <motion.li
                                    key={item}
                                    className="flex items-start gap-3 border-l-2 border-border-warm pl-4 transition-colors duration-[600ms] ease-[var(--ease)] hover:border-brand-crimson"
                                    variants={listItemFadeIn}
                                >
                                    <span className="text-[11px] font-bold tabular-nums text-brand-crimson/50 mt-1">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-sm leading-7 text-charcoal">
                                        {item}
                                    </span>
                                </motion.li>
                            ))}
                        </motion.ul>

                        <FadeIn delay={0.6} direction="right" blur dramatic>
                            <p className="mt-6 text-sm italic leading-7 text-text-muted">
                                We believe long-term success is built on knowledge,
                                not short-term tactics.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.8} direction="right" blur>
                            <div className="mt-10">
                                <AnimatedButton
                                    href={NAV_LINKS.education}
                                    fillClass="bg-foreground"
                                    fillTextClass="text-white"
                                    className="bg-surface-elevated text-foreground border border-border-warm"
                                >
                                    Explore Education
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
