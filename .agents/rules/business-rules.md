# Business Scope & Quantitative Claims Rule

## Mandatory Behavioral Constraints:
1. **Preserve Business Architecture**: Do not modify or expand the core business model defined in `docs/Blueprint.md`.
2. **Prohibit Premature Quantitative Commitments**:
   - Quantitative parameters have **NOT** been finalized between the developer and Pak Edy (the owner).
   - Never write or hardcode specific quantitative commitments in client-facing copy, labels, or error messages.
   - The following are **examples** of unfinalized quantitative parameters (not an exhaustive list):
     - **Specific SLA Durations** (e.g. "≤ 4 hours")
     - **Nominal Opening Packages** (e.g. "Rp1.500.000")
     - **Minimum Purchase Thresholds / Order Limits**
     - **Loyalty Point Multipliers & Quotas**
   - Always use qualitative, neutral descriptions (e.g., "penawaran paket kemitraan salon perdana", "verifikasi oleh tim kemitraan kami pada hari kerja").
3. **Quality Gate**: Every change must maintain 0 ESLint warnings, 0 TypeScript errors, and clean Next.js Turbopack build compilation.
