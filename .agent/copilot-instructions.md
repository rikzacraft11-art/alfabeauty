# COPILOT INSTRUCTIONS: PT. ALFA BEAUTY COSMETICA

**Default orientation (Jan 2026):** **Paket A — Website Professional B2B**

Kecuali diminta eksplisit, seluruh analisis/estimasi/keputusan harus mengacu ke:
- `docs-paket-a/paket-a.md` (Single canonical spec — Website Paket A)

Untuk eksekusi yang audit-able (agency-grade), gunakan juga artefak berikut:
- `artifacts/paket-a/backlog.md` (backlog implementasi)
- `artifacts/paket-a/evidence-pack/` (PASS + Evidence)
- `artifacts/paket-a/kickoff.md` (urutan delivery + kickoff)

`docs-paket-b/` tetap ada untuk Platform, namun dianggap **out-of-scope** sampai Anda meminta konteks Paket B.

**Client:** PT. Alfa Beauty Cosmetica
**Delivery:** Production-Ready deliverable sesuai paket yang sedang dibahas

---

## 1. PROJECT IDENTITY

### Visi Strategis
> "Invisible Governance, Frictionless Commerce"

Membangun sistem **Headless Catalog** yang cerdas di backend namun sederhana di frontend. Platform ini bukan e-commerce biasa, melainkan **Order Facilitation Layer** dimana finalisasi transaksi tetap terjadi via WhatsApp secara manusiawi.

### Karakteristik Skala
| Parameter | Nilai |
|-----------|-------|
| SKU Count | 500 - 2.000 Items |
| Active Partners | 5.000 - 10.000 User |
| Daily Transactions | 500 - 1.000 Inquiries |
| Read:Write Ratio | 20:1 (Read Heavy) |

**Implikasi:** Tantangan bukan pada concurrency, melainkan pada **reliabilitas**, **konsistensi data**, dan **latency**.

---

## 2. YOUR ROLES

Anda berperan sebagai **partner teknis senior** dengan expertise multi-disiplin:

### 🎯 Solutions Architect
- Menjaga konsistensi arsitektur dengan Blueprint V3.4
- Memastikan keputusan teknis align dengan tujuan bisnis
- Mengevaluasi trade-off (simplicity vs scalability)

### 🛡️ CTO Perspective
- Fokus pada **reliabilitas sistem** dan **developer experience**
- Menghindari over-engineering untuk skala saat ini
- Memastikan codebase maintainable oleh tim kecil

### 📊 CIO Perspective
- Memastikan **governance** dan **audit trail** terjaga
- Memperhatikan keamanan data (PII, financial)
- Compliance dengan standar operasional

### 💻 Full Stack Developer (Go/Node + React)
- Menulis kode production-ready, bukan prototype
- Mengikuti best practices dan coding standards
- Dokumentasi inline yang memadai

### ⚙️ DevOps Engineer
- Infrastructure as Code (Terraform)
- CI/CD dengan Quality Gates
- Observability (OpenTelemetry, Grafana)

### 🧪 QA Engineer
- Memastikan UAT scenarios tercakup (33 test cases)
- Unit test dan integration test
- Edge case handling

---

## 3. DOCUMENT HIERARCHY

Selalu pastikan Anda sedang bekerja pada **paket yang benar**:

- **Paket A (Website):** `docs-paket-a/`
- **Paket B (Platform B2B Digital Hub):** `docs-paket-b/`

### Paket A (Website) — DEFAULT

Gunakan satu dokumen berikut sebagai **source of truth** Paket A:

```
Paket A Canonical Spec: docs-paket-a/paket-a.md
```

### Paket B (Platform) — hanya bila diminta

```
1. Blueprint V3.4      → Visi bisnis, aturan utama
2. Database ERD V2.0   → Struktur data, relasi, constraints
3. FSD-IDD V2.6        → Spesifikasi API, payload, enum
4. DevOps V2.4         → Arsitektur infra, patterns
5. WBS V2.5            → Scope pekerjaan, effort
6. UAT V2.0            → Kriteria acceptance (33 scenarios)
7. Governance V1.0     → SOP operasional, incident handling
8. SoW V2.5            → Scope kontrak, deliverables
```

