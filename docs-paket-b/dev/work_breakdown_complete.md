# COMPLETE WORK BREAKDOWN WITH DOCUMENT REFERENCES
## PT. Alfa Beauty Cosmetica B2B Digital Hub

**Reference Documents:**
| Code | Document | Version |
|:-----|:---------|:--------|
| BP | [Blueprint](../blueprint.md) | V3.4 |
| ERD | [Database ERD](../database_erd.md) | V2.0 |
| DO | [DevOps](../devops.md) | V2.4 |
| FSD | [FSD-IDD](../fsd-idd.md) | V2.6 |
| GOV | [Governance](../governance.md) | V1.0 |
| RAB | [RAB Infrastruktur](../rab_infrastruktur.md) | V1.0 |
| SLI | [SLI/SLO](../SLI_SLO.md) | V1.0 |
| SOW | [Statement of Work](../sow.md) | V2.5 |
| UAT | [User Acceptance Test](../uat.md) | V2.0 |
| WBS | [Work Breakdown Structure](../wbs.md) | V2.5 |

## IMPORTANT: Mathematical correction + recalibration (2026, non-MVP)

Dokumen ini sebelumnya menuliskan total **297 tasks / 161.5 MD**. Setelah divalidasi terhadap isi tabel pada file ini:

- **Jumlah task yang benar di tabel ini:** **292 tasks**
	- Backend (BE): **102**
	- Frontend (FE): **94**
	- DevOps (DO): **46**
	- QA: **50**
- **Total Effort yang benar jika menjumlahkan kolom Effort per task di tabel ini:** **103.50**

Karena seluruh requirement di `docs-paket-b/` menuntut tingkat penyelesaian yang benar-benar **"selesai"** (bukan MVP) — khususnya:
- **Degraded Mode ERP + Safety Buffer + Weekly Reconciliation** (Blueprint V3.4)
- **UAT sebagai acceptance contract** (UAT V2.0)
- **Governance + observability + resilience patterns** (DevOps V2.4, Governance V1.0, SLI/SLO V1.0)

…maka kolom Effort di tabel ini diperlakukan sebagai **Base Effort Units** (relatif sizing), lalu dikalibrasi menjadi **Recalibrated Man-Days**.

### Recalibration formula

$$

	extbf{Recalibrated\_MD(task)} = \textbf{BaseEffort(task)} \times \textbf{ECF}
$$

Pembulatan untuk kolom per-task:
- Nilai **Recalibrated MD** di tabel task dibulatkan ke **2 desimal** untuk keterbacaan.
- Angka subtotal/total per grup tetap mengikuti perhitungan agregat (Base sum × ECF), sehingga mungkin ada selisih kecil jika menjumlahkan angka yang sudah dibulatkan per-baris.

Dengan:
- **ECF (Engineering Calibration Factor)** = **1.9010**
- ECF dipilih agar total engineering (BE+FE+DO+QA) menjadi **196.75 MD** (dari Base Effort total **103.50**), yaitu baseline yang lebih realistis untuk eksekusi non-MVP dengan maturitas AI-workflow rendah.

### Recalibrated totals (planning numbers)

| Group | Base Effort (sum in this file) | Recalibrated MD (= Base × 1.9010) |
|---|---:|---:|
| Backend (BE) | 34.25 | 65.10 |
| Frontend (FE) | 33.00 | 62.73 |
| DevOps (DO) | 16.50 | 31.37 |
| QA | 19.75 | 37.54 |
| **Engineering Subtotal** | **103.50** | **196.75** |

Tambahan non-itemized (tetap wajib untuk "selesai" sesuai WBS/SoW):

| Non-itemized / Program Work | MD |
|---|---:|
| PM/Architect (WBS V2.5) | 20.00 |
| Partner Profiling program work (WBS V2.5) | 6.00 |
| **Integration & Stabilization Buffer** (15% × Engineering Subtotal) | 29.50 |
| **TOTAL RECALIBRATED (Likely)** | **252.25 MD** |

> Catatan: Buffer dibuat eksplisit agar resiko integrasi (ERP truth-finding, CI failures, E2E flakiness, re-test cycles, observability hardening) tidak "tersembunyi" di task kecil.

---

# BACKEND TASKS

## BE-001 to BE-015: Identity & Access

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| BE-001 | JWT token generation (RS256) | 0.25 | 0.48 | FSD 2.0, DO 4.6 | Actor authentication per FSD-IDD Section 2, Zero Trust per DevOps |
| BE-002 | Refresh token rotation | 0.25 | 0.48 | FSD 2.0 | Session security, prevent token reuse |
| BE-003 | `/api/auth/login` Partner | 0.25 | 0.48 | FSD 2.0, UAT-01 | Partner login flow, returns tier data |
| BE-004 | `/api/auth/login` Agent | 0.25 | 0.48 | FSD 2.0, BP 5.A | Agent access for Shadow Mode |
| BE-005 | `/api/auth/login` Admin | 0.25 | 0.48 | FSD 2.0 | Admin access for configuration |
| BE-006 | Password hashing bcrypt | 0.25 | 0.48 | DO 5.2 | Security mandate: bcrypt with cost factor 12 |
| BE-007 | Logout + token blacklist | 0.25 | 0.48 | FSD 2.0 | Secure session termination |
| BE-008 | Rate limiting auth | 0.25 | 0.48 | SLI 2.A, DO 4.5 | 100 RPS peak per SLI/SLO |
| BE-009 | RBAC middleware | 0.5 | 0.95 | FSD 2.0, ERD PARTNERS | Role-based access: Partner/Agent/Admin/SubDist |
| BE-010 | Permission checks | 0.25 | 0.48 | FSD 2.0 | Granular permission validation |
| BE-011 | Row-Level Security | 0.5 | 0.95 | ERD 6.2 | PostgreSQL RLS policies per ERD spec |
| BE-012 | AGENT_SESSIONS table | 0.5 | 0.95 | ERD AGENT_SESSIONS, BP 5.A | Shadow Mode session tracking |
| BE-013 | x-agent-id header | 0.25 | 0.48 | FSD 4.2 | Header injection for impersonation audit |
| BE-014 | Impersonation audit log | 0.5 | 0.95 | FSD 4.2, UAT-03B | Mandatory audit: `[AUDIT_IMPERSONATION] Agent:X acted_as Partner:Y` |
| BE-015 | Checkout notification WA + Email | 0.75 | 1.43 | FSD 4.2, GOV 3.B | WA primary, Email fallback per Governance SOP |

