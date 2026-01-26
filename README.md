# PT. Alfa Beauty Cosmetica B2B Platform

![CI Status](https://github.com/niana24/rid/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Node Version](https://img.shields.io/badge/node-22.x-green)

Website B2B + Lead Capture untuk PT. Alfa Beauty Cosmetica.

## Tech Stack

- **Frontend:** Next.js 16.x + React + TypeScript
- **Runtime:** Node.js 22.x (LTS)
- **Database:** Supabase (PostgreSQL)
- **CMS:** Headless CMS (via Git/JSON)
- **Analytics:** GA4 + Google Search Console
- **Hosting:** Vercel

## Quick Start

### Prerequisites

- Node.js 22.x
- npm 10.x

### Development

```bash
cd frontend
npm install
npm run dev      # Start development server
npm run build    # Build production
npm run lint     # Run linting
npm run test:unit # Run unit tests
npm run test:e2e  # Run smoke tests
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

**Domain:**
- Primary: `alfabeautycosmetica.com`
- Redirect: `alfabeautycosmetica.co` → `.com`

## Project Structure

```
├── frontend/           # Next.js frontend app
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── e2e/            # End-to-end tests (Playwright)
│   └── scripts/        # Build/utility scripts
├── docs/               # Documentation (Single Source of Truth)
│   ├── adr/            # Architecture Decisions
│   ├── governance/     # Policies (DoD, Retention)
│   ├── runbooks/       # Operational Procedures
│   └── infrastructure.md
└── scripts/            # Root-level scripts
```

## Features

- **Katalog Produk:** Filter by brand/fungsi/audience, tanpa harga publik
- **Lead Capture:** Form "Become Partner" dengan validasi + anti-spam
- **WhatsApp CTA:** Deep link + fallback
- **Bilingual:** ID/EN untuk semua halaman
- **SEO:** Meta, sitemap, robots, OpenGraph/Twitter, JSON-LD
- **PWA:** Installable, Offline capabilities

## Documentation

- [Infrastructure](docs/infrastructure.md) — Technical spec & scaling
- [Architecture](docs/architecture.md) — System diagrams
- [Definition of Done](docs/governance/definition-of-done.md) — Quality standards
- [Security Policy](frontend/src/app/%5Blocale%5D/security-policy/page.tsx) — Vulnerability disclosure

## License

Proprietary - PT. Alfa Beauty Cosmetica
