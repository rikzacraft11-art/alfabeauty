"use client";

import * as React from "react";

type Tone = "light" | "dark" | "onImage";

function toneClasses(tone: Tone) {
    switch (tone) {
        case "dark":
            return {
                track: "bg-indicator-fixed/[0.22]",
                thumb: "bg-indicator-fixed",
                dot: "bg-indicator-fixed/[0.55]",
                dotActive: "bg-indicator-fixed",
                ring: "ring-indicator-fixed/[0.35]",
            };
        case "onImage":
            return {
                track: "bg-indicator-fixed/[0.24]",
                thumb: "bg-indicator-fixed",
                dot: "bg-indicator-fixed/[0.55]",
                dotActive: "bg-indicator-fixed",
                ring: "ring-indicator-fixed/[0.35]",
            };
        case "light":
        default:
            return {
                track: "bg-indicator-fixed/[0.22]",
                thumb: "bg-indicator-fixed",
                dot: "bg-indicator-fixed/[0.55]",
                dotActive: "bg-indicator-fixed",
                ring: "ring-indicator-fixed/[0.35]",
            };
    }
}

export function ScrollProgressBar({
    progress,
    thumbRatio,
    tone = "light",
    thickness = "regular",
    trackClassName,
    thumbClassName,
    className,
    ariaLabel,
}: {
    progress: number;
    thumbRatio: number;
    tone?: Tone;
    thickness?: "regular" | "thin";
    trackClassName?: string;
    thumbClassName?: string;
    className?: string;
    ariaLabel?: string;
}) {
    const clampedThumb = Number.isFinite(thumbRatio) ? Math.min(1, Math.max(0, thumbRatio)) : 1;
    const clampedProgress = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;

    // When content fits, keep thumb full-width.
    const span = clampedThumb >= 1 ? 1 : clampedThumb;
    const left = clampedThumb >= 1 ? 0 : clampedProgress * (1 - span);

    const c = toneClasses(tone);
    const h = thickness === "thin" ? "h-[2px]" : "h-1";
    const track = trackClassName ?? c.track;
    const thumb = thumbClassName ?? c.thumb;

    return (
        <div
            className={className}
            role="progressbar"
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(clampedProgress * 100)}
        >
            <div className={`relative w-full rounded-none ${h} ${track}`}>
                <div
                    className={`absolute top-0 rounded-none ${h} ${thumb}`}
                    style={{
                        left: `${left * 100}%`,
                        width: `${span * 100}%`,
                    }}
                />
            </div>
        </div>
    );
}

export function ScrollDots({
    count,
    activeIndex,
    onSelect,
    tone = "onImage",
    className,
    ariaLabel,
}: {
    count: number;
    activeIndex: number;
    onSelect: (index: number) => void;
    tone?: Tone;
    className?: string;
    ariaLabel?: string;
}) {
    const c = toneClasses(tone);

    if (count <= 1) return null;

    return (
        <div
            className={className}
            role="tablist"
            aria-label={ariaLabel}
        >
            {Array.from({ length: count }).map((_, i) => {
                const isActive = i === activeIndex;

                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onSelect(i)}
                        className={`
                            h-1.5 rounded-full transition-all duration-300 ease-out
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60
                            ${isActive ? `w-6 ${c.dotActive}` : `w-1.5 ${c.dot} hover:opacity-80`}
                        `}
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Slide ${i + 1}`}
                        aria-current={isActive ? "true" : "false"}
                        tabIndex={isActive ? 0 : -1}
                    />
                );
            })}
        </div>
    );
}