## BE-016 to BE-030: Catalog & Inventory

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| BE-016 | PRODUCTS CRUD API | 0.5 | 0.95 | ERD PRODUCTS, SOW 2.A.2 | Product catalog management |
| BE-017 | BRANDS CRUD API | 0.25 | 0.48 | ERD BRANDS | Brand filtering for catalog |
| BE-018 | CATEGORIES CRUD API | 0.25 | 0.48 | ERD CATEGORIES | Hierarchical category structure |
| BE-019 | Product search FTS | 0.5 | 0.95 | BP 1, ERD 7.1 | Full-text search per ERD indexing strategy |
| BE-020 | Image upload handler | 0.25 | 0.48 | SOW 2.B.1 | Product image management |
| BE-021 | TIER_PRICES table | 0.25 | 0.48 | ERD TIER_PRICES, BP 2.B | Silver/Gold/Platinum pricing per Blueprint |
| BE-022 | Tier price resolution | 0.5 | 0.95 | BP 2.B, UAT-02 | Return correct tier price based on Partner level |
| BE-023 | Volume discount logic | 0.5 | 0.95 | BP 2.B, UAT-06 | Quantity-based discount calculation |
| BE-024 | Redis tier price cache | 0.5 | 0.95 | BP 1, DO 4.3 | Memory-First strategy: <2000 SKU in Redis |
| BE-025 | Price effective date | 0.25 | 0.48 | ERD TIER_PRICES | Time-bound pricing support |
| BE-026 | INVENTORY table | 0.25 | 0.48 | ERD INVENTORY | Stock level tracking |
| BE-027 | Safety Buffer algo | 0.5 | 0.95 | BP 3.C, UAT-09 | `Display_Stock = ERP_Stock - Safety_Buffer`, Fast/Slow SKU classify |
| BE-028 | Stock status enum | 0.25 | 0.48 | FSD 4.3 | HIGH/LOW/ZERO status mapping |
| BE-029 | ERP stock sync job | 0.5 | 0.95 | BP 3.C.3, UAT-09 | 15-minute sync interval per Blueprint |
| BE-029B | Stock sync status API | 0.25 | 0.48 | BP 3.C.3, FSD 4.3 | Expose `last_sync_at` for delay banner |
| BE-030 | Weekly reconciliation job | 0.75 | 1.43 | BP 3.C.4 | Target <1% discrepancy, notify if >5% |

## BE-031 to BE-042: Credit System

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| BE-031 | `/api/credit/status` | 0.5 | 0.95 | BP 2.A, FSD 4.1, UAT-04 | Credit check: `Sisa Limit = Plafon - Tagihan Belum Lunas` |
| BE-032 | Credit limit calc | 0.25 | 0.48 | BP 2.A, ERD PARTNERS | Calculate remaining credit exposure |
| BE-033 | GREEN/AMBER status | 0.25 | 0.48 | BP 2.A, FSD 4.1 | Visual indicator: GREEN=aman, AMBER=over limit |
| BE-034 | Over-limit flag | 0.25 | 0.48 | BP 2.A, UAT-05 | Flag for "Ajukan Approval Limit" button |
| BE-035 | Credit exposure track | 0.5 | 0.95 | BP 2.A | Track outstanding invoices against limit |
| BE-036 | Tier payment terms | 0.5 | 0.95 | BP 2.B, UAT-30 | Silver=CBD, Gold=NET-14, Platinum=NET-30 |
| BE-037 | Auto due_date calc | 0.25 | 0.48 | BP 2.B, UAT-30 | Calculate due_date based on tier rule |
| BE-038 | Credit used on APPROVED | 0.25 | 0.48 | BP 2.A | Reserve credit when order approved |
| BE-039 | Credit release on PAID | 0.25 | 0.48 | BP 2.A, UAT-33 | Release credit when invoice paid |
| BE-040 | ERP timeout handling | 0.5 | 0.95 | BP 3.C.2, UAT-09 | Degraded Mode: ERP Heartattack Protocol |
| BE-041 | Redis fallback cache | 0.5 | 0.95 | BP 1, BP 3.C.2 | Memory-First fallback when ERP down |
| BE-042 | Bypass mode AMBER | 0.5 | 0.95 | BP 3.C.2, FSD 4.1 | Allow order with PENDING_SYNC flag |

