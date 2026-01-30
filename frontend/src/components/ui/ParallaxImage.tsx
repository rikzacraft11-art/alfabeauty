"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

type ParallaxImageProps = {
    src: string;
    alt: string;
    className?: string;
    speed?: number; // 0.1 = subtle, 0.5 = dramatic
};

/**
 * ParallaxImage: Image with scroll-based parallax effect.
 * Design V2 pattern for elegant visual depth.
 */
export default function ParallaxImage({
    src,
    alt,
    className = "",
    speed = 0.2,
}: ParallaxImageProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [`${speed * -100}%`, `${speed * 100}%`]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div style={{ y }} className="absolute inset-0 scale-125">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </motion.div>
        </div>
    );
}
