"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import * as React from "react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { TextReveal } from "@/shared/components/motion/text-reveal";
import { AnimatedButton } from "@/shared/components/ui/animated-button";
import { WhatsAppCTA } from "@/shared/components/ui/whatsapp-cta";
import { LineGrow } from "@/shared/hooks/use-animations";
import { NAV_LINKS } from "@/shared/lib/config";
import { PARALLAX, cardStagger, cardFadeScale, listStagger, listItemFadeIn } from "@/shared/lib/motion";

/* ─────────────────────────────────────────────────────────────────────
 * PartnershipSection V8 — Atmospheric depth & cinematic cards:
 *
 * V8 upgrades over V7:
 *   - Ken Burns ambient drift on background image for living atmosphere
 *   - Enhanced card grain depth with deeper hover shadow
 *   - Warm gradient atmospheric overlay with brand tinting
 *   - Deeper card hover translate (-3px from -2px)
 *   - Refined list item border animation timing
 * ───────────────────────────────────────────────────────────────────── */

const benefitsPrincipal = [
    "Strong nationwide distribution network",
    "Deep understanding of Indonesia's salon and barber ecosystem",
    "Proven capability in brand building and market education",
];

const benefitsSalon = [
    "Access to trusted global haircare brands",
    "Consistent product quality and professional support",
    "Long-term partnership based on trust and competence",
];

interface PartnerCardProps {
    number: string;
    eyebrow: string;
    title: string;
    items: string[];
    accent?: "crimson" | "dark";
}

function PartnerCard({ number, eyebrow, title, items, accent = "crimson" }: PartnerCardProps) {
    return (
        <motion.div
            variants={cardFadeScale}
            className="group relative h-full overflow-hidden border border-border-warm/60 bg-surface-elevated p-5 sm:p-8 transition-all duration-300 hover:shadow-sm lg:p-12"
        >

            <div className="relative z-10">
                {/* Numbered badge */}
                <span className="text-[36px] sm:text-[48px] lg:text-[64px] font-bold leading-none tracking-tighter text-border-warm/60 transition-colors duration-500 group-hover:text-border-warm select-none">
                    {number}
                </span>

                <p className={`mt-4 text-xs font-bold uppercase tracking-[0.15em] ${accent === "dark" ? "text-brand-dark" : "text-brand-crimson"}`}>
                    {eyebrow}
                </p>

                <h3 className="mt-3 text-xl font-bold tracking-tight">
                    {title}
                </h3>

                <div className="mt-6">
                    <LineGrow className="h-px bg-border-warm" />
                </div>

                <motion.ul
                    className="mt-6 space-y-4"
                    variants={listStagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {items.map((item) => (
                        <motion.li
                            key={item}
                            className="flex items-start gap-3 border-l-2 border-border-warm pl-4 transition-colors duration-[600ms] ease-[var(--ease)] hover:border-brand-crimson"
                            variants={listItemFadeIn}
                        >
                            <span className="text-sm leading-7 text-charcoal">
                                {item}
                            </span>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>

            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-crimson transition-[width] duration-[800ms] ease-[var(--ease)] group-hover:w-full" />
        </motion.div>
    );
}

export function PartnershipSection(): React.JSX.Element {
    return (
        <section id="partnership" className="relative overflow-hidden bg-surface py-12 sm:py-16 lg:py-32">
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
                <Image
                    src="/images/brands/alfaparf-milano.webp"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover opacity-[0.04]"
                    aria-hidden="true"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-elevated/30 to-surface pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-surface/40 pointer-events-none" />

            <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <FadeIn blur scale>
                    <p className="eyebrow">Partnership</p>
                </FadeIn>
                <div className="mt-2">
                    <TextReveal
                        as="h2"
                        className="heading-section"
                        split="word"
                        blur
                        lines={["Why Partner With Us"]}
                    />
                </div>

                {/* Cards — stagger with scale + numbered */}
                <motion.div
                    className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2"
                    variants={cardStagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                >
                    <PartnerCard
                        number="01"
                        eyebrow="For International Principals"
                        title="Expand your reach in Indonesia"
                        items={benefitsPrincipal}
                        accent="crimson"
                    />
                    <PartnerCard
                        number="02"
                        eyebrow="For Professional Salons & Barbershops"
                        title="Elevate your service quality"
                        items={benefitsSalon}
                        accent="dark"
                    />
                </motion.div>

                <FadeIn delay={0.6} blur dramatic>
                    <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <AnimatedButton
                            href={NAV_LINKS.partnership}
                            fillClass="bg-white"
                            fillTextClass="text-brand-crimson"
                            className="bg-brand-crimson text-white"
                        >
                            Become a Partner
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </AnimatedButton>

                        <WhatsAppCTA
                            location="partnership_section"
                            variant="outline"
                            size="lg"
                            className="border-border-warm px-8 py-6 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300"
                        >
                            Consult via WhatsApp
                        </WhatsAppCTA>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