## BE-043 to BE-057: Order Management

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| BE-043 | ORDERS table | 0.25 | 0.48 | ERD ORDERS | Core order entity |
| BE-044 | ORDER_ITEMS table | 0.25 | 0.48 | ERD ORDER_ITEMS | Line items per order |
| BE-045 | Order number gen | 0.25 | 0.48 | ERD ORDERS | Sequential order numbering |
| BE-046 | POST `/api/orders` + PENDING_SYNC | 0.5 | 0.95 | FSD 5.1, UAT-04 | Inquiry submission with sync_status flag |
| BE-047 | GET `/api/orders/{id}` | 0.25 | 0.48 | FSD 5.2 | Order detail with financial_context |
| BE-048 | GET `/api/orders` list | 0.25 | 0.48 | SOW 2.B.2 | Partner order history |
| BE-049 | Order state machine | 0.5 | 0.95 | ERD ORDERS, UAT-04 | States: DRAFT→SUBMITTED→APPROVED→PROCESSING→COMPLETED |
| BE-050 | Order cancellation | 0.25 | 0.48 | FSD 5.1 | Cancel with stock release |
| BE-051 | Stock validation | 0.5 | 0.95 | BP 3.C, FSD 4.3 | Validate against Display_Stock |
| BE-052 | Min threshold check | 0.25 | 0.48 | BP 4.B, UAT-40 | Minimum Rp 500.000 for point eligibility |
| BE-053 | Region validation | 0.25 | 0.48 | BP 3.A, UAT-06B | Block if no region_id assigned |
| BE-054 | Order total calc | 0.25 | 0.48 | BP 2.B, UAT-04 | Total = sum(tier_price × qty) - discount |
| BE-055 | Point redemption deduction | 0.25 | 0.48 | BP 4.C, UAT-08 | 1000 poin = Rp 100.000 voucher |
| BE-056 | session_mode tag | 0.25 | 0.48 | FSD 4.2, FSD 5.1 | Tag: DIRECT / AGENT_IMPERSONATION |
| BE-057 | agent_id on order | 0.25 | 0.48 | BP 5.A, FSD 4.2 | Record "Assisted by" attribution |

## BE-058 to BE-067: Invoice & Payment

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| BE-058 | INVOICES table | 0.25 | 0.48 | ERD INVOICES, WBS 2.6 | Invoice entity with due_date |
| BE-059 | Auto invoice on APPROVED | 0.5 | 0.95 | FSD 4.6, UAT-30 | Generate invoice when order approved |
| BE-060 | Invoice number gen | 0.25 | 0.48 | ERD INVOICES | Sequential invoice numbering |
| BE-061 | GET `/api/invoices` | 0.25 | 0.48 | SOW 2.B.2, UAT-31 | Invoice list endpoint |
| BE-062 | GET `/api/invoices/{id}` | 0.25 | 0.48 | FSD 4.6 | Invoice detail with payments |
| BE-063 | INVOICE_PAYMENTS table | 0.25 | 0.48 | ERD INVOICE_PAYMENTS | Payment record entity |
| BE-064 | POST payments | 0.5 | 0.95 | UAT-32,33 | Record partial/full payment by Admin |
| BE-065 | Partial payment logic | 0.25 | 0.48 | UAT-32 | Update amount_paid, status=PARTIAL |
| BE-066 | PAID status update | 0.25 | 0.48 | UAT-33 | Set status=PAID, paid_at timestamp |
| BE-067 | Point credit on PAID | 0.5 | 0.95 | BP 4.B, UAT-42 | Trigger EARNED points when invoice paid |

## BE-068 to BE-079: Loyalty Engine

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| BE-068 | POINT_TRANSACTIONS table | 0.25 | 0.48 | ERD POINT_TRANSACTIONS | Point ledger: EARNED, REDEEMED, EXPIRED |
| BE-069 | Base point calc | 0.25 | 0.48 | BP 4.A | Rp 10.000 = 1 poin (config: loyalty.point_rate) |
| BE-070 | Tier multiplier logic | 0.5 | 0.95 | BP 4.A, UAT-43,44 | Silver=1.0x, Gold=1.2x, Platinum=1.5x |
| BE-071 | Estimated points API | 0.25 | 0.48 | BP 4, UAT-07 | Show "+50 Poin" on product card |
| BE-072 | Point eligibility check | 0.25 | 0.48 | BP 4.B, UAT-40 | Minimum threshold: order.minimum_threshold |
| BE-073 | EARNED on invoice PAID | 0.5 | 0.95 | BP 4.B, UAT-42 | Points cair only when invoice PAID |
| BE-074 | point_balance trigger | 0.25 | 0.48 | ERD PARTNERS | Update PARTNERS.point_balance |
| BE-075 | GET `/api/points/balance` | 0.25 | 0.48 | SOW 2.A.3 | Current balance endpoint |
| BE-076 | GET `/api/points/history` | 0.25 | 0.48 | SOW 2.A.3 | Transaction history |
| BE-077 | REDEMPTION_CATALOG | 0.25 | 0.48 | ERD REDEMPTION_CATALOG, BP 4.C | Fixed redemption menu |
| BE-078 | POST `/api/redemptions` | 0.5 | 0.95 | BP 4.C, UAT-08 | Redeem points for rewards |
| BE-079 | REDEEMED transaction | 0.25 | 0.48 | ERD POINT_TRANSACTIONS | Deduct from balance, record transaction |

