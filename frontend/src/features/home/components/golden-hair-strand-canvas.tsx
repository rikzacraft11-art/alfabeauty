"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────
 * GoldenHairStrandCanvas (2.5D Reverse Diagonal Hair Strand Flow)
 * Travels from Top-Right Section 1 (Hero) to Bottom-Left Section 2 (Shop CTA)
 * with cinematic depth of field blur and floating parallax.
 * ───────────────────────────────────────────────────────────────────── */
export function GoldenHairStrandCanvas({
    containerRef,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>;
}): React.JSX.Element {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // 2.5D Fluid floating parallax drifting naturally along the reverse diagonal axis
    const translateY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
    const translateX = useTransform(scrollYProgress, [0, 1], [20, -20]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.02, 0.99]);

    return (
        <motion.div
            style={{
                y: translateY,
                x: translateX,
                scale: scale,
            }}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none overflow-visible will-change-transform"
            aria-hidden="true"
        >
            <div className="relative h-full w-full min-h-[180vh]">
                <Image
                    src="/images/decorations/golden-hair-strand.svg"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center opacity-90"
                />
            </div>
        </motion.div>
    );
}
