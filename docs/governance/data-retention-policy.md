# Data Retention Policy

**Effective Date:** 2026-01-26
**Owner:** Data Protection Officer (DPO)

## 1. Purpose

To ensure compliance with GDPR (Art 5.1.e) and local privacy laws regarding storage limitation.

## 2. Retention Schedules

| Data Category | Retention Period | Reason |
|---|---|---|
| **Lead Data** | 2 Years | Business Qualification Cycle |
| **Access Logs** | 30 Days | Security Auditing (ISO 27001) |
| **Backup Snapshots** | 30 Days | Disaster Recovery |
| **Application Logs** | 14 Days | specific Troubleshooting |

## 3. Deletion Process

- **Automated:** Database backups expire via Supabase PITR policy (configurable).
- **Manual:** Leads older than 2 years are purged quarterly via SQL job.

## 4. Exception

Data may be retained longer for:
- Ongoing legal proceedings.
- Financial auditing (Tax Law).