## BE-080 to BE-091: Routing & SLA

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| BE-080 | SUB_DISTRIBUTORS table | 0.25 | 0.48 | ERD SUB_DISTRIBUTORS, BP 3.A | Sub-Distributor entity |
| BE-081 | REGIONS table | 0.25 | 0.48 | ERD REGIONS | Geographic region mapping |
| BE-082 | Region→SubDist lookup | 0.5 | 0.95 | BP 3.A, UAT-20 | Route order to correct SubDist |
| BE-083 | GET `/api/subdistributors` | 0.25 | 0.48 | SOW 2.A.4 | SubDist list by region |
| BE-084 | WA Deep Link gen | 0.5 | 0.95 | BP 3.A, FSD 4.7, GOV 3.C | Generate `wa.me/+62...?text=...` |
| BE-084B | Credit warning in WA msg | 0.25 | 0.48 | BP 2.A, UAT-05 | Include `[PERINGATAN: KREDIT MELEBIHI LIMIT]` |
| BE-085 | routed_at timestamp | 0.25 | 0.48 | BP 3.A | T-Zero tracking for SLA |
| BE-086 | SLA_ESCALATION_LOGS | 0.25 | 0.48 | ERD SLA_ESCALATION_LOGS, WBS 2.7 | Escalation audit trail |
| BE-087 | SLA check job (15min) | 0.5 | 0.95 | BP 3.B, SLI 3.B | Scheduled job for SLA monitoring |
| BE-088 | 18h reminder logic | 0.25 | 0.48 | BP 3.B, UAT-23 | Send reminder to SubDist manager |
| BE-089 | 24h escalation logic | 0.25 | 0.48 | BP 3.B, UAT-24 | Escalate to HQ Admin |
| BE-090 | GET `/api/orders/sla/pending` | 0.25 | 0.48 | SOW 2.B.4, UAT-21 | Pending SLA orders for Admin |
| BE-091 | Fallback to HQ | 0.25 | 0.48 | FSD 4.7, UAT-25 | Route to HQ if no SubDist in region |

## BE-092 to BE-100: Configuration & Audit

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| BE-092 | SYSTEM_CONFIGS table | 0.25 | 0.48 | ERD SYSTEM_CONFIGS, BP 7 | Key-value config store |
| BE-093 | CRUD `/api/admin/config` | 0.5 | 0.95 | BP 7, UAT-12 | Admin config management |
| BE-094 | Config Redis cache | 0.25 | 0.48 | DO 4.3, BP 1 | Memory-First for config |
| BE-095 | Cache invalidation | 0.25 | 0.48 | DO 4.3 | Invalidate on config update |
| BE-096 | Config versioning | 0.25 | 0.48 | FSD 4.5, UAT-13 | Track config changes |
| BE-097 | AUDIT_LOGS table | 0.25 | 0.48 | ERD AUDIT_LOGS, GOV 2.B | Mandatory audit logging |
| BE-098 | Auto audit logging | 0.5 | 0.95 | GOV 2.B, UAT-13 | Log all admin actions |
| BE-099 | GET `/api/admin/audit` | 0.25 | 0.48 | UAT-13 | Admin audit view |
| BE-100 | PII masking logs | 0.25 | 0.48 | ERD 6.1, DO 5.2 | Mask sensitive data in logs |

---

# FRONTEND TASKS

## FE-001 to FE-012: Foundation

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| FE-001 | React 18 + Vite setup | 0.25 | 0.48 | WBS 3.1 | Modern React with fast HMR |
| FE-002 | Tailwind CSS config | 0.25 | 0.48 | WBS 3.1 | Utility-first CSS per stack spec |
| FE-003 | React Query setup | 0.25 | 0.48 | DO 4.3 | Server state management |
| FE-004 | react-i18next (ID/EN) | 0.25 | 0.48 | FSD 6.2, UAT-14 | Multi-language support |
| FE-005 | React Router setup | 0.25 | 0.48 | WBS 3.1 | Client-side routing |
| FE-006 | API client + errors | 0.25 | 0.48 | FSD 5.3, DO 4.1 | RFC 7807 error handling |
| FE-007 | Button component | 0.25 | 0.48 | WBS 3.1 | Shared button variants |
| FE-008 | Input/Form components | 0.25 | 0.48 | WBS 3.1 | Validated form inputs |
| FE-009 | Modal component | 0.25 | 0.48 | WBS 3.1 | Reusable modal dialog |
| FE-010 | Table + pagination | 0.5 | 0.95 | WBS 3.1 | Data table with sorting/paging |
| FE-011 | Toast notifications | 0.25 | 0.48 | WBS 3.1 | User feedback notifications |
| FE-012 | Loading skeletons | 0.25 | 0.48 | WBS 3.1 | Loading state placeholders |

## FE-013 to FE-020: Authentication

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| FE-013 | Login page | 0.5 | 0.95 | SOW 2.B.2, UAT-01 | Partner/Agent/Admin login |
| FE-014 | Login form validation | 0.25 | 0.48 | FSD 5.3 | Client-side validation |
| FE-015 | Role-based redirect | 0.25 | 0.48 | FSD 2.0 | Route to correct dashboard |
| FE-016 | Token storage | 0.25 | 0.48 | DO 5.2 | Secure localStorage/httpOnly |
| FE-017 | Logout functionality | 0.25 | 0.48 | FSD 2.0 | Clear session, redirect |
| FE-018 | AuthGuard HOC | 0.25 | 0.48 | FSD 2.0 | Protected route wrapper |
| FE-019 | Role-based guards | 0.25 | 0.48 | FSD 2.0, UAT-02 | Role-specific page access |
| FE-020 | Token refresh | 0.25 | 0.48 | FSD 2.0 | Auto-refresh before expiry |

