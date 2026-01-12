# PT. Alfa Beauty Cosmetica - Website Frontend (Next.js)

This folder contains the Paket A website frontend built with Next.js (App Router).

Key behaviors:

- Lead form submits to `/api/leads` (Next.js route handler) which proxies to the Lead API (Go) at `LEAD_API_BASE_URL`.
- Telemetry:
	- `/api/rum` proxies to the Lead API RUM endpoint.
	- `/api/events` proxies to the Lead API analytics endpoint.
- WhatsApp CTA uses env-configured phone/prefill and can fall back to email.

## Environment configuration

Copy `frontend/.env.example` to `frontend/.env.local` and update values.

Important variables:

- `LEAD_API_BASE_URL` (server-side only): Base URL for the Go Lead API.
- `NEXT_PUBLIC_SITE_URL`: Site base URL (used by metadata + sitemap/robots).
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number (accepted formats: `+62...`, `62...`, or local `08...`).
- `NEXT_PUBLIC_WHATSAPP_PREFILL`: Plain text message; will be URL-encoded by the app.
- `NEXT_PUBLIC_FALLBACK_EMAIL`: Optional email shown as fallback CTA.

## Local development

### Run frontend

From this folder:

```bash
npm install
npm run dev
```

The default dev server port is pinned to 3000.

### Run with backend proxy

Start the Go Lead API separately (repo root). Then ensure `LEAD_API_BASE_URL` points to it.
The frontend will call `/api/leads`, `/api/rum`, and `/api/events` and proxy to the Lead API.

## Smoke: frontend proxy to Lead API

There is a PowerShell smoke script that:

1) starts the Lead API on a chosen port
2) builds + starts the Next.js production server on a chosen port
3) POSTs telemetry to Next.js proxy routes
4) reads `/metrics` from the Lead API and captures evidence

Script:

- `scripts/smoke-frontend-telemetry-proxy.ps1`

Notes:

- If port 3000 is already in use, pass `-FrontendPort 3001` (or another free port).
- The script writes a JSON summary to `tmp/frontend_proxy_smoke.json` and evidence markdown to `artifacts/paket-a/evidence-pack/...`.

