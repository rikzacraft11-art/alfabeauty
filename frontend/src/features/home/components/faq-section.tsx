"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { FadeIn } from "@/shared/components/motion/fade-in";
import { TextReveal } from "@/shared/components/motion/text-reveal";
import { LineGrow } from "@/shared/hooks/use-animations";
import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * FAQSection — Inline FAQ accordion for every page.
 *
 * GAP-SHARED-01: Yucca displays 3–7 contextual FAQ on every page.
 * Alfa Beauty now mirrors this pattern with an accordion component
 * that accepts optional per-page questions or falls back to defaults.
 * ───────────────────────────────────────────────────────────────────── */

export interface FAQItem {
    question: string;
    answer: string;
}

const DEFAULT_FAQ: FAQItem[] = [
    {
        question: "What brands does Alfa Beauty distribute?",
        answer: "We are the exclusive Indonesian importer and distributor of Alfaparf Milano Professional, Farmavita, Montibello, and Gamma+ Professional — leading Italian and Spanish professional haircare brands trusted by salons worldwide.",
    },
    {
        question: "How can my salon become a partner?",
        answer: "Visit our Partnership page or contact us via WhatsApp. We offer exclusive pricing, priority product access, dedicated support, and professional education programs for salon and barbershop partners across Indonesia.",
    },
    {
        question: "Do you provide product training?",
        answer: "Yes. Through Alfa Beauty Academy, we offer hands-on technical workshops covering colouring, cutting, styling techniques, product knowledge, and salon business development. Training is available for all partner salons.",
    },
    {
        question: "Are all products officially imported?",
        answer: "Every product is 100% officially imported with full BPOM registration. We guarantee authenticity — no grey market, no counterfeit products. All items come with proper documentation and brand-backed warranties.",
    },
    {
        question: "What areas do you cover?",
        answer: "Alfa Beauty serves professional salons and barbershops across all 34 provinces of Indonesia. Our distribution network ensures timely delivery nationwide, supported by regional account managers.",
    },
];

function FAQAccordionItem({
    item,
    index,
    isOpen,
    onToggle,
    onHover,
}: {
    item: FAQItem;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
    onHover?: () => void;
}) {
    return (
        <FadeIn delay={index * 0.06} blur>
            <div
                className="group border-b border-border-warm/60 transition-colors hover:border-black/50"
                onMouseEnter={onHover}
            >
                <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-200"
                    aria-expanded={isOpen}
                    onClick={onToggle}
                >
                    <span className="text-[15px] sm:text-[16px] font-normal tracking-[-0.01em] text-foreground transition-colors group-hover:text-brand-crimson">
                        {item.question}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground transition-transform duration-300 group-hover:text-brand-crimson">
                        {isOpen ? (
                            <Minus className="h-4 w-4" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                    </span>
                </button>
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -4 }}
                            animate={{ height: "auto", opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -4 }}
                            transition={{
                                height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                                opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                            }}
                            className="overflow-hidden"
                        >
                            <div className="pb-6 pr-6 sm:pr-12">
                                <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-muted-foreground font-normal">
                                    {item.answer}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </FadeIn>
    );
}

interface FAQSectionProps {
    items?: FAQItem[];
    heading?: string;
    eyebrow?: string;
}

export function FAQSection({
    items,
    heading,
    eyebrow,
}: FAQSectionProps = {}) {
    const { dict, language } = useLanguage();
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    const faqItems = items ?? dict.faq.items ?? DEFAULT_FAQ;
    const faqHeading = heading ?? dict.faq.heading ?? "Frequently Asked Questions";
    const faqEyebrow = eyebrow ?? dict.faq.eyebrow ?? "Have Questions?";
    const faqDescription = dict.faq.description ?? "Everything you need to know about our products, salon partnership, and distribution.";

    return (
        <section id="faq" className="section section-faq bg-background bg-tactile-luxury py-20 sm:py-28 lg:py-36 text-foreground border-b border-border-warm/60">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-16">
                    {/* Left — heading */}
                    <div className="lg:col-span-4">
                        <FadeIn blur scale>
                            <p className="eyebrow">{faqEyebrow}</p>
                        </FadeIn>
                        <div className="mt-3">
                            <TextReveal
                                as="h2"
                                className="heading-section"
                                split="word"
                                blur
                                lines={faqHeading.split(" ").reduce<string[]>((acc, word, i) => {
                                    if (i < 2) {
                                        acc[0] = acc[0] ? `${acc[0]} ${word}` : word;
                                    } else {
                                        acc[1] = acc[1] ? `${acc[1]} ${word}` : word;
                                    }
                                    return acc;
                                }, [])}
                            />
                        </div>
                        <FadeIn delay={0.3} blur>
                            <p className="body-prose mt-4 max-w-sm">
                                {faqDescription}
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/faq"
                                    aria-label={language === "id" ? "Lihat seluruh pertanyaan umum (FAQ)" : "Explore all frequently asked questions (FAQ)"}
                                    className="group inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground border-b border-foreground pb-1 transition-all duration-200 hover:border-brand-crimson hover:text-brand-crimson"
                                >
                                    <span>{language === "id" ? "Lihat Seluruh FAQ" : "Explore Full FAQ"}</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right — accordion with hover slow reveal */}
                    <div className="lg:col-span-8">
                        <LineGrow className="h-px bg-border-warm mb-0 lg:hidden" />
                        <div className="space-y-1">
                            {faqItems.map((item, index) => (
                                <FAQAccordionItem
                                    key={item.question}
                                    item={item}
                                    index={index}
                                    isOpen={openIndex === index}
                                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                                    onHover={() => setOpenIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