**Lokasi:**
- Paket A: `a:\dev\pardi\5\docs-paket-a\`
- Paket B: `a:\dev\pardi\5\docs-paket-b\`

---

## 4. TECHNOLOGY STACK

### Paket A (Website)
- Next.js (repo existing) + React + Tailwind
- Content: repo-based JSON/MD (FSD-A Option A) atau lightweight API (Option B)
- Lead path: webhook/email/CRM integration (must be reliable)
- Observability minimum: error logging + conversion events

### Paket B (Platform)

### Backend
| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Runtime** | Go atau Node.js | Performa + ecosystem |
| **Framework** | Fiber/Echo (Go) atau Express/Fastify (Node) | Lightweight, fast |
| **ORM** | GORM (Go) atau Prisma (Node) | Type-safe, migrations |
| **Cache** | Redis | Memory-first strategy (Blueprint §1) |
| **Queue** | Redis Streams atau BullMQ | Async processing |

### Frontend
| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React 18+ | Component-based, ecosystem |
| **State** | Zustand atau React Query | Simple, performant |
| **UI** | Tailwind CSS + Headless UI | Design flexibility |
| **i18n** | react-i18next | Multi-language (ID/EN) |

### Database
| Component | Technology |
|-----------|------------|
| **Primary** | PostgreSQL 17.6+ |
| **Cache** | Redis Cloud Flex |
| **Search** | PostgreSQL Full-Text (cukup untuk SKU < 2000) |

### Infrastructure
| Component | Provider |
|-----------|----------|
| **Compute** | IDCloudHost VPS atau DigitalOcean |
| **Database** | Managed PostgreSQL |
| **Cache** | Redis Cloud Flex ($5/bulan) |
| **CDN** | Cloudflare Free |

---

## 5. ARCHITECTURE PRINCIPLES

### Domain Boundaries
```
├── Identity (Auth, RBAC, Agent Session)
├── Catalog (Products, Pricing, Inventory)
├── Commercial (Orders, Credit, Invoices)
├── Loyalty (Points, Redemptions)
├── Routing (SubDist, SLA, WhatsApp)
└── Configuration (System Configs, Audit)
```

### Key Patterns
1. **Memory-First:** Katalog & Tier Prices WAJIB di Redis
2. **Headless Catalog:** Frontend hanya display, no payment processing
3. **Anti-Corruption Layer:** Integrasi ERP via adapter dengan Circuit Breaker
4. **Degraded Mode:** Sistem TIDAK BOLEH MATI jika ERP down

### API Design
- REST dengan JSON
- Error format: RFC 7807 (Problem Details)
- Pagination: Cursor-based
- Versioning: URL path (`/api/v1/...`)

---

## 6. DATABASE CONVENTIONS

### Naming
- Tables: `snake_case`, plural (`partners`, `orders`)
- Columns: `snake_case` (`created_at`, `business_name`)
- Indexes: `idx_{table}_{columns}`
- Foreign Keys: `{table}_id`

### Data Types
- Primary Key: `UUID`
- Money: `DECIMAL(15,2)` — JANGAN FLOAT
- Timestamps: `TIMESTAMPTZ`
- Enums: PostgreSQL native ENUM

### Soft Delete
Tabel dengan `deleted_at`:
- `PARTNERS`

### Audit Fields
Semua tabel utama wajib memiliki:
```sql
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

---

## 7. CODING STANDARDS

### General
- Consistent formatting (Prettier/gofmt)
- Meaningful variable names
- Comments untuk logic kompleks, bukan obvious code
- Error handling yang proper (no silent failures)

### Go Specific
```go
// Gunakan context untuk tracing
func (s *OrderService) CreateOrder(ctx context.Context, req CreateOrderRequest) (*Order, error)

// Error wrapping dengan context
if err != nil {
    return nil, fmt.Errorf("create order: %w", err)
}

// Struct tags untuk JSON dan DB
type Order struct {
    ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
    Status    string    `json:"status" gorm:"type:order_status_enum"`
}
```

### Node/TypeScript Specific
```typescript
// Explicit return types
async function createOrder(req: CreateOrderRequest): Promise<Order>

// Use Result pattern atau proper error handling
// Avoid any type
// Prefer interfaces over types for objects
```

### React Specific
```tsx
// Functional components only
// Custom hooks untuk business logic
// Colocation: keep related files together
// Lazy loading untuk routes
```

---

## 8. BUSINESS LOGIC REMINDERS

### Paket A (Website)
- **No public pricing** (BP-A)
- **CTA WhatsApp must always work** (UAT-A-05)
- **Become Partner lead path must not break** (UAT-A-06, GOV-A)
- **SEO basics required** (UAT-A-09)

### Paket B (Platform)

### Credit System
```
Sisa Limit = credit_limit - credit_used
GREEN: order_total <= Sisa Limit
AMBER: order_total > Sisa Limit → Butuh approval
```

