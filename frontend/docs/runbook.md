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

### Scenario C: Rate Limit Triggered (429)

- **Trigger**: User reports "Too Many Requests" or `api/health` monitoring fails.
- **Cause**: IP Address has exceeded 100 requests/minute (Token Bucket).
- **Resolution**:
    1. Check `x-forwarded-for` in logs.
    2. If legitimate traffic (NAT/Office), consider whitelisting in `src/app/api/health/route.ts`.

### Scenario D: API/Database Outage (Supabase)

- **Trigger**: Sentry alerts `500` on `submit-lead` or users report "Cannot submit form".
- **Diagnosis**:
    1. Check [Supabase Status](https://status.supabase.com/).
    2. Attempt to log in to Supabase Dashboard.
- **Resolution**:
  - **Step 1**: Enable "Maintenance Mode" if the outage is prolonged (via Environment Variable `NEXT_PUBLIC_MAINTENANCE_MODE=true`).
  - **Step 2**: If the `leads` table is locked, check Supabase "Usage" for Disk/CPU limits.
  - **Step 3 (Planned)**: Activate SMTP fallback (Email-only lead capture) if implemented.

### Scenario E: CMS Content Outage

- **Trigger**: Build fails with `Error: Cannot read properties of undefined` (processing `products.json`).
- **Diagnosis**:
  - Corrupted JSON file in `src/content`.
  - Git merge conflict markers in the file.
- **Resolution**:
    1. Revert the last commit to `src/content`.
    2. Run `npm run dev` locally to validate the JSON structure.

### Scenario F: System Error with Correlation ID

- **Trigger**: User reports error code `digest: <ID>`.
- **Diagnosis**: Search logs for `requestId: <ID>` or `digest: <ID>`.
- **Action**: The ID correlates the User UI error to the specific Backend Log entry.

### Scenario G: CI/CD Build Failure

- **Trigger**: GitHub Action fails on `build` job.
- **Fix**:
    1. Check `eslint` errors in **Quality Gate**.
    2. Check `sentry-upload` failures (Auth Token missing?).
    3. Run `npm run build` locally to reproduce.

## 4. Data Privacy Operations (APO12 Risk Management)

### Data Deletion Procedure (Right to Erasure)

**Regulation**: UU PDP (Indonesia) / GDPR.

1. **Request Receipt**:
    - Channel: Email to `alfabeautycosmeticaa@gmail.com` or Support Ticket.
    - Verification: Verify identity via Email Confirmation loop.

2. **Execution (Supabase)**:
    - **Dashboard**:
        1. Go to `leads` table.
        2. Filter by `email` or `phone`.
        3. Select row -> `Delete 1 row`.
    - **SQL (Bulk)**:

        ```sql
        DELETE FROM leads WHERE email = 'target@example.com';
        ```

3. **Confirmation**:
    - Reply to user confirming deletion within 72 hours.
    - Log the deletion event (without PII) in the Privacy Log.

## 5. Problem Management (Known Errors Database)

**Classification**: ITIL 4 Problem Management
**Repository**: `docs/known-errors.md` (Virtual)

| Error ID | Symptom | Workaround | Root Cause | Perm Fix Status |
| :--- | :--- | :--- | :--- | :--- |
| **KE-001** | `429 Too Many Requests` on Leads API | Wait 1 minute | Rate Limiting (Map-based) reset time. | **Monitoring** |
| **KE-002** | "Offline" Banner flashes on navigate | Ignore | Service Worker re-validation latency. | **Backlog** |
| **KE-003** | `BLD-04` Font Timeout | Manual refresh | Google Fonts generic timeout during build. | **Wontfix** |

## 6. Security Operations (COBIT 2019 DSS05)

### 6.1 Key Rotation Drill (Mock)

**Log ID**: `SEC-DRILL-2026-001`
**Date**: 2026-01-28
**Target**: `SUPABASE_SERVICE_ROLE_KEY`

**Procedure Log**:

1. [x] Generated new `service_role` key in Supabase (Simulated).
2. [x] Updated Vercel Env Vars (Simulated).
3. [x] Triggered Redeploy `git commit --allow-empty` (Simulated).
4. [x] Verified API connectivity (Simulated).
5. [x] Revoked old key (Simulated).

**Outcome**: Success. No downtime observed in mock scenario.
