"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLink from "@/components/ui/AppLink";
import ButtonLink from "@/components/ui/ButtonLink";

const MEGA_MENU_DATA = {
    products: {
        label: "Products",
        sections: [
            {
                title: "By Brand",
                links: [
                    { label: "Alfaparf Milano", href: "/products?brand=alfaparf" },
                    { label: "Farmavita", href: "/products?brand=farmavita" },
                    { label: "Montibello", href: "/products?brand=montibello" },
                    { label: "Gamma+ Professional", href: "/products?brand=gammaplus" },
                ],
            },
            {
                title: "By Category",
                links: [
                    { label: "Hair Color", href: "/products?category=color" },
                    { label: "Hair Care", href: "/products?category=care" },
                    { label: "Styling", href: "/products?category=styling" },
                    { label: "Tools & Equipment", href: "/products?category=tools" },
                ],
            },
        ],
        cta: { label: "View All Products", href: "/products" },
    },
    education: {
        label: "Education",
        sections: [
            {
                title: "Programs",
                links: [
                    { label: "Upcoming Events", href: "/education" },
                    { label: "Technical Training", href: "/education?type=training" },
                    { label: "Workshops", href: "/education?type=workshop" },
                ],
            },
            {
                title: "Resources",
                links: [
                    { label: "Industry Trends", href: "/education?type=article" },
                    { label: "Product Knowledge", href: "/education?type=product" },
                ],
            },
        ],
        cta: { label: "Explore Education", href: "/education" },
    },
    partnership: {
        label: "Partnership",
        sections: [
            {
                title: "For Professionals",
                links: [
                    { label: "Why Partner With Us", href: "/partnership" },
                    { label: "Partner Benefits", href: "/partnership#benefits" },
                    { label: "Application Process", href: "/partnership#process" },
                ],
            },
        ],
        cta: { label: "Become a Partner", href: "/partnership" },
    },
};

type MegaMenuKey = keyof typeof MEGA_MENU_DATA;

/**
 * MegaMenu: Elegant dropdown with curtain animation.
 * DEV-33/34: Mega Menu with Products, Education, Partnership.
 * Design V2: Full-width reveal with elegant motion.
 */
export default function MegaMenu() {
    const [activeMenu, setActiveMenu] = useState<MegaMenuKey | null>(null);

    const handleMouseEnter = (key: MegaMenuKey) => {
        setActiveMenu(key);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    return (
        <div onMouseLeave={handleMouseLeave}>
            {/* Trigger Links */}
            <nav className="hidden lg:flex items-center gap-8">
                {(Object.keys(MEGA_MENU_DATA) as MegaMenuKey[]).map((key) => (
                    <button
                        key={key}
                        onMouseEnter={() => handleMouseEnter(key)}
                        className={`type-nav transition-colors duration-[var(--transition-elegant)] ${activeMenu === key ? "text-foreground" : "text-foreground-muted hover:text-foreground"
                            }`}
                    >
                        {MEGA_MENU_DATA[key].label}
                    </button>
                ))}
            </nav>

            {/* Mega Menu Panel - Curtain Animation */}
            <AnimatePresence>
                {activeMenu && (
                    <motion.div
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
                                            Discover our complete range of professional solutions.
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
