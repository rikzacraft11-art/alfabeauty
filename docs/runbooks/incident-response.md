# Incident Response Runbook (SOP)

**Status:** Live
**Scope:** Website (Next.js), Lead API, Database

## Severity Levels

| Level | Definition | Response Time | Slack Channel |
|---|---|---|---|
| **SEV1** | **Critical:** Site Down, Lead Form Broken, Data Leak | 15 mins | `#ops-critical` |
| **SEV2** | **High:** CSS Broken, Images Missing, High Latency | 2 hours | `#ops-alerts` |
| **SEV3** | **Low:** Typo, Minor Bug, Analytics missing | 24 hours | `#dev-team` |

## Response Procedures

### 1. SEV1: Site Down / 500 Errors
1. **Acknowledge:** Post in `#ops-critical` "Investigating SEV1 - [Your Name]".
2. **Check Status:**
   - Vercel Status Page.
   - Supabase Status Page.
3. **Logs:** Check Vercel Logs for "Error" level.
4. **Rollback:** If caused by recent deploy, Instant Rollback on Vercel Dashboard.
5. **Communicate:** Email stakeholders if downtime > 30 mins.

### 2. SEV1: Lead Form Failure (DB Down)
1. **Verify Fallback:** Check if Email Fallback is working (Check SMTP logs).
2. **Enable Maintenance Mode:** If needed, set `MAINTENANCE_MODE=true` in Vercel.
3. **Investigation:** Check Supabase Connection Pool.

### 3. Post-Mortem
- Create "Post-Incident Report" (PIR) within 24h.
- Root Cause Analysis (5 Whys).
- Create Jira tickets for prevention.

## Contacts

- **Tech Lead:** [Name] (Phone)
- **DevOps:** [Name] (Phone)
- **Supabase Support:** support@supabase.com (Priority Support)
