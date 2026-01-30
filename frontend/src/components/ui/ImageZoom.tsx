"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type ImageZoomProps = {
    src: string;
    alt: string;
    className?: string;
};

/**
 * ImageZoom: Product image with smooth zoom on hover/click.
 * DEV-43: Product image zoom interaction.
 * Design V2: Elegant zoom reveals product detail.
 */
export default function ImageZoom({ src, alt, className = "" }: ImageZoomProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePos({ x, y });
    };

    const handleClick = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <>
            {/* Thumbnail with hover zoom */}
            <div
                ref={containerRef}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMousePos({ x: 0.5, y: 0.5 })}
                className={`relative overflow-hidden cursor-zoom-in ${className}`}
            >
                <motion.div
                    animate={{
                        scale: isZoomed ? 1 : 1,
                        x: `${(0.5 - mousePos.x) * 10}%`,
                        y: `${(0.5 - mousePos.y) * 10}%`,
                    }}
                    transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
                    className="w-full h-full"
                >
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </motion.div>

                {/* Zoom indicator */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full type-legal text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to enlarge
                </div>
            </div>

            {/* Fullscreen modal */}
            <AnimatePresence>
                {isZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsZoomed(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-[90vw] h-[90vh]"
                        >
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                className="object-contain"
                                sizes="90vw"
                                priority
                            />
                        </motion.div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute top-6 right-6 p-3 rounded-full bg-panel border border-border hover:bg-subtle transition-colors"
                            aria-label="Close zoom"
                        >
                            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
