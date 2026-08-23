"use client";

import * as React from "react";
import { HeroSection } from "./hero";
import { ShopCTASection } from "./shop-cta-section";
import { useLenisControl } from "@/shared/components/providers/lenis-provider";

/* ─────────────────────────────────────────────────────────────────────
 * HeroShopCluster
 * Unifies Section 1 (Hero) and Section 2 (Shop CTA) into a continuous
 * pure black (#000000) canvas with serene quiet luxury aesthetics.
 * 
 * Auto-Completion Logic:
 * If the user stops scrolling halfway through Section 1's video morph
 * (progress < 0.42) or Section 2's golden silk drawing (progress < 0.52),
 * it smoothly and automatically glides the scroll to complete the
 * interaction gracefully.
 * ───────────────────────────────────────────────────────────────────── */
export function HeroShopCluster(): React.JSX.Element {
    const clusterRef = React.useRef<HTMLDivElement>(null);
    const { scrollTo } = useLenisControl();
    const isProgrammaticSnap = React.useRef(false);
    const lastScrollY = React.useRef(0);
    const scrollDirection = React.useRef<"down" | "up">("down");
    const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        const handleUserInteraction = () => {
            // User resumed manual input: cancel any programmatic snap immediately
            isProgrammaticSnap.current = false;
        };

        const checkAndAutoComplete = () => {
            if (isProgrammaticSnap.current) return;

            const scrollY = window.scrollY;
            const vh = window.innerHeight;

            // ─── 1. Check Section 1 (Hero Video Morph) ───
            const heroEl = document.getElementById("hero");
            if (heroEl) {
                const heroTop = heroEl.offsetTop;
                const heroHeight = heroEl.offsetHeight;
                const heroScrollable = heroHeight - vh;

                if (heroScrollable > 0) {
                    const heroProgress = (scrollY - heroTop) / heroScrollable;

                    // If user stopped in mid-morph (between 3% and 40% scroll)
                    if (heroProgress > 0.03 && heroProgress < 0.40) {
                        isProgrammaticSnap.current = true;

                        const targetY = (scrollDirection.current === "down" || heroProgress >= 0.08)
                            ? Math.round(heroTop + 0.42 * heroScrollable)
                            : Math.round(heroTop);

                        scrollTo(targetY, {
                            duration: 0.9,
                            onComplete: () => {
                                isProgrammaticSnap.current = false;
                            },
                        });
                        return;
                    }
                }
            }

            // ─── 2. Check Section 2 (Shop CTA Golden Silk Wave) ───
            const shopEl = document.getElementById("shop-cta");
            if (shopEl) {
                const shopTop = shopEl.offsetTop;
                const shopHeight = shopEl.offsetHeight;
                const shopScrollable = shopHeight - vh;

                if (shopScrollable > 0) {
                    const shopProgress = (scrollY - shopTop) / shopScrollable;

                    // If user stopped mid-wave drawing (between 3% and 50% scroll)
                    if (shopProgress > 0.03 && shopProgress < 0.50) {
                        isProgrammaticSnap.current = true;

                        const targetY = (scrollDirection.current === "down" || shopProgress >= 0.08)
                            ? Math.round(shopTop + 0.52 * shopScrollable)
                            : Math.round(shopTop);

                        scrollTo(targetY, {
                            duration: 0.9,
                            onComplete: () => {
                                isProgrammaticSnap.current = false;
                            },
                        });
                        return;
                    }
                }
            }
        };

        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current) {
                scrollDirection.current = "down";
            } else if (currentY < lastScrollY.current) {
                scrollDirection.current = "up";
            }
            lastScrollY.current = currentY;

            // Debounce scroll rest detection (~160ms)
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(checkAndAutoComplete, 160);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("wheel", handleUserInteraction, { passive: true });
        window.addEventListener("touchstart", handleUserInteraction, { passive: true });
        window.addEventListener("touchmove", handleUserInteraction, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleUserInteraction);
            window.removeEventListener("touchstart", handleUserInteraction);
            window.removeEventListener("touchmove", handleUserInteraction);
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [scrollTo]);

    return (
        <div
            ref={clusterRef}
            className="relative z-10 w-full bg-[#000000] overflow-x-clip"
        >
            {/* ─── Section 1: Clean Frameless Hero Video Studio ─── */}
            <HeroSection />

            {/* ─── Section 2: Editorial Statement & Shop CTA ─── */}
            <ShopCTASection />
        </div>
    );
}
