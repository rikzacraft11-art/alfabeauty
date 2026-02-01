"use client";

import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

/**
 * SkipLink: Accessibility skip navigation for keyboard users.
 * Design V2 WCAG 2.2 AA compliance pattern.
 */
export default function SkipLink() {
    const { locale } = useLocale();
    const tx = t(locale);

    return (
        <AppLink
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-foreground focus:text-background focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground transition-all"
        >
            {tx.ui?.skipToMainContent ?? "Skip to main content"}
        </AppLink>
    );
}
