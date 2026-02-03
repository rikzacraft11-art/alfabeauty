"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import MagneticButton from "@/components/ui/MagneticButton";
import LocaleToggle from "@/components/i18n/LocaleToggle";
import HamburgerIcon from "@/components/ui/HamburgerIcon";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

const NAV_LINKS = [
    { href: "/about", labelKey: "about" },
    { href: "/products", labelKey: "products" },
    { href: "/education", labelKey: "education" },
    { href: "/partnership", labelKey: "partnership" },
    { href: "/contact", labelKey: "contact" },
];

/**
 * HeaderNav: Elegant header with frosted glass effect on scroll.
 * Design V2 pattern - Transparent at top, frosted on scroll.
 */
export default function HeaderNav() {
    const { locale } = useLocale();
    const tx = t(locale);
    const base = `/${locale}`;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        let rafId = 0;

        const handleScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = 0;
                const next = window.scrollY > 50;
                setIsScrolled((prev) => (prev === next ? prev : next));
            });
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[var(--transition-elegant)] ${isScrolled
                        ? "glass border-b border-border/50 shadow-sm"
                        : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <AppLink href={base} className="type-footer-brand text-foreground">
                            ALFA BEAUTY
                        </AppLink>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {NAV_LINKS.map((link) => (
                                <MagneticButton
                                    key={link.href}
                                    as="a"
                                    href={`${base}${link.href}`}
                                    strength={0.2}
                                    className="type-nav text-foreground-muted hover:text-foreground transition-colors duration-[var(--transition-elegant)] underline-grow"
                                >
                                    {tx.nav[link.labelKey as keyof typeof tx.nav]}
                                </MagneticButton>
                            ))}

                            <MagneticButton
                                as="a"
                                href={`${base}/partnership`}
                                strength={0.15}
                                className="ui-btn-primary px-6 py-2.5 type-data rounded-full"
                            >
                                {tx.nav.partnership}
                            </MagneticButton>

                            {/* Language Switcher - DEV-37 */}
                            <LocaleToggle />
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            className="lg:hidden p-2 text-foreground"
                            aria-label={isMobileOpen ? tx.header.actions.closeMenu : tx.header.actions.openMenu}
                            aria-expanded={isMobileOpen}
                            aria-controls="mobile-menu"
                        >
                            <HamburgerIcon isOpen={isMobileOpen} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu (Curtain Reveal) */}
            <motion.div
                id="mobile-menu"
                initial={false}
                animate={isMobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed inset-0 z-40 bg-background ${isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                style={{ paddingTop: "5rem" }}
                aria-hidden={!isMobileOpen}
            >
                <nav className="container mx-auto px-6 py-12 flex flex-col gap-6">
                    {NAV_LINKS.map((link, i) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isMobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                        >
                            <AppLink
                                href={`${base}${link.href}`}
                                onClick={() => setIsMobileOpen(false)}
                                className="type-h2 text-foreground block py-4 border-b border-border"
                            >
                                {tx.nav[link.labelKey as keyof typeof tx.nav]}
                            </AppLink>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isMobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="mt-8"
                    >
                        <ButtonLink
                            href={`${base}/partnership`}
                            variant="primary"
                            onClick={() => setIsMobileOpen(false)}
                            className="w-full py-4 text-center type-body rounded-full block"
                        >
                            {tx.nav.partnership}
                        </ButtonLink>
                    </motion.div>
                </nav>
            </motion.div>
        </>
    );
}
