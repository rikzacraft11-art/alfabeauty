# PT. Alfa Beauty Cosmetica B2B Platform

Order Facilitation Platform for B2B Distribution

## Tech Stack

- **Backend:** Go 1.22 + Fiber v2
- **Database:** PostgreSQL 17.6 (Managed)
- **Cache:** Redis Cloud Flex
- **Auth:** JWT (HS256)

## Quick Start

### Prerequisites

- Go 1.22+
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

## Environment Variables

See `.env.example` for required configuration.

## Smoke test (notifications)

Run `make smoke-notify` to validate the lead notification pipeline end-to-end without external providers.
It uses a local fake SMTP server and a local webhook receiver, while writing outbox state to `DATABASE_URL`.

Cleanup is automatic unless `SMOKE_KEEP=true`.

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
