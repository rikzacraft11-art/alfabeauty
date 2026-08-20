"use client";

import { useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { announcementSlide } from "@/shared/lib/motion";

/**
 * AnnouncementBar V1 — Dismissible notification bar above header.
 *
 * GAP-HEADER-02: Yucca's announcement/notification bar pattern.
 * Sticky top, dark bg, uppercase text, close button.
 * Dismissed state persisted via sessionStorage.
 */

interface AnnouncementBarProps {
    message: string;
    href?: string;
    linkText?: string;
}

const STORAGE_KEY = "announcement-dismissed";
const DISMISS_EVENT = "announcement-dismissed";

export function AnnouncementBar({
    message,
    href,
    linkText = "Learn More",
}: AnnouncementBarProps) {
    const subscribe = useCallback((onStoreChange: () => void) => {
        window.addEventListener(DISMISS_EVENT, onStoreChange);
        return () => window.removeEventListener(DISMISS_EVENT, onStoreChange);
    }, []);
    const dismissed = useSyncExternalStore(
        subscribe,
        () => sessionStorage.getItem(STORAGE_KEY) === "1",
        () => false
    );

    const handleDismiss = () => {
        sessionStorage.setItem(STORAGE_KEY, "1");
        window.dispatchEvent(new Event(DISMISS_EVENT));
    };

    return (
        <AnimatePresence>
            {!dismissed && (
                <motion.div
                    variants={announcementSlide}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="announcement-bar relative z-60 flex items-center justify-center px-4 py-2 text-center"
                >
                    <p className="text-xs tracking-widest font-light">
                        {message}
                        {href && (
                            <>
                                {" "}
                                <a
                                    href={href}
                                    className="underline underline-offset-4 hover:opacity-80 transition-opacity font-medium"
                                >
                                    {linkText}
                                </a>
                            </>
                        )}
                    </p>
                    <button
                        onClick={handleDismiss}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="Dismiss announcement"
                    >
                        <X className="size-3.5" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
