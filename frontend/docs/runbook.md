# Operational Runbook: B2B Platform (Paket A)

**System**: PT. Alfa Beauty Cosmetica - Frontend
**Frameworks**: ITIL 4 (Operations), COBIT 2019 (DSS01 - Manage Operations)

## 1. Deployment Procedures

### Production Deployment

The application is designed to be deployed on Vercel or any Docker-compatible infrastructure.

#### A. Vercel (Recommended)

1. **Push to `main`**: CI/CD pipeline (GitHub Actions) runs automatically.
2. **Quality Gate**: `Lint`, `Type`, `Unit`, `E2E` jobs must pass.
3. **Automatic Deploy**: Vercel picks up the commit and builds.
4. **Verification**: Check `npm run build` status in Vercel logs.

#### B. Docker / Container

1. Build image: `docker build -t alfa-frontend .`
2. Run container: `docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=... alfa-frontend`

### Environment Variables

Ensure these keys are present in the Production Environment:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` (For Backend)

## 2. Monitoring & Observability

### Logging (OPS-01)

- **Format**: JSON Structured Logs.
- **Location**: Stdout (Container Logs) or Vercel Runtime Logs.
- **Key Events**:
  - `[INFO] Service Worker registered`
  - `[INFO] Newsletter Subscription (Mock)`
  - `[ERROR] Service Worker registration failed`

### Error Tracking (Sentry)

- Check **Sentry Dashboard** for unhandled exceptions.
- **Critical Alerts**:
  - `500 Internal Server Error` on Server Actions.
  - Hydration Mismatches (React 19).

## 3. Incident Response

### Scenario A: Site Offline / "You are offline" Banner Persists

- **Trigger**: User reports Red/Yellow banner is stuck.
- **Cause**: Client network down or flaky connection.
- **Resolution**: Ask user to check internet. If widespread, check CDN status.

### Scenario B: Lead/Newsletter Submission Fails

- **Trigger**: User sees "Something went wrong" toast.
- **Diagnosis**: Check Logs for `[ERROR]`.
- **Fix**: Verify Supabase connection string. If Mock mode, verify `logger.info` is outputting.

### Scenario C: CI/CD Build Failure

- **Trigger**: GitHub Action fails on `build` job.
- **Fix**:
    1. Check `eslint` errors in **Quality Gate**.
    2. Check `sentry-upload` failures (Auth Token missing?).
    3. Run `npm run build` locally to reproduce.
