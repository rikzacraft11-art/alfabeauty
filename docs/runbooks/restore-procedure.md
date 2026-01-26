# Database Restore Procedure

**Scope:** Supabase Database (Leads)
**Role Required:** DevOps / Tech Lead

## Prerequisites

- `psql` or Supabase Dashboard access.
- Backup CSV file (from `backups/`).

## Procedure A: Restore via Supabase Dashboard (Recommended)

1.  **Login:** Go to Supabase Dashboard > Table Editor.
2.  **Select Table:** Choose `leads` table.
3.  **Import:** Click "Import Data" (CSV).
4.  **Map Fields:** Ensure columns match (created_at, business_name, etc).
5.  **Verify:** Check row count matches backup line count.

## Procedure B: Disaster Recovery (Clean Slate)

If the database is corrupted or deleted:

1.  **Re-create Schemas:** Run migration scripts (if available) or create table manually via SQL Editor.
    ```sql
    create table leads (
      id uuid default gen_random_uuid() primary key,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      business_name text not null,
      -- ... other columns
    );
    ```
2.  **Import Data:** Use Procedure A.

## Validation

After restore:
1.  Run `SELECT count(*) FROM leads;`
2.  Submit a test lead via Staging environment to verify write access.
