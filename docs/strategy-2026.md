# Strategic Framework Alignment 2026

## PT. Alfa Beauty Cosmetica (B2B Platform)

**Version:** 1.0
**Date:** January 27, 2026
**Scope:** Governance & Architecture Strategy

This document formalizes the strategic alignment of the **Alfa Beauty B2B Platform** with four key enterprise frameworks: **ITIL 4**, **COBIT 2019**, **TOGAF**, and **Jamstack/DevOps**.

This strategy ensures the platform remains scalable, compliant, and operationally excellent without over-engineering (`Right-Sized Governance`).

---

### 1. ITIL 4 (Service Management)

**Focus:** Availability & Incident Management.
**Rationale:** In B2B, platform availability directly impacts revenue and partner trust.

| Practice | Implementation Strategy |
|---|---|
| **Service Level Management** | **99.9% Uptime Goal.** leveraging Vercel's Edge Network. Fallback plans for API outages (e.g., cached products). |
| **Incident Management** | **Fail-Open Design.** If Supabase is down, the static parts of the site (Catalog) must remain accessible. |
| **Change Enablement** | **Preview Deployments.** Every code change is verified in a Vercel Preview environment before Production merge. |

### 2. COBIT 2019 (Governance & Compliance)

**Focus:** Data Protection (UU PDP) & Access Control.
**Rationale:** Handling partner data (Lead Capture) requires strict privacy controls and legal compliance.

| Objective | Implementation Strategy |
|---|---|
| **DSS05 (Managed Security Services)** | **Identity Management.** Strict separation of duties. Supabase `service_role` keys are never exposed to the client. |
| **MEA01 (Monitor, Evaluate and Assess)** | **Audit Trails.** All lead submissions are logged with timestamp and origin. PII in logs is hashed (SHA-256). |
| **AP013 (Manage Security)** | **Zero Trust.** All API endpoints validate input (Zod) and enforce rate limits (Token Bucket) regardless of source. |

### 3. TOGAF (Enterprise Architecture)

**Focus:** Integration & Structural Consistency.
**Rationale:** Ensures the "Hybrid" architecture (Next.js + Supabase) remains clean and modular as the business scales.

| Context | Implementation Strategy |
|---|---|
| **Business Architecture** | **B2B-First.** The system is designed for decision support (Catalog) and lead generation, not retail transactional. |
| **Data Architecture** | **Single Source of Truth.** Product data resides in the Codebase/CMS; Lead data resides in Supabase. No data duplication. |
| **Technology Architecture** | **Composability.** Frontend (Next.js) is decoupled from Backend (Supabase). This allows independent scaling or replacement. |

### 4. Jamstack / DevOps (Technical Efficiency)

**Focus:** Automation, Performance, and Security.
**Rationale:** Use modern tooling to reduce operational overhead ("Serverless Ops").

| Pillar | Implementation Strategy |
|---|---|
| **Pre-rendering** | **Static Generation.** Catalog pages are pre-rendered for maximum speed (LCP) and SEO. |
| **Decoupling** | **API-First.** All dynamic functionality (Leads) is handled via server-side APIs, keeping the client lightweight. |
| **GitOps** | **Automated Pipelines.** `git push` triggers Build -> Test -> Deploy. No manual FTP or server config. |

---

### 5. Implementation Roadmap (2026)

To execute this strategy without bloat, we adhere to the **"Three Pillars"** approach:

#### Pillar 1: Agile (Scrum)

- **Methodology:** 2-Week Sprints.
- **Tooling:** GitHub Projects / Linear.
- **Goal:** Rapid iteration on feature requests (e.g., new product categories).

#### Pillar 2: Jamstack 2.0 (Architecture)

- **Stack:** Next.js 16 + Vercel + Supabase.
- **Goal:** maintain < 2.5s LCP on mobile 4G networks.

#### Pillar 3: ITIL Lite (Operations)

- **Scope:** Incident Management + Change Management ONLY.
- **Goal:** Zero "surprise" downtime. All deployments are visibly tracked.

---

### Approval

- **Approved By:** CTO / Head of Engineering
- **Date:** January 2026

### Verification Record

| Phase | Framework | Status | Evidence |
| :--- | :--- | :--- | :--- |
| **Phase 22** | ITIL/COBIT | **PASS** | Rate Limiting on `api/health` confirmed. |
| **Phase 22** | TOGAF | **PASS** | Security Headers consolidated in `next.config.ts`. |
| **Phase 23** | Jamstack | **PASS** | Dependency audit complete (all critical). |
| **Phase 23** | ITIL | **PASS** | Incident Management workflow (Email+ID) verified. |