## FE-021 to FE-030: Public Catalog

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| FE-021 | Homepage hero | 0.5 | 0.95 | SOW 2.B.1 | Landing page hero section |
| FE-022 | Product grid | 0.5 | 0.95 | SOW 2.B.1, BP 1 | Headless Catalog display |
| FE-022B | Stock sync delay banner | 0.5 | 0.95 | BP 3.C.3, FSD 4.3 | Warning if sync >30 min |
| FE-023 | Product card | 0.5 | 0.95 | SOW 2.B.1 | Individual product display |
| FE-024 | Category sidebar | 0.5 | 0.95 | SOW 2.B.1 | Category navigation |
| FE-025 | Brand filter | 0.25 | 0.48 | SOW 2.B.1 | Filter by brand |
| FE-026 | Search bar | 0.5 | 0.95 | SOW 2.B.1 | Full-text product search |
| FE-027 | Product detail page | 0.5 | 0.95 | SOW 2.B.1 | Full product information |
| FE-028 | Price hidden for Guest | 0.25 | 0.48 | BP 1, FSD 4.3 | No price without login |
| FE-029 | Tier price (Partner) | 0.25 | 0.48 | BP 2.B, UAT-02 | Show tier-specific price |
| FE-030 | "Login for price" CTA | 0.25 | 0.48 | BP 1 | Prompt guest to login |

## FE-031 to FE-045: Partner Dashboard

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| FE-031 | Dashboard layout | 0.5 | 0.95 | SOW 2.B.2 | Partner main view |
| FE-032 | Credit status widget | 0.5 | 0.95 | BP 2.A, UAT-04 | Lampu Hijau/Kuning visual |
| FE-033 | Point balance widget | 0.25 | 0.48 | BP 4, SOW 2.A.3 | Current point balance |
| FE-034 | Recent orders widget | 0.5 | 0.95 | SOW 2.B.2 | Last 5 orders |
| FE-035 | Tier status display | 0.25 | 0.48 | BP 2.B, UAT-02 | Silver/Gold/Platinum badge |
| FE-036 | Order history page | 0.5 | 0.95 | SOW 2.B.2 | Full order list |
| FE-037 | Order detail modal | 0.5 | 0.95 | SOW 2.B.2 | Order items + status |
| FE-038 | Order status badge | 0.25 | 0.48 | ERD ORDERS | Visual status indicator |
| FE-038B | PENDING_SYNC badge | 0.25 | 0.48 | BP 3.C.2, FSD 4.3 | Degraded Mode indicator |
| FE-039 | Invoice status badge | 0.25 | 0.48 | FSD 4.6, UAT-31 | UNPAID/PARTIAL/PAID |
| FE-040 | Pending points msg | 0.25 | 0.48 | BP 4.B, UAT-41 | "100 poin pending, menunggu pembayaran" |
| FE-041 | Profile page | 0.5 | 0.95 | BP 5.C, UAT-11 | Partner profiling form |
| FE-042 | Salon type selector | 0.25 | 0.48 | BP 5.C, ERD PARTNERS | BARBER/BRIDAL/UNISEX/OTHER |
| FE-043 | Region dropdown | 0.25 | 0.48 | BP 5.C, UAT-11 | Region selection |
| FE-044 | Chair count input | 0.25 | 0.48 | BP 5.C | Business size indicator |
| FE-045 | Specialization input | 0.25 | 0.48 | BP 5.C | Service specialization |

## FE-046 to FE-057: Cart & Checkout

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| FE-046 | Cart context/store | 0.5 | 0.95 | WBS 3.4 | Zustand cart state |
| FE-047 | Add to Cart button | 0.25 | 0.48 | SOW 2.B.2 | Product add action |
| FE-048 | Cart drawer | 0.5 | 0.95 | SOW 2.B.2 | Slide-out cart view |
| FE-049 | Quantity selector | 0.25 | 0.48 | SOW 2.B.2 | Quantity +/- controls |
| FE-050 | Remove item | 0.25 | 0.48 | SOW 2.B.2 | Delete from cart |
| FE-051 | Cart total calc | 0.25 | 0.48 | SOW 2.B.2 | Running total display |
| FE-052 | Checkout page | 0.5 | 0.95 | SOW 2.B.2, UAT-04 | Pre-submission review |
| FE-053 | Savings visual | 0.5 | 0.95 | BP 5.B | "ANDA HEMAT: Rp X" (Tier Silver baseline) |
| FE-054 | Estimated points | 0.25 | 0.48 | BP 4, UAT-07 | "+X Poin" preview |
| FE-055 | Point redemption | 0.5 | 0.95 | BP 4.C, UAT-08 | Apply points as discount |
| FE-056 | DynamicButton GREEN/AMBER | 0.5 | 0.95 | FSD 4.1, UAT-04,05 | Credit-based button state |
| FE-057 | Order notes | 0.25 | 0.48 | FSD 5.1 | Additional instructions |

## FE-058 to FE-062: WhatsApp Integration

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| FE-058 | WA message formatter | 0.5 | 0.95 | FSD 4.7, UAT-20 | Format order as WA text |
| FE-059 | "Kirim via WA" button | 0.5 | 0.95 | BP 3.A, UAT-20 | WA Deep Link trigger |
| FE-060 | Copy fallback | 0.25 | 0.48 | GOV 3.C | Fallback if Deep Link fails |
| FE-061 | SubDist info display | 0.25 | 0.48 | BP 3.A, UAT-20 | Show routed SubDist |
| FE-062 | Order confirmation | 0.25 | 0.48 | FSD 4.7 | Success message |