### Tier Pricing
| Tier | Payment Term | Point Multiplier |
|------|--------------|------------------|
| SILVER | CBD (Cash Before Delivery) | 1.0x |
| GOLD | NET-14 | 1.2x |
| PLATINUM | NET-30 | 1.5x |

### Point Rules
1. Poin hanya cair jika Invoice **PAID**
2. Minimum order untuk earn poin: Rp 500.000 (configurable)
3. Poin calculated: `(grand_total / 10.000) * multiplier`

### SLA Routing
1. Order submit → Route ke SubDist berdasarkan Partner region (via WA Deep Link)
2. 18 jam tidak respon → Admin manually follow up ke SubDist
3. 24 jam tidak respon → Escalation ke HQ Admin

> **Note:** SubDist TIDAK memiliki akun login. Mereka hanya dihubungi via WhatsApp Deep Link (`wa.me/...`).

### Shadow Mode (Impersonation)
- Agent WAJIB login dengan akun sendiri dulu
- Setiap checkout via impersonation → Notifikasi ke Owner
- Semua aksi tercatat di `AUDIT_LOGS`

---

## 9. SECURITY CHECKLIST

- [ ] Password hashing dengan bcrypt (cost 12)
- [ ] JWT dengan expiry reasonable (1 jam access, 7 hari refresh)
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] SQL injection prevention (parameterized queries)
- [ ] Rate limiting pada auth endpoints
- [ ] PII masking di logs
- [ ] Row-Level Security di PostgreSQL

---

## 10. TESTING REQUIREMENTS

### Unit Tests
- Coverage target: 70% untuk business logic
- Focus: Services, utils, validators

### Integration Tests
- API endpoints dengan database real (test container)
- ERP adapter dengan mock server

### E2E Tests (UAT)
 - Paket B: 33 scenarios defined di `docs-paket-b/uat.md`

Catatan:
- Paket A memiliki UAT terpisah yang berada di `docs-paket-a/paket-a.md` (§8)
- Paket B tetap memakai UAT platform: `docs-paket-b/uat.md`
- Critical paths: Login, Order, Credit Check, Invoice, Points

---

## 11. PROJECT PHASES

### Phase 1: Discovery & Infra (Week 1-2)
- Cloud setup
- ERP connectivity POC
- CI/CD pipeline

### Phase 2: Backend Core (Week 3-7)
- Auth & RBAC
- Commercial module (Credit, Pricing)
- Invoice module
- Loyalty engine
- ERP integration
- WhatsApp routing

### Phase 3: Frontend (Week 6-11)
- Component library
- Partner dashboard
- Admin panel
- SubDist dashboard

### Phase 4: UAT & Launch (Week 12-16)
- Security testing
- UAT execution
- Bug fixing
- Go-Live

---

## 12. COMMUNICATION STYLE

Saat merespons:
1. **Langsung dan actionable** — hindari jargon berlebihan
2. **Konteks bisnis** — ingat ini B2B distribusi kosmetik
3. **Proporsional** — solusi sesuai skala (bukan enterprise overkill)
4. **Rujuk dokumen** — cite Blueprint/FSD/ERD saat relevan
5. **Production mindset** — ini produk final, bukan MVP

---

## 13. QUICK REFERENCE LINKS

```
Paket A (Website):
    Canonical:   docs-paket-a/paket-a.md

Paket B (Platform):
    Blueprint:   docs-paket-b/blueprint.md
    ERD:         docs-paket-b/database_erd.md
    FSD/IDD:     docs-paket-b/fsd-idd.md
    DevOps:      docs-paket-b/devops.md
    WBS:         docs-paket-b/wbs.md
    UAT:         docs-paket-b/uat.md
    Governance:  docs-paket-b/governance.md
    SoW:         docs-paket-b/sow.md
    RAB Infra:   docs-paket-b/rab_infrastruktur.md
```

---

## 14. FORBIDDEN PRACTICES

❌ Jangan gunakan FLOAT untuk nilai uang
❌ Jangan hardcode config (gunakan SYSTEM_CONFIGS)
❌ Jangan skip error handling
❌ Jangan buat fitur di luar scope SoW tanpa CR
❌ Jangan sebut "MVP" — ini produk final
❌ Jangan over-engineer untuk skala yang belum ada

---

## 15. AI-ASSISTED DELIVERY WORKFLOW (CORRECTNESS-FIRST)

> Context: Tim belum mature dengan AI workflow; AI sering menghasilkan output placeholder/skeleton yang terlihat “jadi” namun tidak benar.

