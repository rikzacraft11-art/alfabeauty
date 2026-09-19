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
 * Smooth Accordion Physics:
 * - Menghilangkan onHover auto-open yang menyebabkan layout thrashing & getaran.
 * - Akordion murni membuka/menutup via onClick dengan transisi height yang sangat halus.
 * ───────────────────────────────────────────────────────────────────── */
import { FAQItem, DEFAULT_FAQ } from "./faq-data";
export { DEFAULT_FAQ, type FAQItem };

function FAQAccordionItem({
    item,
    index,
    isOpen,
    onToggle,
}: {
    item: FAQItem;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <FadeIn delay={index * 0.05} blur>
            <div className="group border-b border-border-warm/60">
                <button
                    type="button"
                    className="flex w-full min-h-[52px] items-center justify-between gap-4 py-4 sm:py-5 text-left transition-opacity duration-200 cursor-pointer select-none active:opacity-75"
                    aria-expanded={isOpen}
                    onClick={onToggle}
                >
                    <span className="text-subtitle font-normal text-foreground transition-opacity group-hover:opacity-75">
                        {item.question}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground transition-transform duration-200">
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
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                height: { duration: 0.32, ease: [0.25, 1, 0.5, 1] },
                                opacity: { duration: 0.25, ease: "linear" },
                            }}
                            className="overflow-hidden"
                        >
                            <div className="pb-6 pr-6 sm:pr-12">
                                <p className="text-body leading-relaxed text-muted-foreground font-normal">
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
    description?: string;
    showExploreLink?: boolean;
}

export function FAQSection({
    items,
    heading,
    eyebrow,
    description,
    showExploreLink = true,
}: FAQSectionProps = {}): React.JSX.Element {
    const { dict, language } = useLanguage();
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    const faqItems = items ?? dict.faq.items ?? DEFAULT_FAQ;
    const faqHeading = heading ?? dict.faq.heading ?? "Frequently Asked Questions";
    const faqEyebrow = eyebrow ?? dict.faq.eyebrow ?? "Support Hub";
    const faqDescription = description ?? dict.faq.description ?? "Everything you need to know about our products, salon partnership, and distribution.";

    return (
        <section id="faq" className="section section-faq bg-background bg-tactile-luxury py-12 sm:py-20 lg:py-32 text-foreground border-t border-b border-border-warm/80 scroll-mt-[calc(var(--header-height,56px)+16px)]">
            <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-10 lg:px-16 xl:px-20">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-16">
                    {/* Left — heading */}
                    <div className="lg:col-span-4">
                        <div>
                            <FadeIn delay={0.1} blur>
                                <p className="eyebrow mb-3 text-brand-crimson">
                                    {faqEyebrow}
                                </p>
                            </FadeIn>
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
                            {showExploreLink && (
                                <div className="mt-6">
                                    <Link
                                        href="/faq"
                                        aria-label={language === "id" ? "Lihat seluruh pertanyaan umum (FAQ)" : "Explore all frequently asked questions (FAQ)"}
                                        className="group inline-flex items-center gap-1.5 text-cta font-semibold text-foreground border-b border-foreground pb-1 transition-all duration-200 hover:opacity-70"
                                    >
                                        <span>{language === "id" ? "Lihat Seluruh FAQ" : "Explore Full FAQ"}</span>
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            )}
                        </FadeIn>
                    </div>

                    {/* Right — accordion (Only opens on explicit click, perfectly smooth) */}
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
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
