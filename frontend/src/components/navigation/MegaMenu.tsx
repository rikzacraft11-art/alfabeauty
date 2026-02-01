"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

type MegaMenuKey = "products" | "education" | "partnership";

/**
 * MegaMenu: Elegant dropdown with curtain animation.
 * DEV-33/34: Mega Menu with Products, Education, Partnership.
 * Design V2: Full-width reveal with elegant motion.
 */
export default function MegaMenu() {
    const { locale } = useLocale();
    const tx = t(locale);
    const base = `/${locale}`;
    const [activeMenu, setActiveMenu] = useState<MegaMenuKey | null>(null);

    const MEGA_MENU_DATA: Record<MegaMenuKey, { label: string; sections: Array<{ title: string; links: Array<{ label: string; href: string }> }>; cta: { label: string; href: string } }> = {
        products: {
            label: tx.megaMenu.labels.products,
            sections: [
                {
                    title: tx.megaMenu.sections.byBrand,
                    links: [
                        { label: tx.megaMenu.links.alfaparf, href: `${base}/products?brand=alfaparf` },
                        { label: tx.megaMenu.links.farmavita, href: `${base}/products?brand=farmavita` },
                        { label: tx.megaMenu.links.montibello, href: `${base}/products?brand=montibello` },
                        { label: tx.megaMenu.links.gammaplus, href: `${base}/products?brand=gammaplus` },
                    ],
                },
                {
                    title: tx.megaMenu.sections.byCategory,
                    links: [
                        { label: tx.megaMenu.links.hairColor, href: `${base}/products?category=color` },
                        { label: tx.megaMenu.links.hairCare, href: `${base}/products?category=treatment` },
                        { label: tx.megaMenu.links.styling, href: `${base}/products?category=styling` },
                        { label: tx.megaMenu.links.grooming, href: `${base}/products?category=grooming` },
                    ],
                },
            ],
            cta: { label: tx.megaMenu.cta.viewAllProducts, href: `${base}/products` },
        },
        education: {
            label: tx.megaMenu.labels.education,
            sections: [
                {
                    title: tx.megaMenu.sections.programs,
                    links: [
                        { label: tx.megaMenu.links.upcomingEvents, href: `${base}/education/events` },
                        { label: tx.megaMenu.links.articles, href: `${base}/education/articles` },
                    ],
                },
                {
                    title: tx.megaMenu.sections.resources,
                    links: [
                        { label: tx.megaMenu.links.articles, href: `${base}/education/articles` },
                    ],
                },
            ],
            cta: { label: tx.megaMenu.cta.exploreEducation, href: `${base}/education` },
        },
        partnership: {
            label: tx.megaMenu.labels.partnership,
            sections: [
                {
                    title: tx.megaMenu.sections.forProfessionals,
                    links: [
                        { label: tx.megaMenu.links.whyPartner, href: `${base}/partnership` },
                        { label: tx.megaMenu.links.partnerBenefits, href: `${base}/partnership` },
                    ],
                },
            ],
            cta: { label: tx.megaMenu.cta.becomePartner, href: `${base}/partnership` },
        },
    };

    const handleMouseEnter = (key: MegaMenuKey) => {
        setActiveMenu(key);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    return (
        <div
            onMouseLeave={handleMouseLeave}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setActiveMenu(null);
                }
            }}
        >
            {/* Trigger Links */}
            <nav className="hidden lg:flex items-center gap-8">
                {(Object.keys(MEGA_MENU_DATA) as MegaMenuKey[]).map((key) => (
                    <button
                        key={key}
                        type="button"
                        onMouseEnter={() => handleMouseEnter(key)}
                        onFocus={() => handleMouseEnter(key)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
                                event.preventDefault();
                                handleMouseEnter(key);
                            }
                        }}
                        className={`type-nav transition-colors duration-[var(--transition-elegant)] ${activeMenu === key ? "text-foreground" : "text-foreground-muted hover:text-foreground"
                            }`}
                        aria-haspopup="menu"
                        aria-expanded={activeMenu === key}
                        aria-controls="mega-menu-panel"
                    >
                        {MEGA_MENU_DATA[key].label}
                    </button>
                ))}
            </nav>

            {/* Mega Menu Panel - Curtain Animation */}
            <AnimatePresence>
                {activeMenu && (
                    <motion.div
                        id="mega-menu-panel"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-xl overflow-hidden"
                        onMouseEnter={() => setActiveMenu(activeMenu)}
                    >
                        <div className="container mx-auto px-6 lg:px-12 py-12">
                            <div className="grid grid-cols-12 gap-12">
                                {/* Menu Sections */}
                                <div className="col-span-9 grid grid-cols-3 gap-8">
                                    {MEGA_MENU_DATA[activeMenu].sections.map((section, idx) => (
                                        <motion.div
                                            key={section.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                                        >
                                            <h3 className="type-data-strong text-muted mb-4">{section.title}</h3>
                                            <ul className="space-y-3">
                                                {section.links.map((link) => (
                                                    <li key={link.href}>
                                                        <AppLink
                                                            href={link.href}
                                                            className="type-body text-foreground hover:text-foreground-muted transition-colors"
                                                        >
                                                            {link.label}
                                                        </AppLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA Section */}
                                <motion.div
                                    className="col-span-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    <div className="p-6 rounded-2xl bg-panel border border-border">
                                        <h3 className="type-h3 text-foreground mb-4">
                                            {MEGA_MENU_DATA[activeMenu].label}
                                        </h3>
                                        <p className="type-body text-muted mb-6">
                                            {tx.megaMenu.description}
                                        </p>
                                        <ButtonLink
                                            href={MEGA_MENU_DATA[activeMenu].cta.href}
                                            variant="primary"
                                            className="px-6 py-3 type-nav rounded-full inline-block transition-all duration-[var(--transition-elegant)]"
                                        >
                                            {MEGA_MENU_DATA[activeMenu].cta.label}
                                        </ButtonLink>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