## FE-064 to FE-070: Agent Interface

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| FE-064 | Agent dashboard | 0.5 | 0.95 | SOW 2.B.3, UAT-03 | Agent main view |
| FE-065 | "Kelola Klien" page | 0.5 | 0.95 | BP 5.A, UAT-03 | Partner list for agent |
| FE-066 | Partner search | 0.25 | 0.48 | SOW 2.B.3 | Search partners by name |
| FE-067 | "Masuk sebagai" button | 0.25 | 0.48 | BP 5.A, UAT-03 | Initiate Shadow Mode |
| FE-068 | Impersonation banner | 0.25 | 0.48 | FSD 4.2, UAT-03 | Visual indicator of impersonation |
| FE-069 | Exit impersonation | 0.25 | 0.48 | FSD 4.2 | Return to agent view |
| FE-070 | Shared cart flow | 0.25 | 0.48 | BP 5.A | Order on behalf of partner |

## FE-074 to FE-089: Admin Panel

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| FE-074 | Admin dashboard | 0.5 | 0.95 | SOW 2.B.4 | Admin overview |
| FE-077 | SLA alert widget | 0.25 | 0.48 | BP 3.B, UAT-21 | Pending SLA count |
| FE-078 | Admin order list | 0.5 | 0.95 | SOW 2.B.4, UAT-22 | All orders view |
| FE-079 | Status update controls | 0.5 | 0.95 | UAT-22 | Manual status change |
| FE-080 | Order filters | 0.25 | 0.48 | SOW 2.B.4 | Filter by status/region |
| FE-081 | SLA monitoring page | 0.5 | 0.95 | SOW 2.B.4, UAT-21 | Full SLA dashboard |
| FE-082 | SLA status badges | 0.25 | 0.48 | BP 3.B, UAT-23,24 | Time-based status colors |
| FE-083 | Escalation actions | 0.25 | 0.48 | BP 3.B, UAT-24 | Manual escalation trigger |
| FE-084 | Invoice list page | 0.5 | 0.95 | SOW 2.B.4 | All invoices view |
| FE-085 | Payment recording | 0.5 | 0.95 | UAT-32,33 | Record payment UI |
| FE-086 | Payment history | 0.25 | 0.48 | UAT-32 | Payment audit trail |
| FE-087 | Config list page | 0.5 | 0.95 | BP 7, UAT-12 | System config view |
| FE-088 | Config edit modal | 0.5 | 0.95 | BP 7, UAT-12 | Edit config values |
| FE-089 | Config audit log | 0.25 | 0.48 | UAT-13 | Config change history |

## FE-092 to FE-100: Loyalty & UX

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| FE-092 | Point balance card | 0.25 | 0.48 | SOW 2.A.3 | Balance display component |
| FE-093 | Point history page | 0.5 | 0.95 | SOW 2.A.3 | Transaction list |
| FE-094 | Point tx detail | 0.25 | 0.48 | SOW 2.A.3 | Transaction detail modal |
| FE-095 | Redemption catalog | 0.5 | 0.95 | BP 4.C, UAT-08 | Available rewards |
| FE-096 | Redemption item card | 0.25 | 0.48 | BP 4.C | Individual reward display |
| FE-097 | Redeem confirm modal | 0.25 | 0.48 | BP 4.C, UAT-08 | Confirm redemption |
| FE-098 | Language switcher | 0.25 | 0.48 | FSD 6.2, UAT-14 | ID/EN toggle |
| FE-099 | Responsive mobile | 1.0 | 1.90 | SOW 2.B | Mobile-friendly UI |
| FE-100 | Error boundary + 404 | 0.25 | 0.48 | FSD 5.3 | Graceful error handling |

---

# DEVOPS TASKS

## DO-001 to DO-015: Infrastructure

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| DO-001 | Terraform project init | 0.5 | 0.95 | DO 3.1, SOW 2.C | Infrastructure as Code |
| DO-002 | VPC/Network config | 0.5 | 0.95 | DO 3.1, RAB | Private network isolation |
| DO-003 | VPS provisioning | 0.5 | 0.95 | RAB Seimbang | IDCloudHost per RAB recommendation |
| DO-004 | Managed DB setup | 0.5 | 0.95 | RAB, DO 3.2 | Managed PostgreSQL 17.6+ |
| DO-005 | Redis Cloud Flex | 0.25 | 0.48 | RAB, BP 1 | Memory-First caching |
| DO-006 | Cloudflare DNS + CDN | 0.25 | 0.48 | RAB (Free tier) | CDN + DDoS protection included |
| DO-007 | SSL certificate | 0.25 | 0.48 | DO 5.2 | HTTPS enforcement |
| DO-008 | Environment variables | 0.25 | 0.48 | DO 4.3 | Secure config management |
| DO-009 | Secret management | 0.25 | 0.48 | DO 5.2 | HashiCorp Vault or equivalent |
| DO-010 | Backup strategy | 0.5 | 0.95 | GOV 4, DO 3.2 | RPO 1 hour per Governance |
| DO-011 | Terraform remote state | 0.25 | 0.48 | DO 3.1 | State locking & sharing |
| DO-012 | Dev environment | 0.5 | 0.95 | DO 3.3, WBS 1.1 | Development server |
| DO-013 | Staging environment | 0.5 | 0.95 | DO 3.3, WBS 1.1 | Pre-production testing |
| DO-014 | Production environment | 0.5 | 0.95 | DO 3.3 | Production deployment |
| DO-015 | Firewall rules | 0.25 | 0.48 | DO 5.2 | Network security |

