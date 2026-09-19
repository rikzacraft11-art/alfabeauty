"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cinematicEase } from "@/shared/lib/motion";

export interface PageTransitionProps {
    children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps): React.JSX.Element {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                ease: cinematicEase,
            }}
        >
            {children}
        </motion.div>
    );
}

