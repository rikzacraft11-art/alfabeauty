"use client";

import LenisProvider from "@/components/ui/LenisProvider";
import V2HeaderNav from "@/components/v2/V2HeaderNav";
import V2WhatsAppCTA from "@/components/v2/V2WhatsAppCTA";
import V2Preloader from "@/components/v2/V2Preloader";
import SkipLink from "@/components/v2/SkipLink";
import FocusManager from "@/components/v2/FocusManager";
import { ReducedMotionProvider } from "@/components/v2/ReducedMotionProvider";

/**
 * V2 Layout Wrapper
 * - Wraps the locale layout content with V2 shell
 * - Lenis smooth scrolling enabled
 * - Design V2 tokens active
 * - WCAG 2.2 AA accessibility patterns
 */
export default function V2LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReducedMotionProvider>
            <LenisProvider>
                <V2Preloader />
                <SkipLink />
                <FocusManager />
                <div className="v2-root" data-design-version="2">
                    <V2HeaderNav />
                    <main id="main-content" tabIndex={-1}>
                        {children}
                    </main>
                    <V2WhatsAppCTA />
                </div>
            </LenisProvider>
        </ReducedMotionProvider>
    );
}
