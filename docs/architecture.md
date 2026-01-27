# System Architecture (C4 Model)

## 1. Context Diagram

```mermaid
graph TB
    User[Professional Salon Owner]
    
    subgraph "Alfa Beauty Digital Ecosystem"
        WebApp[B2B Web Platform]
        Email[Email Service]
    end
    
    User -->|Visits| WebApp
    WebApp -->|Sends Lead| Email
```

## 2. Container Diagram

```mermaid
graph TB
    Browser[Web Browser]
    
    subgraph "Vercel Cloud"
        CDN[Edge Network]
        EdgeFn[Middleware / Edge Functions]
        NextServer[Next.js App Server]
    end
    
    subgraph "Supabase (AWS)"
        Postgres[PostgreSQL DB]
    end
    
    subgraph "External"
        BrandFetch[BrandFetch CDN]
        Google[Google Analytics]
    end

    Browser -->|HTTPS| CDN
    CDN --> EdgeFn
    EdgeFn -->|RSC Payload| NextServer
    NextServer -->|Query| Postgres
    Browser -->|Load Images| BrandFetch
    Browser -->|Tracking| Google
```

## 3. Technology Stack

- **Frontend:** Next.js 16 (App Router), React Server Components.
- **Styling:** Tailwind CSS 4.
- **State:** Server-Driven (URL as State).
- **Database:** Supabase (PostgreSQL).
- **Validation:** Zod (Strict Schema).
- **Monitoring:** Sentry, Vercel Analytics.

## 4. Strategic Alignment

This architecture is governed by the [2026 Strategic Framework](../docs/strategy-2026.md), aligning with:

- **ITIL 4**: For Service Level Management (Availability).
- **COBIT 2019**: For Governance and Data Protection (UU PDP).
- **TOGAF**: For Modular, Decoupled Architecture.
- **Jamstack**: For Performance and Operational Efficiency.
