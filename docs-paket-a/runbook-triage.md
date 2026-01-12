# Runbook Triage (Paket A) — Signals → Logs → Trace Correlation

This runbook complements `docs-paket-a/paket-a.md` (§Ops/Runbook) with a single, fast procedure to go from:

1) **Alert / metric spike**
2) → **the right log events**
3) → **trace correlation** (via `traceparent` and Prometheus exemplars)

## Quick rules

- Do not debug from request bodies. Logs must stay **PII-safe**.
- Prefer **low-cardinality metrics** and event-style logs.
- Trace correlation is via:
  - HTTP middleware that ensures a `traceparent` header exists.
  - Logs that include `fields.trace` (the traceparent string).
  - Prometheus **exemplars** attached to selected histograms.

## 1) Lead intake issues

### Symptoms
- Increased `lead_api_lead_submissions_total{result="invalid"}`
- Increased `lead_api_lead_submissions_total{result="internal"}`
- Increased HTTP 4xx/5xx (from `lead_api_http_requests_total`)

### What to check

1. **Errors by route**
   - `sum by (route, status_class) (rate(lead_api_http_requests_total[5m]))`

2. **Latency by route**
   - P95 example:
     - `histogram_quantile(0.95, sum by (le, route, method) (rate(lead_api_http_request_duration_seconds_bucket[5m])))`

3. **Correlate spike to traces/logs**
   - The histogram `lead_api_http_request_duration_seconds` may carry exemplars.
   - In Prometheus UI (or Grafana Explore), click exemplar dots on the graph; copy `trace_id`.

> Note: `trace_id` is attached as an *exemplar*, not as a metric label. Querying like `...{trace_id="..."}` will not work; use exemplar UI.

4. **Find the corresponding log lines**
   - Logs include `fields.trace` (the full `traceparent`).
   - If you only have `trace_id` from exemplar, search logs for the trace id substring.

## 2) Notification/outbox pipeline issues

### Key metrics

- Outbox backlog (gauges):
  - `lead_api_lead_notifications_count{status="pending"|"processing"|"sent"|"failed"}`
  - `lead_api_lead_notifications_pending_ready_total`
  - `lead_api_lead_notifications_pending_delayed_total`
  - `lead_api_lead_notifications_oldest_ready_pending_age_seconds`

- Enqueue performance (request-scoped):
  - `lead_api_lead_notification_enqueue_total{channel,result}`
  - `lead_api_lead_notification_enqueue_duration_seconds{channel,result}` (may carry exemplars)

- Worker send performance:
  - `lead_api_lead_notification_send_total{channel,result}`
  - `lead_api_lead_notification_send_duration_seconds{channel,result}`

### Log event mapping

| Signal | Likely log events | Meaning |
|---|---|---|
| Enqueue failures rising (`...enqueue_total{result="error"}`) | `lead_notification_enqueue_failed` | Lead was persisted but enqueue failed; manual follow-up may be needed. |
| Backlog stuck / claim errors | `notify_claim_batch_error` | Worker cannot claim jobs (DB issue / lock / permissions). |
| Send errors rising (`...send_total{result="error"}`) | `notify_send_failed` | Provider failure (SMTP/webhook) or network/timeout. |
| Sends with missing channel sender (`...send_total{result="no_sender"}`) | `notify_sender_missing` | Worker misconfigured vs notification rows. |
| Lead lookup failures | `notify_load_lead_failed` | Data inconsistency or DB read issue. |

### Suggested triage flow

1) Confirm backlog health
- If `oldest_ready_pending_age_seconds` increases steadily and `pending_ready_total` > 0, worker is not draining.

2) Check claim loop
- Search logs for `notify_claim_batch_error`.

3) Check send loop
- Search logs for `notify_send_failed` and cluster by `channel`.

4) If enqueue is failing (but lead intake is OK)
- Inspect `lead_notification_enqueue_failed` logs.
- Compare `...enqueue_total{result="error"}` with DB availability and permissions.

### Trace correlation limits in async

- The worker runs outside the originating HTTP request context.
- Without persisting trace context into the outbox rows, worker-side metrics cannot reliably attach exemplars.
- Enqueue metrics can carry exemplars (because they happen within the request-scoped context).

## 3) Where to look (files)

- HTTP trace injection: `internal/handler/traceparent.go`
- HTTP metrics w/ trace: `internal/handler/http_metrics.go`, `pkg/metrics/metrics.go`
- Enqueue metrics + logs: `internal/service/lead_service.go`
- Worker logs + send metrics: `internal/notify/worker.go`
- Admin ops views:
  - `/api/v1/admin/lead-notifications` → `internal/handler/admin_notifications.go`
  - `/api/v1/admin/lead-notifications/stats` → `internal/handler/admin_notifications_stats.go`
