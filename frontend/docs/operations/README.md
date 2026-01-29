# Operations Handbook (ITIL 4)

**Framework**: ITIL 4 (Service Management) & ISO 22301 (Business Continuity)
**Scope**: Ongoing maintenance, monitoring, and incident response for Alfa Beauty B2B.

---

## 1. Service Catalogue (Request Fulfillment)

**Base URL**: `https://alfabeauty.co.id/api`

| Service | Endpoint | SLA (P95) | Dependencies |
| :--- | :--- | :--- | :--- |
| **Lead Capture** | `/leads` | < 1000ms | Supabase, Resend |
| **Product List** | `/products` | < 500ms | Supabase, Redis (Cache) |
| **Health Check** | `/health` | < 200ms | None |
| **Analytics** | `/rum` | Async | Vercel Analytics |

---

## 2. Monitoring & Observability (Event Management)

**Tools**:

* **Errors**: Sentry (DSN configured in `sentry.server.config.ts`).
* **Vitals**: Vercel Analytics (LCP, CLS, INP).
* **Uptime**: UptimeRobot (checking `/api/health`).

**Thresholds**:

* **Sev1 (Critical)**: Global outage, Lead Form broken. -> Alert Slack immediately.
* **Sev2 (High)**: API > 5s latency, Elevated error rate (>5%).

---

## 3. Incident Response (Incident Management)

**Workflow**:

1. **Detect**: Alert fires (Slack/Sentry).
2. **Classify**: Sev1 (Immediate) vs Sev2 (Next Day).
3. **Contain**:
    * If DB down -> Enable "Maintenance Mode" (Env Var).
    * If Bad Deploy -> Vercel "Instant Rollback".
4. **Resolve**: Fix root cause.
5. **Review**: Post-Mortem (RCA) required for Sev1.

---

## 4. Disaster Recovery (ISO 22301)

### Database Restore

* **RPO (Point of Loss)**: < 24 Hours (Daily Backup) or < 1 min (PITR - Enterprise).
* **RTO (Time to Recovery)**: < 60 Minutes.
* **Procedure**:
    1. Login to Supabase Dashboard.
    2. Go to **Database > Backups**.
    3. Select latest valid snapshot.
    4. Click **Restore**.

### Key Rotation

* **Trigger**: Suspected leak or Staff Offboarding.
* **Procedure**:
    1. Regenerate `SUPABASE_SERVICE_ROLE_KEY` in Supabase.
    2. Update Vercel Environment Variables.
    3. Redeploy latest commit to propagate new keys.

### Data Deletion (Privacy)

* **Routine**: Logs deleted after 90 days.
* **User Request**: Execute `DELETE FROM leads WHERE email = $1`.