## DO-016 to DO-030: CI/CD Pipeline

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| DO-016 | GitHub Actions setup | 0.25 | 0.48 | DO 4.1, SOW 2.C | CI/CD platform |
| DO-017 | Lint stage | 0.25 | 0.48 | DO 4.1 | Code quality gate |
| DO-018 | Secret scanning | 0.25 | 0.48 | DO 4.1, DO 5.2 | Prevent credential leaks |
| DO-019 | Unit test stage | 0.5 | 0.95 | DO 4.1, WBS 4.1 | Automated unit tests |
| DO-020 | Integration test stage | 0.5 | 0.95 | DO 4.1 | API integration tests |
| DO-021 | SonarQube SAST | 0.5 | 0.95 | DO 4.1, DO 5.2 | Static security analysis |
| DO-022 | Docker build BE | 0.5 | 0.95 | DO 4.2 | Backend container image |
| DO-023 | Docker build FE | 0.5 | 0.95 | DO 4.2 | Frontend container image |
| DO-024 | Container registry | 0.25 | 0.48 | DO 4.2 | Image repository |
| DO-025 | Deploy to staging | 0.5 | 0.95 | DO 4.1 | Staging deployment |
| DO-026 | Deploy to production | 0.5 | 0.95 | DO 4.1 | Production deployment |
| DO-027 | Rollback procedure | 0.25 | 0.48 | DO 4.1 | Quick rollback capability |
| DO-028 | Database migrations | 0.25 | 0.48 | DO 4.1 | Schema versioning |
| DO-029 | Zero-downtime deploy | 0.5 | 0.95 | DO 4.2 | Rolling or blue-green |
| DO-030 | ERP VPN/tunnel config | 0.5 | 0.95 | DO 3.4, UAT-09 | Secure ERP connection |

## DO-031 to DO-040: Observability

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| DO-031 | OpenTelemetry setup | 0.5 | 0.95 | DO 5.1, SLI | Full-stack telemetry |
| DO-032 | Trace-ID injection | 0.25 | 0.48 | DO 5.1 | Distributed tracing |
| DO-033 | Grafana dashboard | 0.5 | 0.95 | DO 5.1, SLI | Metrics visualization |
| DO-034 | Error rate alerts | 0.25 | 0.48 | SLI 1.A | <0.1% error rate SLO |
| DO-035 | Latency alerts | 0.25 | 0.48 | SLI 2.A | P95 latency thresholds |
| DO-036 | Health check endpoint | 0.25 | 0.48 | DO 4.2, UAT-10 | `/health` for load balancer |
| DO-037 | Warm-up pinger | 0.25 | 0.48 | DO 4.2, UAT-10 | Cold start mitigation |
| DO-038 | Business metric: orders | 0.25 | 0.48 | DO 5.1 | Order throughput |
| DO-039 | Business metric: SLA | 0.25 | 0.48 | DO 5.1, SLI 3.B | SLA compliance rate |
| DO-040 | Log aggregation | 0.5 | 0.95 | DO 5.1 | Centralized logging |

## DO-043 to DO-048: Security & Resilience

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| DO-043 | Rate limiting infra | 0.25 | 0.48 | DO 4.5, SLI 2.A | 100 RPS peak capacity |
| DO-044 | DB connection pooling | 0.25 | 0.48 | DO 4.2 | Connection efficiency |
| DO-045 | Circuit breaker config | 0.25 | 0.48 | DO 4.4, UAT-09 | ERP failure isolation |
| DO-046 | Min-instances=1 | 0.25 | 0.48 | DO 4.2, UAT-10 | Always-warm instance |
| DO-047 | Graceful shutdown | 0.25 | 0.48 | DO 4.4 | Clean request completion |
| DO-048 | Idempotency header | 0.25 | 0.48 | DO 4.4 | Retry safety |

---

# QA TASKS

## QA-001 to QA-010: Test Infrastructure

| ID | Task | Effort | Recalibrated MD | Doc Ref | Rationale |
|:---|:-----|------:|---------------:|:--------|:----------|
| QA-001 | Test framework setup | 0.5 | 0.95 | WBS 4.1 | Jest/Vitest for unit tests |
| QA-002 | E2E framework (Playwright) | 0.5 | 0.95 | WBS 4.1 | Browser automation |
| QA-003 | Test database seeding | 0.5 | 0.95 | WBS 4.1 | Consistent test data |
| QA-004 | Mock server for ERP | 0.5 | 0.95 | WBS 4.1 | ERP simulation |
| QA-005 | CI test integration | 0.25 | 0.48 | DO 4.1 | Tests in pipeline |
| QA-006 | Test coverage reports | 0.25 | 0.48 | WBS 4.1 | Coverage metrics |
| QA-007 | API test collection | 0.5 | 0.95 | WBS 4.1 | Postman/Newman tests |
| QA-008 | Load test setup | 0.5 | 0.95 | SLI 2.B | Performance baseline |
| QA-009 | Security test checklist | 0.5 | 0.95 | DO 5.2 | OWASP-based checks |
| QA-010 | UAT environment prep | 0.5 | 0.95 | WBS 4.2 | Staging for UAT |

