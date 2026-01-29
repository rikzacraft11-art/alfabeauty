# Data Architecture Specification

**Framework**: TOGAF (Data Architecture)
**Scope**: Data Models, Schema, and Migration Strategy.

---

## 1. Canonical Data Model (CDM)

### Product (Catalog)

**Source**: `products.json` (Read-Read).

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique ID. |
| `slug` | String | URL-friendly identifier. |
| `category` | Enum | `shampoo`, `treatment`, `styling`, `color`, `grooming`. |
| `brand` | String | Brand Name (e.g., "Makarizo"). |

### Lead (Transactional)

**Source**: Supabase `leads` table.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key. |
| `email` | String | Unique, Verified. |
| `company` | String | Business Name. |
| `intent` | Enum | `distribution`, `salon_use`. |
| `status` | Enum | `new`, `contacted`, `converted`. |

---

## 2. Schema Evolution (Migration)

**Strategy**: Strangler Fig Pattern.
**Current State**: Hybrid (JSON Catalog + SQL Leads).
**Target State (2027)**: Full SQL.

### Phase 1: Hybrid (Current)

* Product Data: Static JSON (Fast, Zero Latency).
* Lead Data: PostgreSQL (Secure, RLS).

### Phase 2: Migration (Trigger: > 1000 SKUs)

1. Create `products` table in Supabase.
2. Run `scripts/migrate-products.ts`.
3. Switch `catalog.ts` to read from DB.

---

## 3. Data Governance

* **Access**: RLS Policy ensures `anon` key can `INSERT` leads but NOT `SELECT`.
* **Backup**: Daily Snapshot (Supabase).
* **Retention**: 3 Years.
