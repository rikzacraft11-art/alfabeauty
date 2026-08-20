"use client";

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { smoothEase } from "@/shared/lib/motion";

/* ─────────────────────────────────────────────────────────────────────
 * CookieConsent — GDPR-style cookie consent banner.
 *
 * GAP-SHARED-03: Yucca has Accept All / Customise / Reject All consent.
 * Alfa Beauty mirrors with a minimal banner using localStorage persistence.
 * ───────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = "alfa-cookie-consent";

export function CookieConsent() {
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        const consent = localStorage.getItem(STORAGE_KEY);
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(STORAGE_KEY, "accepted");
        setVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem(STORAGE_KEY, "rejected");
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 z-[60] border-t border-border-warm/40 bg-background/95 backdrop-blur-sm"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: smoothEase }}
                >
                    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
                        <div className="flex-1">
                            <p className="text-sm leading-relaxed text-text-muted">
                                We use cookies to enhance your experience. By continuing to visit this site
                                you agree to our use of cookies.{" "}
                                <Link
                                    href="/privacy"
                                    className="underline underline-offset-4 transition-colors duration-300 hover:text-foreground"
                                >
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={handleReject}
                                className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] border border-border-warm/60 text-text-muted transition-all duration-300 hover:border-foreground/30 hover:text-foreground"
                            >
                                Reject
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] bg-foreground text-background transition-all duration-300 hover:bg-foreground/90"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex h-8 w-8 items-center justify-center text-text-muted transition-colors duration-300 hover:text-foreground sm:hidden"
                                aria-label="Dismiss cookie banner"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
