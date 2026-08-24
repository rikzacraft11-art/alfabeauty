"use client";

import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * StandardsSection (Calvin Klein Clean Editorial Quality Standards)
 * Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function StandardsSection(): React.JSX.Element {
    const { dict } = useLanguage();
    const standards = dict.standardsSection?.items ?? [];

    return (
        <section className="section section-standards bg-background bg-tactile-luxury py-12 sm:py-20 lg:py-32 text-foreground border-b border-border-warm/60">
            <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
                {/* Header */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 pb-8 sm:pb-12 items-baseline border-b border-border-warm/40">
                    <div>
                        <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.2rem] font-light sm:font-normal tracking-[-0.02em] text-foreground">
                            {dict.standardsSection.heading}
                        </h2>
                    </div>
                    <p className="text-[14px] sm:text-[15.5px] leading-relaxed text-muted-foreground/90 font-normal">
                        {dict.standardsSection.description}
                    </p>
                </div>

                {/* 2-Column Minimalist List with Line Dividers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 pt-2 sm:pt-4">
                    {standards.map((name, idx) => (
                        <div
                            key={name}
                            className="flex items-center justify-between py-4 sm:py-5 border-b border-border-warm/60"
                        >
                            <span className="text-[14.5px] sm:text-[16px] font-normal tracking-[-0.01em] text-foreground">
                                {name}
                            </span>
                            <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
                                0{idx + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
