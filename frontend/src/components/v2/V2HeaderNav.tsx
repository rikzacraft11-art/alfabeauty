"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import LocaleToggle from "@/components/i18n/LocaleToggle";

const NAV_LINKS = [
    { href: "#about", label: "About" },
    { href: "#brands", label: "Our Brands" },
    { href: "#education", label: "Education" },
    { href: "#partner", label: "Partnership" },
];

/**
 * V2HeaderNav: Elegant header with frosted glass effect on scroll.
 * Design V2 pattern - Transparent at top, frosted on scroll.
 */
export default function V2HeaderNav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[var(--transition-elegant)] ${isScrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
                    : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="type-footer-brand text-foreground">
                            ALFA BEAUTY
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {NAV_LINKS.map((link) => (
                                <MagneticButton
                                    key={link.href}
                                    as="a"
                                    href={link.href}
                                    strength={0.2}
                                    className="type-nav text-foreground-muted hover:text-foreground transition-colors duration-[var(--transition-elegant)]"
                                >
                                    {link.label}
                                </MagneticButton>
                            ))}

                            <MagneticButton
                                as="a"
                                href="#partner"
                                strength={0.15}
                                className="ui-btn-primary px-6 py-2.5 type-data rounded-full"
                            >
                                Become Partner
                            </MagneticButton>

                            {/* Language Switcher - DEV-37 */}
                            <LocaleToggle />
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            className="lg:hidden p-2 text-foreground"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu (Curtain Reveal) */}
            <motion.div
                initial={false}
                animate={isMobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed inset-0 z-40 bg-background ${isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                style={{ paddingTop: "5rem" }}
            >
                <nav className="container mx-auto px-6 py-12 flex flex-col gap-6">
                    {NAV_LINKS.map((link, i) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isMobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                        >
                            <Link
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="type-h2 text-foreground block py-4 border-b border-border"
                            >
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isMobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="mt-8"
                    >
                        <Link
                            href="#partner"
                            onClick={() => setIsMobileOpen(false)}
                            className="ui-btn-primary w-full py-4 text-center type-body rounded-full block"
                        >
                            Become Partner
                        </Link>
                    </motion.div>
                </nav>
            </motion.div>
        </>
    );
}
