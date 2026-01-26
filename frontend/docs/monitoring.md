# Operational Monitoring Guide

**Scope**: Observability for Alfa Beauty B2B Platform.

## 1. Health Checks

The application exposes a standard health endpoint for uptime monitors (UptimeRobot, Pingdom, AWS Route53).

- **Endpoint**: `GET /api/health`
- **Response**: `200 OK { "status": "ok" }`
- **Frequency**: Check every 1-5 minutes.

## 2. Structured Logging

Logs are emitted in JSON format via `src/lib/logger.ts` for easy parsing by Datadog/Splunk/CloudWatch.

- **Severity**: `info` (Normal), `warn` (Handled Issues), `error` (Crashes).
- **Key Fields**:
  - `level`: Severity.
  - `message`: Human readable text.
  - `ip_address`: Requestor IP (Anonymized if needed).
  - `error.digest`: Correlation ID for user reports.

## 3. Error Tracking (Sentry)

- **Critical Alerts**:
  - Uncaught Exceptions (Crash).
  - `persistence_failed_critical` (DB & Email both failed - Data Loss Risk).
- **Warning Alerts**:
  - `persistence_failed` (DB down, saved via Email).
  - `rate_limit_exceeded` (Potential DDoS).

## 4. Performance (Web Vitals)

- Real User Monitoring (RUM) is active.
- **Key Metrics**: LCP (<2.5s), INP (<200ms), CLS (<0.1).
- View dashboard in Vercel Analytics / Google Search Console.
