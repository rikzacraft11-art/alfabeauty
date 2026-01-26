# Disaster Recovery Plan (DRP)

**System**: Alfa Beauty Cosmetica B2B Platform
**Version**: 1.0
**Framework**: ISO 22301 / ITIL 4 (Service Continuity Management)

## 1. Objectives

- **RTO (Recovery Time Objective)**: 4 Hours (Max downtime).
- **RPO (Recovery Point Objective)**: 1 Hour (Max data loss).

## 2. Infrastructure Inventory

| Component | Provider | Criticality | Fallback Strategy |
| :--- | :--- | :--- | :--- |
| **Compute / CDN** | Vercel (Edge) | High | Redeploy to Docker/VPS via GitHub Actions. |
| **Database** | Supabase (AWS) | Critical | Automated Backups + Email-Only Fallback Mode. |
| **DNS** | Cloudflare/Vercel | Medium | Switch Nameservers. |

## 3. Recovery Scenarios

### A. Vercel Outage (Compute Failure)

**Symptoms**: HTTP 5xx errors, Site Unreachable.
**Response**:

1. **Alert**: Check Vercel Status Page.
2. **Mitigation**:
    - If Edge functions failing: Deploy non-Edge build (remove `runtime: 'edge'`).
    - If Total Outage: Build Docker image (`docker build -t frontend .`) and deploy to generic VPS (DigitalOcean/AWS).
3. **Restoration**: Switch DNS record to VPS IP.

### B. Supabase Outage (Data Failure)

**Symptoms**: Lead submission fails, Product pages show stale data.
**Response**:

1. **Lead Capture**:
    - System automatically enters **"Fail-Open Mode"** (detected via `src/app/actions/submit-lead.ts`).
    - Leads are sent via Email (SMTP) directly.
    - **Action**: Monitor `logger.warn` for "Email Fallback" events.
2. **Product Catalog**:
    - Static pages (SSG) continue to serve cached content.
    - **Action**: Halt "Revalidation" until Database restores.

### C. Malicious Attack (DDoS / Defacement)

**Symptoms**: High traffic spike, weird content.
**Response**:

1. **Vercel Firewall**: Enable "Under Attack Mode" (Challenge).
2. **WAF Rules**: Block suspect IPs via `middleware.ts` or Vercel Config.
3. **Rollback**: Instant Revert via Vercel Dashboard to previous deployment.

## 4. Backup Strategy

- **Code**: GitHub (Distributed).
- **Data (Supabase)**:
  - Point-In-Time Recovery (PITR): Enabled (7 Days).
  - Daily Full Backups: 03:00 WIB.

## 5. Testing

- **Drill Frequency**: Annually.
- **Next Drill**: Q3 2026.
