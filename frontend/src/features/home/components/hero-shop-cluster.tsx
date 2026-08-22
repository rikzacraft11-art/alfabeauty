"use client";

import * as React from "react";
import { HeroSection } from "./hero";
import { ShopCTASection } from "./shop-cta-section";

/* ─────────────────────────────────────────────────────────────────────
 * HeroShopCluster
 * Unifies Section 1 (Hero) and Section 2 (Shop CTA) into a continuous
 * pure black (#000000) canvas with serene quiet luxury aesthetics.
 * Section 1 is 100% clean & commanding with frameless video & backlight.
 * Section 2 features the right-aligned editorial statement with balanced
 * left-side golden silk accent.
 * ───────────────────────────────────────────────────────────────────── */
export function HeroShopCluster(): React.JSX.Element {
    const clusterRef = React.useRef<HTMLDivElement>(null);

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
