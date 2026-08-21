"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface ShopHeaderProps {
    title: string;
    searchQuery: string;
    isSearchOpen: boolean;
    onSearchChange: (query: string) => void;
    onToggleSearch: () => void;
    onClearSearch: () => void;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
    title,
    searchQuery,
    isSearchOpen,
    onSearchChange,
    onToggleSearch,
    onClearSearch,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <div className="s-header relative flex min-h-[72px] items-center justify-between border-b border-border/40 pb-6 pt-10 sm:min-h-[96px] sm:pb-8 sm:pt-14">
            {/* Title / Search Input In-Place Transformation */}
            <div className="relative flex-1 overflow-hidden pr-6">
                <AnimatePresence mode="wait">
                    {!isSearchOpen ? (
                        <motion.h1
                            key="title"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                        >
                            {title}
                        </motion.h1>
                    ) : (
                        <motion.div
                            key="search-input"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="s-search relative flex w-full items-center"
                        >
                            <label htmlFor="shop-search" className="sr-only">
                                Search products
                            </label>
                            <input
                                ref={inputRef}
                                id="shop-search"
                                name="shop-search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search products, brands, active ingredients..."
                                aria-label="Search products"
                                className="w-full bg-transparent font-serif text-2xl font-light tracking-tight text-foreground outline-none placeholder:text-muted-foreground/60 sm:text-3xl lg:text-4xl"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* In-Place Search Toggle Button */}
            <div className="flex items-center shrink-0">
                <button
                    onClick={onToggleSearch}
                    className="s-search-toggle group relative flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                    aria-label={isSearchOpen ? "Close search" : "Open search"}
                    title={isSearchOpen ? "Close search" : "Open search"}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isSearchOpen ? (
                            <motion.span
                                key="close-icon"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="h-5 w-5" />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="search-icon"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Search className="h-5 w-5" />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );
};
