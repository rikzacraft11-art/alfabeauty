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
 * StandardsSection (Calvin Klein Clean Editorial Quality Standards)
 * ───────────────────────────────────────────────────────────────────── */
export function StandardsSection(): React.JSX.Element {
    return (
        <section className="section section-standards bg-background bg-tactile-luxury py-20 sm:py-28 lg:py-36 text-foreground border-b border-border-warm/60">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                {/* Header */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 pb-14 sm:pb-16 items-baseline border-b border-border-warm/40">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#ba181b] mb-2">
                            Rigorous Compliance
                        </p>
                        <h2 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.2rem] font-light sm:font-normal tracking-[-0.02em] text-foreground">
                            Quality & Product Standards
                        </h2>
                    </div>
                    <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-muted-foreground/90 font-normal">
                        Our European and domestic laboratory partners share our commitment to safety and ethics, ensuring every salon product is held to the highest regulatory standards.
                    </p>
                </div>

                {/* 2-Column Minimalist List with Line Dividers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 pt-4">
                    {STANDARDS.map((item, idx) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between py-4 sm:py-5 border-b border-border-warm/60 group transition-colors hover:border-black"
                        >
                            <span className="text-[14.5px] sm:text-[16px] font-normal tracking-[-0.01em] text-foreground transition-colors group-hover:text-[#ba181b]">
                                {item.name}
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