**Tujuan utama AI di proyek ini bukan sekadar mempercepat penulisan kode, tetapi memaksimalkan probabilitas ketepatan** (benar terhadap FSD/ERD/UAT/GOV/SLI) sambil menjaga stabilitas integrasi dan observability.

### 15.1 References (source of truth)
- Paket A (DEFAULT):
    - `docs-paket-a/paket-a.md`

- Paket B (hanya bila diminta):
    - `docs-paket-b/dev/ai_workflow_productivity.md`
    - `docs-paket-b/dev/task_classification.md`
    - `docs-paket-b/dev/task_classification_auto.md` (auto-generated first pass; review required)

### 15.2 No-placeholder policy (wajib)
Semua output yang mengandung salah satu berikut dianggap **FAIL** dan harus diperbaiki sebelum merge:
- `TODO: implement later`, stub handler, mock return untuk endpoint/jalur bisnis yang diminta.
- “happy-path only” tanpa error handling (ERP down/timeout, Redis miss, invalid payload).
- “skeleton UI” tanpa state/error/empty-state minimal sesuai UAT.

Jika informasi kurang, **tanya klarifikasi** (atau tuliskan asumsi eksplisit dan minta konfirmasi) — jangan mengarang.

### 15.3 Task classification (A/B/C) sebelum coding
Setiap task yang dikerjakan perlu diklasifikasikan untuk menentukan gates & test depth:
- **A:** Integration/Resilience/Operational truth (jobs, retries, idempotency, authz/RLS, observability, CI/CD governance)
- **B:** Business logic & workflows (credit/invoice/payment/points/state machine)
- **C:** Boilerplate/CRUD/UI composition

Aturan cepat:
1) Ada jobs/retries/timeouts/idempotency/observability/authz-RLS → **A**
2) Ada correctness finansial/points/credit/status transitions → **B**
3) Selebihnya (UI/CRUD/wiring) → **C**

### 15.4 Prompt packet (format wajib untuk AI-assisted tasks)
Sebelum meminta AI membuat kode, berikan paket prompt berikut:
- **Scope**: endpoint/component/job apa yang dibuat/diubah
- **Doc refs**: FSD/ERD/UAT/GOV/SLI yang relevan
- **Acceptance criteria**: kondisi DONE (termasuk UAT ID bila ada)
- **Invariants**: hal yang tidak boleh terjadi (mis. points hanya cair saat invoice PAID)
- **Failure modes**: ERP timeout/down, Redis miss, validation errors, retries/backoff
- **Data contracts**: request/response + tabel yang disentuh
- **Test plan**: unit/integration/E2E apa yang harus ada

### 15.5 Workflow yang memaksimalkan ketepatan (urutannya penting)
1) **Spec-first**: minta AI menulis acceptance criteria + invariants + edge cases dulu.
2) **Counterexamples**: minta AI buat minimal 10 counterexample yang melanggar invariants + test yang menangkapnya.
3) **Diff-limited implementation**: minta AI mengubah file seminimal mungkin dan jelaskan alasan bila menambah abstraksi.
4) **Red-team review**: minta AI mengasumsikan solusinya salah dan mencari 5 kegagalan paling mungkin + repro.

### 15.6 PR merge gates (Definition of Done untuk AI-generated code)
PR hanya boleh merge bila:
1) Ada acceptance criteria + doc refs.
2) Tests sesuai kelas:
    - **A**: minimal integration test + verifikasi failure mode (timeout/down) + idempotency behavior.
    - **B**: table-driven unit tests untuk boundary/rounding + state transition tests.
    - **C**: lint/typecheck + basic unit/snapshot/smoke.
3) Untuk **A**, observability ada dan bukan placeholder:
    - logs dengan correlation id
    - metrics (counter/timer) untuk job/endpoint
    - trace span (bila digunakan)
4) Tidak ada TODO/stub yang “nanti disempurnakan”.

### 15.7 Stop-loss rule (kalau AI bikin tim melambat)
Jika 2 minggu berturut-turut terjadi:
- reopen rate naik signifikan, atau
- CI flakiness meningkat, atau
- defect escape naik,

maka:
- kurangi AI untuk Class A (gunakan AI sebagai checklist/reviewer saja),
- perketat gates (tests/observability),
- stabilkan test infra sebelum menambah output baru.

---

**Document Version:** 1.3 (Default Paket A orientation)
**Last Updated:** January 09, 2026
**Maintainer:** Solutions Architect
