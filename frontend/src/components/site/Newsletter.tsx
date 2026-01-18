"use client";

import * as React from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getNewsletterContent } from "@/content/homepage";
import { IconMail, IconCheck } from "@/components/ui/icons";

// =============================================================================
// Types
// =============================================================================

type FormStatus = "idle" | "loading" | "success" | "error";

// =============================================================================
// Main Component
// =============================================================================

/**
 * Newsletter - Email capture section before footer
 * 
 * Features:
 * - Minimalist professional design
 * - Form validation
 * - Success/error states
 * - GDPR consent text
 * 
 * Paradigm: Minimal animation, professional motion
 */
export default function Newsletter() {
    const { locale } = useLocale();
    const content = getNewsletterContent(locale);
    const [email, setEmail] = React.useState("");
    const [status, setStatus] = React.useState<FormStatus>("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || status === "loading") return;

        setStatus("loading");

        // Simulate API call - replace with actual endpoint
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // In production: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
            setStatus("success");
            setEmail("");
        } catch {
            setStatus("error");
        }
    };

    return (
        <section
            className="py-12 sm:py-16 bg-foreground text-background"
            aria-labelledby="newsletter-title"
        >
            <div className="px-4 sm:px-6 lg:px-10 max-w-[120rem] mx-auto">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Header */}
                    <p className="type-kicker text-background/60 mb-2">
                        {content.kicker}
                    </p>
                    <h2 id="newsletter-title" className="type-h2 text-background mb-3">
                        {content.title}
                    </h2>
                    <p className="type-body text-background/70 mb-8">
                        {content.description}
                    </p>

                    {/* Form */}
                    {status === "success" ? (
                        <div className="flex items-center justify-center gap-2 py-4 text-background">
                            <IconCheck className="h-5 w-5" />
                            <span className="type-body-strong">{content.success}</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <div className="relative flex-1">
                                    <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={content.placeholder}
                                        required
                                        disabled={status === "loading"}
                                        className="w-full pl-10 pr-4 py-3 bg-background text-foreground 
                                                   ui-radius-tight border-0
                                                   placeholder:text-muted
                                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-foreground focus:ring-background
                                                   disabled:opacity-50 disabled:cursor-not-allowed
                                                   transition-opacity duration-150"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === "loading" || !email}
                                    className="px-6 py-3 bg-background text-foreground 
                                               ui-radius-tight type-ui-strong
                                               hover:bg-background/90
                                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-foreground focus:ring-background
                                               disabled:opacity-50 disabled:cursor-not-allowed
                                               transition-all duration-150"
                                >
                                    {status === "loading" ? "..." : content.button}
                                </button>
                            </div>

                            {/* Error message */}
                            {status === "error" && (
                                <p className="type-data text-error-bg">{content.error}</p>
                            )}

                            {/* Consent text */}
                            <p className="type-data text-background/50 max-w-sm mx-auto">
                                {content.consent}
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
