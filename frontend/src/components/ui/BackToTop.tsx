"use client";

import * as React from "react";
import { IconChevronUp } from "@/components/ui/icons";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

/**
 * BackToTop - Floating button to scroll back to top
 * 
 * Features:
 * - Only visible after scrolling down 400px
 * - Smooth scroll animation
 * - Accessible with keyboard
 * 
 * Usage: Add to layout for global availability
 */
export default function BackToTop() {
    const [visible, setVisible] = React.useState(false);
    const { locale } = useLocale();
    const tx = t(locale);

    React.useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        const prefersReducedMotion = typeof window !== "undefined"
            && "matchMedia" in window
            && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };

    if (!visible) return null;

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 z-40 h-12 w-12
                       bg-foreground text-background
                       rounded-full shadow-lg
                       flex items-center justify-center
                       hover:bg-foreground/90
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground
                       transition-all duration-300
                       animate-fade-in"
            aria-label={tx.ui?.backToTop ?? "Back to top"}
        >
            <IconChevronUp className="h-5 w-5" />
        </button>
    );
}
