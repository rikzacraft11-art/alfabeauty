"use client";

const STANDARDS = [
    { name: "BPOM RI Certified" },
    { name: "EU Cosmetics Regulation No 1223/2009" },
    { name: "Halal MUI / BPJPH" },
    { name: "CPKB / GMP Cosmetics Standard" },
    { name: "ISO 9001:2015 Quality Management" },
    { name: "Dermatologically Tested (Italy & Spain)" },
    { name: "Formaldehyde-Free Rebonding Formula" },
    { name: "Cruelty-Free International Compliant" },
];

/* ─────────────────────────────────────────────────────────────────────
 * StandardsSection (1:1 Yucca Packaging .section-standards)
 * ───────────────────────────────────────────────────────────────────── */
export function StandardsSection(): React.JSX.Element {
    return (
        <section className="section section-standards bg-background py-20 sm:py-28 lg:py-36 text-foreground border-b border-border-warm/60">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* Header */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 pb-14 sm:pb-16 items-baseline">
                    <h2 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.2rem] font-normal tracking-[-0.02em] text-foreground">
                        Quality & Product Standards
                    </h2>
                    <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-muted-foreground/90">
                        Our European and domestic laboratory partners share our commitment to safety and ethics, ensuring every salon product is held to the highest regulatory standards.
                    </p>
                </div>

                {/* 2-Column Minimalist List with Dots and Line Dividers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                    {STANDARDS.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-3 py-4 sm:py-5 border-t border-border-warm/60"
                        >
                            <span className="h-2 w-2 rounded-full bg-foreground shrink-0" aria-hidden="true" />
                            <span className="text-[15px] sm:text-[17px] font-normal tracking-[-0.01em] text-foreground">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
