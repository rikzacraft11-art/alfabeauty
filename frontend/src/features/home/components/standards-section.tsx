"use client";

import { useLanguage } from "@/shared/components/providers/language-provider";

/* ─────────────────────────────────────────────────────────────────────
 * StandardsSection (Calvin Klein Clean Dark Editorial Quality Standards)
 * Fully localized: 100% ID in ID mode, 100% EN in EN mode.
 * ───────────────────────────────────────────────────────────────────── */
export function StandardsSection(): React.JSX.Element {
    const { dict } = useLanguage();
    const standards = dict.standardsSection?.items ?? [];

    return (
        <section className="section section-standards bg-[#000000] py-12 sm:py-20 lg:py-32 text-white border-b border-white/10">
            <div className="mx-auto w-full max-w-[1720px] px-6 sm:px-10 lg:px-16 xl:px-20">
                {/* Header */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16 pb-8 sm:pb-12 items-baseline border-b border-white/10">
                    <div className="lg:col-span-6">
                        <h2 className="text-[1.85rem] sm:text-[2.6rem] lg:text-[3.2rem] font-light sm:font-normal tracking-[-0.02em] text-white">
                            {dict.standardsSection.heading}
                        </h2>
                    </div>
                    <div className="lg:col-span-6">
                        <p className="text-[14.5px] sm:text-[16px] leading-relaxed text-white/70 font-normal">
                            {dict.standardsSection.description}
                        </p>
                    </div>
                </div>

                {/* 2-Column Minimalist List with Line Dividers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-24 pt-2 sm:pt-4">
                    {standards.map((name, idx) => (
                        <div
                            key={name}
                            className="flex items-center justify-between py-4 sm:py-5 border-b border-white/10"
                        >
                            <span className="text-[14.5px] sm:text-[16px] font-normal tracking-[-0.01em] text-white">
                                {name}
                            </span>
                            <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/40">
                                0{idx + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
