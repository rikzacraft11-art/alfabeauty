# Alfa Beauty Cosmetica - B2B Platform (Enterprise Edition)

**Status**: 🟢 **Platinum / Golden Build** (Ready for Production)
**Version**: 1.0.0

This is the **Next.js Hybrid** frontend for Alfa Beauty Cosmetica, engineered to **Enterprise Framework Standards** (ITIL 4, COBIT 2019, TOGAF, ISO 22301).

---

## 📚 Service Catalogue (Documentation)

The following documents govern the operation and maintenance of this platform:

| Category | Document | Framework / Standard |
| :--- | :--- | :--- |
| **Operations** | **[Runbook](./docs/runbook.md)** | ITIL v4 (Service Operation) |
| **Continuity** | **[Disaster Recovery](./docs/drp.md)** | ISO 22301 (Business Continuity) |
| **Observability**| **[Monitoring Guide](./docs/monitoring.md)** | ITIL v4 (Event Management) |
| **Governance** | **[Code Standards](./docs/governance.md)** | COBIT 2019 (DSS06) |
| **Quality** | **[Testing Strategy](./docs/testing.md)** | ISO 29119 |
| **Community** | **[Contributing](./CONTRIBUTING.md)** | Scrum / Trunk-Based Dev |

---

## 🏗 Architecture (TOGAF)

### Technology Stack

- **Framework**: Next.js 15 (App Router, Hybrid Rendering).
- **Styling**: Tailwind CSS v4 + "Zinc" Design Tokens (`globals.css`).
- **Backend**: Supabase (PostgreSQL 15, Auth, Row Level Security).
- **Edge**: Vercel Edge Runtime (Middleware, Headers).

### Resilience Patterns

1. **Fail-Open Lead Capture**: If Database fails, leads are routed via SMTP (Email Fallback).
2. **Rate Limiting**: In-Memory Token Bucket prevents DDoS/Spam (`src/actions/submit-lead.ts`).
3. **Crash Safety**: `global-error.tsx` catches React hydration failures with Error Correlation IDs.

---

## ⚖️ Legal & Compliance (UU PDP)

This platform adheres to **Indonesian Law** and International Privacy Standards:

- **Privacy Policy**: Compliant with **UU No. 27 Tahun 2022 (PDP)**. Bilingual (ID/EN).
- **Terms of Service**: Explicit B2B clauses ("No Public Pricing", "Professional Use Only").
- **Consent**: GDPR-compliant Cookie Banner with `localStorage` preference saving.
- **Reporting**: `security.txt` (RFC 9116) available at `/.well-known/security.txt`.

---

## 🚀 Operations

### Quick Start

```bash
# 1. Install
npm ci

# 2. Environment
cp .env.example .env.local

# 3. Dev
npm run dev
```

### Key Scripts

| Command | Description | Phase |
| :--- | :--- | :--- |
| `npm run analyze` | Visualize JS bundle topology | Phase 11 (DevX) |
| `npm run test:all`| Run Lint, Types, Unit, and E2E tests | Phase 8 (CI/CD) |
| `npm run lint:tokens` | Audit CSS for unauthorized colors | Phase 5 (Governance) |

### Automation

- **Dependabot**: Checks for `npm` and `github-actions` updates daily (`.github/dependabot.yml`).
- **CI/CD**: GitHub Actions pipeline for Quality, Security, and E2E Testing.

---

**Copyright © 2026 PT. Alfa Beauty Cosmetica. All Rights Reserved.**