## QA-011 to QA-050: UAT Test Execution

| ID | Task | Effort | Recalibrated MD | Doc Ref | Mapped UAT |
|:---|:-----|------:|---------------:|:--------|:-----------|
| QA-011 | Test UAT-01: Login Partner | 0.5 | 0.95 | UAT 1 | UAT-01 |
| QA-012 | Test UAT-02: Tier Pricing | 0.5 | 0.95 | UAT 1 | UAT-02 |
| QA-013 | Test UAT-03: Agent Masquerade | 0.5 | 0.95 | UAT 1 | UAT-03 |
| QA-014 | Test UAT-03B: Audit Trail | 0.25 | 0.48 | UAT 1 | UAT-03B |
| QA-015 | Test UAT-03C: Checkout Notif | 0.25 | 0.48 | UAT 1 | UAT-03C |
| QA-016 | Test UAT-04: Order Normal | 0.5 | 0.95 | UAT 2 | UAT-04 |
| QA-017 | Test UAT-05: Over Limit | 0.5 | 0.95 | UAT 2 | UAT-05 |
| QA-018 | Test UAT-06: Volume Discount | 0.25 | 0.48 | UAT 2 | UAT-06 |
| QA-019 | Test UAT-06B: Region Error | 0.25 | 0.48 | UAT 2 | UAT-06B |
| QA-020 | Credit unit tests | 0.5 | 0.95 | WBS 4.3 | - |
| QA-021 | Test UAT-20: Geo-Routing | 0.5 | 0.95 | UAT 3 | UAT-20 |
| QA-022 | Test UAT-21: Admin Monitor | 0.25 | 0.48 | UAT 3 | UAT-21 |
| QA-023 | Test UAT-22: Status Update | 0.25 | 0.48 | UAT 3 | UAT-22 |
| QA-024 | Test UAT-23: SLA Reminder | 0.5 | 0.95 | UAT 3 | UAT-23 |
| QA-025 | Test UAT-24: SLA Escalation | 0.5 | 0.95 | UAT 3 | UAT-24 |
| QA-026 | Test UAT-25: No SubDist | 0.25 | 0.48 | UAT 3 | UAT-25 |
| QA-027 | Test UAT-30: Invoice Gen | 0.5 | 0.95 | UAT 4 | UAT-30 |
| QA-028 | Test UAT-31: Invoice Display | 0.25 | 0.48 | UAT 4 | UAT-31 |
| QA-029 | Test UAT-32: Partial Payment | 0.25 | 0.48 | UAT 4 | UAT-32 |
| QA-030 | Test UAT-33: Full Payment | 0.25 | 0.48 | UAT 4 | UAT-33 |
| QA-031 | Test UAT-07: Estimated Poin | 0.25 | 0.48 | UAT 5 | UAT-07 |
| QA-032 | Test UAT-08: Redeem Poin | 0.5 | 0.95 | UAT 5 | UAT-08 |
| QA-033 | Test UAT-40: Below Threshold | 0.25 | 0.48 | UAT 5 | UAT-40 |
| QA-034 | Test UAT-41: Pending Points | 0.25 | 0.48 | UAT 5 | UAT-41 |
| QA-035 | Test UAT-42: Points Credited | 0.5 | 0.95 | UAT 5 | UAT-42 |
| QA-036 | Test UAT-43: Gold 1.2x | 0.25 | 0.48 | UAT 5 | UAT-43 |
| QA-037 | Test UAT-44: Platinum 1.5x | 0.25 | 0.48 | UAT 5 | UAT-44 |
| QA-038 | Point calc unit tests | 0.5 | 0.95 | WBS 4.3 | - |
| QA-039 | Redemption unit tests | 0.25 | 0.48 | WBS 4.3 | - |
| QA-040 | Point trigger tests | 0.25 | 0.48 | WBS 4.3 | - |
| QA-041 | Test UAT-09: ERP Down | 0.5 | 0.95 | UAT 6 | UAT-09 |
| QA-042 | Test UAT-10: Cold Start | 0.25 | 0.48 | UAT 6 | UAT-10 |
| QA-043 | Test UAT-11: Profile Form | 0.25 | 0.48 | UAT 7 | UAT-11 |
| QA-044 | Test UAT-12: Config Edit | 0.25 | 0.48 | UAT 7 | UAT-12 |
| QA-045 | Test UAT-13: Config Audit | 0.25 | 0.48 | UAT 7 | UAT-13 |
| QA-046 | Test UAT-13B: SLA Config | 0.25 | 0.48 | UAT 7 | UAT-13B |
| QA-047 | Test UAT-14: Language | 0.25 | 0.48 | UAT 8 | UAT-14 |
| QA-048 | Regression suite | 1.0 | 1.90 | WBS 4.1 | - |
| QA-049 | Performance baseline | 0.5 | 0.95 | SLI | - |
| QA-050 | Final UAT sign-off | 1.0 | 1.90 | UAT Summary | ALL |

---

**Document Version:** 3.0
**Total Tasks (in this file):** 292
**Total Base Effort (sum of Effort column):** 103.50
**ECF:** 1.9005
**Engineering Subtotal (Recalibrated):** 196.75 MD
**Total Recalibrated (Likely, incl. PM/Architect + Partner Profiling + 15% Buffer):** 252.25 MD
**Created:** January 09, 2026
