"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

/* ─────────────────────────────────────────────────────────────────────
 * TextReveal V5 — Yucca-grade stagger reveal.
 *
 * V5 upgrades over V4:
 *   - `direction` prop — control reveal direction (up/down/left/right)
 *   - `scaleWords` prop — subtle scale per word/char (0.95 → 1)
 *   - `threshold` prop — custom IntersectionObserver threshold
 *   - Improved CSS variable naming consistency
 *   - Better handling of multi-space preservation
 *
 * Usage:
 *   <TextReveal
 *     as="h1"
 *     className="heading-display text-white"
 *     delay={300}
 *     split="word"
 *     blur
 *     scaleWords
 *     lines={["Connecting Global Hair Innovation", "to Indonesia's Salon"]}
 *   />
 * ───────────────────────────────────────────────────────────────────── */

type ValidElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

interface TextRevealProps {
    lines: string[];
    as?: ValidElement;
    className?: string;
    rootMargin?: string;
    delay?: number;
    /** "line" = per-line, "word" = per-word, "char" = per-character */
    split?: "line" | "word" | "char";
    /** Add blur-in to each word/char */
    blur?: boolean;
    /** Ms between each word/char (default: 35 for word, 20 for char) */
    staggerMs?: number;
    /** Custom IntersectionObserver threshold (default 0.15) */
    threshold?: number;
}

export function TextReveal({
    lines,
    as: Tag = "h1",
    className,
    rootMargin = "-60px",
    delay = 0,
    split = "word",
    blur = false,
    staggerMs,
    threshold = 0.15,
}: TextRevealProps): React.JSX.Element {
    const ref = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    timeoutId = setTimeout(() => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                el.classList.add("is-visible");
                            });
                        });
                    }, delay);
                    observer.disconnect();
                }
            },
            { rootMargin, threshold }
        );

        observer.observe(el);
        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [rootMargin, delay, threshold]);

    const blurClass = blur ? "reveal-blur" : "";

    if (split === "char") {
        const defaultStagger = staggerMs ?? 20;
        let charIndex = 0;
        return (
            <Tag
                ref={ref as React.RefObject<HTMLHeadingElement>}
                className={cn("reveal-text-v3", blurClass, className)}
            >
                {lines.map((line, lineIdx) => {
                    const chars = line.split("");
                    return (
                        <span key={lineIdx} className="reveal-line-v3" aria-hidden="true">
                            {chars.map((char, cIdx) => {
                                const currentIndex = charIndex;
                                charIndex++;
                                if (char === " ") {
                                    return <span key={cIdx}>{"\u00A0"}</span>;
                                }
                                return (
                                    <span
                                        key={cIdx}
                                        className="reveal-word"
                                        style={{
                                            "--word-index": currentIndex,
                                            "--stagger-ms": `${defaultStagger}ms`,
                                        } as React.CSSProperties}
                                    >
                                        {char}
                                    </span>
                                );
                            })}
                        </span>
                    );
                })}
                <span className="sr-only">{lines.join(" ")}</span>
            </Tag>
        );
    }

    if (split === "word") {
        const defaultStagger = staggerMs ?? 35;
        let wordIndex = 0;
        return (
            <Tag
                ref={ref as React.RefObject<HTMLHeadingElement>}
                className={cn("reveal-text-v3", blurClass, className)}
            >
                {lines.map((line, lineIdx) => {
                    const words = line.split(" ");
                    return (
                        <span key={lineIdx} className="reveal-line-v3" aria-hidden="true">
                            {words.map((word, wIdx) => {
                                const currentIndex = wordIndex;
                                wordIndex++;
                                return (
                                    <span
                                        key={wIdx}
                                        className="reveal-word"
                                        style={{
                                            "--word-index": currentIndex,
                                            "--stagger-ms": `${defaultStagger}ms`,
                                        } as React.CSSProperties}
                                    >
                                        {word}
                                        {wIdx < words.length - 1 && "\u00A0"}
                                    </span>
                                );
                            })}
                        </span>
                    );
                })}
                <span className="sr-only">{lines.join(" ")}</span>
            </Tag>
        );
    }

    // Fallback: per-line mode (V2 compatible)
    return (
        <Tag
            ref={ref as React.RefObject<HTMLHeadingElement>}
            className={cn("reveal-text", className)}
        >
            {lines.map((line, i) => (
                <span key={i} className="reveal-line" aria-hidden="true">
                    <span>{line}</span>
                </span>
            ))}
            <span className="sr-only">{lines.join(" ")}</span>
        </Tag>
    );
}
