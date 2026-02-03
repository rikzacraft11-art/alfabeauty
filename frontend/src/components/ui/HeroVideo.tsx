"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type HeroVideoProps = {
    src: string;
    poster?: string;
    overlayOpacity?: number;
};

/**
 * HeroVideo: Full-screen video background with parallax scroll effect.
 * Video scales up slightly as user scrolls down.
 */
export default function HeroVideo({
    src,
    poster,
    overlayOpacity = 0.55,
}: HeroVideoProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Parallax: video moves slower than scroll
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    // Scale up slightly as scrolling
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

    return (
        <div ref={containerRef} className="hero-video-container">
            <motion.div
                style={{ y, scale }}
                className="absolute inset-0"
            >
                <video
                    className="hero-video motion-reduce:hidden"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={poster}
                    aria-hidden="true"
                >
                    <source src={src} type="video/mp4" />
                </video>

                {/* Fallback for reduced motion */}
                {poster && (
                    <div
                        className="absolute inset-0 bg-cover bg-center motion-safe:hidden"
                        style={{ backgroundImage: `url(${poster})` }}
                        aria-hidden="true"
                    />
                )}
            </motion.div>

            {/* Dark overlay */}
            <div
                className="absolute inset-0 bg-background"
                style={{ opacity: overlayOpacity }}
                aria-hidden="true"
            />
        </div>
    );
}
