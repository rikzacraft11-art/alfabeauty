"use client";

import * as React from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCookieConsentContent } from "@/content/homepage";
import AppLink from "@/components/ui/AppLink";

// =============================================================================
// Constants
// =============================================================================

const COOKIE_CONSENT_KEY = "alfa-beauty-cookie-consent";

// =============================================================================
// Main Component
// =============================================================================

/**
 * CookieConsent - GDPR compliant cookie banner
 * 
 * Features:
 * - Minimal professional design
 * - localStorage persistence
 * - Accept/Decline options
 * - Link to privacy policy
 * 
 * Paradigm: Subtle entrance, minimal motion
 */
export default function CookieConsent() {
    const { locale } = useLocale();
    const content = getCookieConsentContent(locale);
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Small delay for subtle entrance
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
        setVisible(false);
        // In production: Enable analytics, tracking, etc.
    };

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
        setVisible(false);
        // In production: Disable non-essential cookies
    };

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6
                       bg-background border-t border-border shadow-lg
                       animate-fade-in-up"
            role="dialog"
            aria-label="Cookie consent"
        >
            <div className="max-w-[120rem] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Message */}
                <p className="type-body text-foreground-muted flex-1">
                    {content.message}{" "}
                    <AppLink
                        href={`/${locale}${content.privacyLink}`}
                        className="text-foreground underline hover:no-underline"
                    >
                        {content.learnMore}
                    </AppLink>
                </p>

                {/* Actions */}
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 type-ui text-foreground-muted
                                   hover:text-foreground
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground
                                   transition-colors duration-150"
                    >
                        {content.decline}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 bg-foreground text-background 
                                   ui-radius-tight type-ui-strong
                                   hover:bg-foreground/90
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground
                                   transition-colors duration-150"
                    >
                        {content.accept}
                    </button>
                </div>
            </div>
        </div>
    );
}
