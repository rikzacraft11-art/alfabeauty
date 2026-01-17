"use client";

import { useCallback, useState } from "react";

/**
 * Custom hook for managing mobile menu state
 * 
 * Handles open/close state and sub-level navigation.
 * Follows Single Responsibility Principle - only manages menu state.
 */
export function useMobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [subLevel, setSubLevel] = useState<string | null>(null);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setSubLevel(null);
    }, []);

    const toggle = useCallback(() => {
        setIsOpen((prev) => {
            if (prev) setSubLevel(null);
            return !prev;
        });
    }, []);

    const enterSubLevel = useCallback((key: string) => {
        setSubLevel(key);
    }, []);

    const exitSubLevel = useCallback(() => {
        setSubLevel(null);
    }, []);

    return {
        isOpen,
        subLevel,
        open,
        close,
        toggle,
        enterSubLevel,
        exitSubLevel,
    };
}

export type UseMobileMenuReturn = ReturnType<typeof useMobileMenu>;
