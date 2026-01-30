"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * V2Preloader: Curtain reveal animation on initial load.
 * Design V2 pattern for elegant first impression.
 */
export default function V2Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Simulate minimum loading time for effect
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            // Delay unmount for exit animation
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: isLoading ? 1 : 0 }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
            }}
            style={{ transformOrigin: "top" }}
            className="fixed inset-0 z-[100] bg-foreground flex items-center justify-center"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isLoading ? 1 : 0, scale: isLoading ? 1 : 1.1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <h1 className="type-footer-brand text-background mb-2">ALFA BEAUTY</h1>
                <motion.div
                    className="w-12 h-0.5 bg-background/30 mx-auto overflow-hidden"
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: isLoading ? "100%" : "0%" }}
                        transition={{
                            duration: 0.8,
                            ease: "linear",
                            repeat: isLoading ? Infinity : 0,
                        }}
                        className="w-full h-full bg-background"
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
