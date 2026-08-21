"use client";

import * as React from "react";
import Link from "next/link";
import { X, ChevronRight, MessageCircle, FileText, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    NAV_LINKS,
    WHATSAPP_URL,
    PRODUCT_CATEGORIES,
    BRANDS,
    PILLARS,
} from "@/shared/lib/config";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { LanguageSwitcher } from "@/shared/components/ui/language-switcher";
import { trackEvent } from "@/shared/lib/analytics";
import { cn } from "@/shared/lib/utils";
import {
    mobileMenuStagger,
    mobileMenuItemFade,
    smoothEase,
} from "@/shared/lib/motion";

/* MobileMenu — Slide-out drawer with accordion sections */

export function MobileMenu({ onClose }: { onClose: () => void }): React.JSX.Element {
    const { dict } = useLanguage();
    const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const NAV_SECTIONS = [
        {
            label: dict.nav.products,
            href: NAV_LINKS.products,
            children: PRODUCT_CATEGORIES.map((cat) => ({
                label: cat,
                href: `/products?category=${cat.toLowerCase().replace(/\s+&?\s*/g, "-")}`,
            })),
        },
        {
            label: dict.nav.brands,
            href: NAV_LINKS.brands,
            children: BRANDS.map((b) => ({
                label: b.name,
                href: `/products?brand=${b.name.toLowerCase().replace(/\s+/g, "-")}`,
            })),
        },
        {
            label: dict.nav.education,
            href: NAV_LINKS.education,
        },
        {
            label: dict.nav.partnership,
            href: NAV_LINKS.partnership,
        },
        {
            label: dict.nav.about,
            href: NAV_LINKS.about,
        },
        {
            label: dict.nav.contact,
            href: NAV_LINKS.contact,
        },
    ];

    return (
        <motion.nav
            variants={mobileMenuStagger}
            initial="hidden"
            animate="visible"
            className="flex h-full flex-col bg-background"
            aria-label="Mobile navigation"
        >
            {/* Header */}
            <div className="flex h-[var(--header-height,80px)] items-center justify-between border-b border-border-warm/40 px-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{dict.nav.menu}</span>
                <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center text-foreground/60 transition-colors duration-300 hover:text-foreground"
                    aria-label="Close menu"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Language Switcher in Mobile Drawer */}
            <div className="border-b border-border-warm/30 px-6 py-3.5">
                <LanguageSwitcher variant="mobile" />
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto overscroll-contain py-3">
                {NAV_SECTIONS.map((section) => (
                    <motion.div key={section.label} variants={mobileMenuItemFade}>
                        {section.children ? (
                            <div>
                                <button
                                    onClick={() => toggleSection(section.label)}
                                    className="flex w-full items-center justify-between px-6 py-3.5 text-left text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 hover:bg-muted/40"
                                >
                                    {section.label}
                                    <ChevronRight
                                        className={cn(
                                            "h-4 w-4 text-muted-foreground transition-transform duration-300",
                                            expandedSection === section.label && "rotate-90"
                                        )}
                                    />
                                </button>
                                <AnimatePresence>
                                    {expandedSection === section.label && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: smoothEase }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-l border-border-warm/30 ml-6 pl-4 pb-2">
                                                {section.children.map((child) => (
                                                    <Link
                                                        key={child.label}
                                                        href={child.href}
                                                        onClick={onClose}
                                                        className="block py-2.5 text-[12px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href={section.href}
                                onClick={onClose}
                                className="flex items-center px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 hover:bg-muted/40"
                            >
                                {section.label}
                            </Link>
                        )}
                        <div className="mx-6 h-px bg-border-warm/20" />
                    </motion.div>
                ))}

                {/* Quick Utility Links (Credit Application & Partner Login) */}
                <motion.div variants={mobileMenuItemFade} className="px-6 pt-4 pb-2 space-y-2">
                    <Link
                        href="/partnership"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-lg border border-border-warm/60 bg-surface text-xs font-semibold uppercase tracking-[0.12em] text-foreground hover:bg-surface-elevated transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-brand-crimson" />
                            {dict.nav.creditApplication}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>

                    <Link
                        href="/partnership"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-lg bg-foreground text-white text-xs font-semibold uppercase tracking-[0.12em] hover:bg-foreground/90 transition-colors"
                    >
                        <span>{dict.nav.partnerLogin}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-white/80" />
                    </Link>
                </motion.div>
            </div>

            {/* Bottom Section */}
            <motion.div
                variants={mobileMenuItemFade}
                className="border-t border-border-warm/30 p-5"
            >
                <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        trackEvent("cta_whatsapp_click", { location: "mobile_menu" });
                        onClose();
                    }}
                    className="flex w-full items-center justify-center gap-2 border border-border-warm/80 bg-surface-elevated py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground transition-colors duration-300 hover:bg-muted/40"
                >
                    <MessageCircle className="h-3.5 w-3.5 text-whatsapp" />
                    WhatsApp Consultation
                </a>

                {/* Three pillars */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {PILLARS.map((pillar) => (
                        <Link
                            key={pillar.label}
                            href={pillar.href}
                            onClick={onClose}
                            className="py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 transition-colors duration-300 hover:text-foreground"
                        >
                            {pillar.label}
                        </Link>
                    ))}
                </div>
            </motion.div>
        </motion.nav>
    );
}
