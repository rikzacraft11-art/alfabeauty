"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import { staggerMedium, fadeInUp } from "@/lib/motion";

/**
 * PreFooterCTA V2 — Dramatic full-width CTA banner with rolling marquee.
 *
 * V2 upgrades:
 *   - Rolling marquee text band for ambient movement
 *   - Deeper atmospheric layering (dual vignette + radial glow)
 *   - Enhanced grain depth
 */

export function PreFooterCTA() {
    return (
        <section className="pre-footer-cta relative py-20 sm:py-32 lg:py-40 bg-foreground text-background overflow-hidden">
            {/* Grain overlay */}
            <div className="pointer-events-none absolute inset-0 z-10" />

            {/* Warm vignette */}
            <div
                className="pointer-events-none absolute inset-0 z-[1]"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
                }}
            />

            {/* Brand warm radial glow */}
            <div
                className="pointer-events-none absolute inset-0 z-[1]"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(ellipse at 30% 60%, rgba(164,22,26,0.08) 0%, transparent 60%)",
                }}
            />



            <div className="relative z-20 mx-auto max-w-4xl px-6 text-center">
                <FadeIn>
                    <p className="text-xs tracking-[0.2em] uppercase text-background/50 mb-6 font-light">
                        Ready to Transform Your Salon?
                    </p>
                </FadeIn>

                <TextReveal
                    as="h2"
                    split="word"
                    blur
                    className="heading-section text-background"
                    lines={[
                        "Elevate Your Craft With",
                        "Premium Professional Products",
                    ]}
                />

                <FadeIn delay={0.4}>
                    <p className="text-base lg:text-lg font-light text-background/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Join hundreds of salon professionals who trust Alfa Beauty Pro Store
                        for world-class brands, expert education, and dedicated partnership.
                    </p>
                </FadeIn>

                <motion.div
                    variants={staggerMedium}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.div variants={fadeInUp}>
                        <AnimatedButton
                            href="/products"
                            fillClass="bg-foreground"
                            fillTextClass="text-white"
                            className="bg-background text-foreground"
                        >
                            Explore Products
                            <ArrowRight className="h-4 w-4" />
                        </AnimatedButton>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-background/20 bg-transparent px-8 py-6 text-[11px] font-bold uppercase tracking-[0.15em] text-background transition-colors duration-300 hover:border-background/40 hover:bg-white/10"
                        >
                            <Link href="/partnership">
                                Become a Partner
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
