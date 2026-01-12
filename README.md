# PT. Alfa Beauty Cosmetica B2B Platform

Order Facilitation Platform for B2B Distribution

## Tech Stack

- **Backend:** Go 1.24 + Fiber v2
- **Database:** PostgreSQL 17.6 (Managed)
- **Cache:** Redis Cloud Flex
- **Auth:** JWT (HS256)

## Quick Start

### Prerequisites

- Go 1.24+
- Docker & Docker Compose
- Make

### Development

```bash
# Install dependencies
go mod download

# Start local database
docker-compose up -d

# Run migrations
make migrate-up

# Start server
make run
```

### Available Commands

```bash
make run          # Run the server
make build        # Build binary
make test         # Run tests
make migrate-up   # Apply migrations
make migrate-down # Rollback migrations
make migrate-status # Show migration status
make db-check     # Verify DB hardening & schema
make smoke-notify # End-to-end smoke for notification pipeline (uses DATABASE_URL)
make smoke-http   # Read-only deployment smoke (health + honeypot lead + admin stats + metrics)
make metrics-check # Verify /metrics contains required metric names (admin-protected)
```

## Project Structure

```
├── cmd/server/         # Application entry point
├── internal/
│   ├── domain/         # Business entities
│   ├── service/        # Business logic
│   ├── handler/        # HTTP handlers
│   └── repository/     # Data access
├── pkg/                # Reusable packages
├── migrations/         # SQL migrations
├── docs-paket-a/       # Documentation (Paket A: Website)
└── docs-paket-b/       # Documentation (Paket B: B2B Digital Hub Platform)
```

## API Documentation

Health check: `GET /health`

API Base URL: `/api/v1`

### Admin endpoints (ops)

All admin endpoints require `X-Admin-Token` (or `Authorization: Bearer <token>`).

- `GET /api/v1/admin/leads.csv` — export leads as CSV
- `GET /api/v1/admin/lead-notifications` — list outbox items (filterable)
- `GET /api/v1/admin/lead-notifications/stats` — backlog summary (counts per status + oldest ready pending age)

### Metrics (Prometheus)

- `GET /metrics` — Prometheus metrics for lead pipeline + outbox (admin-protected)

### Observability (logs + trace correlation)

- The server and operator CLIs emit **structured JSON logs** (one line per event) via `internal/obs`.
- `event` is the stable signal name (low-cardinality). `fields` carries minimal context (avoid PII).

HTTP requests support minimal W3C correlation via `traceparent`:

- If an incoming request includes `traceparent`, it is preserved.
- Otherwise, the server generates one and echoes it back in the response header.

HTTP duration histograms may also attach **exemplars** with `trace_id` (derived from `traceparent`) to support drill-down from latency spikes to correlated logs, without adding high-cardinality metric labels.

## Environment Variables

See `.env.example` for required configuration.

Notes:

- `.env` is **ignored by git** (use it for local/dev only; never commit real secrets).
- `LEAD_API_ADMIN_TOKEN` is required (dev-only value is OK locally).
- In non-development (`APP_ENV!=development`), `DATABASE_URL` is **required** to enforce durable lead persistence.

## Smoke test (notifications)

Run `make smoke-notify` to validate the lead notification pipeline end-to-end without external providers.
It uses a local fake SMTP server and a local webhook receiver, while writing outbox state to `DATABASE_URL`.

Safety:

- This smoke test **writes to the database** (creates a single tagged lead + outbox rows) and then **cleans up by default**.
- To prevent accidental execution against a production user database, it requires `SMOKE_ALLOW_DB_WRITE=true`.
- Cleanup is performed even when the smoke test fails (to avoid leaving test rows behind).

Cleanup is automatic unless `SMOKE_KEEP=true`.

## Deployment smoke (read-only)

Run `make smoke-http` to verify main endpoints **without writing user data**.

It checks:
- `GET /health` (200)
- `POST /api/v1/leads` with honeypot field `company` set (expects 202; should not persist)
- `GET /api/v1/admin/lead-notifications/stats` (200, requires admin token)
- `GET /metrics` (200, requires admin token)

Required env:
- `SMOKE_BASE_URL` (example: `https://your-domain.example`)
- `SMOKE_ADMIN_TOKEN` (or reuse `LEAD_API_ADMIN_TOKEN`)

Safety guard:
- If `SMOKE_BASE_URL` is `http://...`, you must also set `SMOKE_ALLOW_INSECURE=true`.

## Prometheus (local, no domain)

If you haven't bought a domain yet, you can still access Prometheus locally.

This repo includes a minimal Prometheus setup that runs on your machine and scrapes the Lead API
via `host.docker.internal` (Docker Desktop). It does **not** require a domain.

Files:
- `docker-compose.prometheus.yml`

Optional reference files (not required by compose, but useful as reference):
- `prometheus/prometheus.yml`
- `prometheus/secrets/lead_api_admin_token.example`

Steps (high level):
1) Run the Lead API on your host (default `PORT=8080`).
2) Set `LEAD_API_ADMIN_TOKEN` in your shell environment (Prometheus will use it to access `/metrics`).
3) Start Prometheus with Docker Compose.
4) Open Prometheus UI at `http://localhost:9090` and check:
	- `Status -> Targets` (or `/targets`) shows job `alfab-lead-api` as **UP**.

## Documentation

### Paket A — Website

- [Paket A (single canonical spec)](docs-paket-a/paket-a.md)
- [Docs entry](docs-paket-a/README.md)

### Paket B — B2B Digital Hub Platform

- [Blueprint](docs-paket-b/blueprint.md)
- [Database ERD](docs-paket-b/database_erd.md)
- [FSD/IDD](docs-paket-b/fsd-idd.md)
- [DevOps](docs-paket-b/devops.md)
- [UAT](docs-paket-b/uat.md)

## License

Proprietary - PT. Alfa Beauty Cosmetica
