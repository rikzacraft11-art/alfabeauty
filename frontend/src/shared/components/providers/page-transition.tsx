"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cinematicEase } from "@/shared/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
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

