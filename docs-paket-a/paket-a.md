# Paket A — Website Professional B2B (Single Canonical Document)
## PT. Alfa Beauty Cosmetica

**Version:** 2.1 (consolidated + execution-ready)  
**Date:** January 10, 2026  
**Scope:** Website Paket A + **Option B: Lightweight Lead API**  

Dokumen ini adalah **spesifikasi + kontrak penerimaan (UAT/DoD)** untuk Paket A. Semua batas scope, keputusan arsitektur, acceptance, serta baseline procurement yang dibutuhkan untuk implementasi **production-ready** berada di sini.

**Rule:** jika ada konflik informasi, dokumen ini adalah **source of truth**.

---

## Daftar isi
- [1. Executive intent](#1-executive-intent)
- [2. Scope boundary (anti scope creep)](#2-scope-boundary-anti-scope-creep)
- [3. Information architecture & sitemap](#3-information-architecture--sitemap)
- [4. FSD/IDD (pages, behaviors, data interfaces)](#4-fsdidd-pages-behaviors-data-interfaces)
- [5. Partner profiling (lead capture spec)](#5-partner-profiling-lead-capture-spec)
- [6. Non-functional requirements](#6-non-functional-requirements)
- [7. SLIs & SLOs](#7-slis--slos)
- [8. Acceptance contract (UAT-A 01–16) + sign-off](#8-acceptance-contract-uat-a-0116--sign-off)
- [9. Definition of Done (Done = PASS + Evidence)](#9-definition-of-done-done--pass--evidence)
- [10. Audit checklist + audit→WBS mapping](#10-audit-checklist--auditwbs-mapping)
- [11. WBS (workstreams) + delivery plan](#11-wbs-workstreams--delivery-plan)
- [12. Work breakdown (detailed) + estimation envelope](#12-work-breakdown-detailed--estimation-envelope)
- [13. Architecture decisions (ADR-0001..0004)](#13-architecture-decisions-adr-00010004)
- [14. Ops & governance pack](#14-ops--governance-pack)
- [15. Security headers baseline](#15-security-headers-baseline)
- [16. OWASP ASVS v5.0.0 minimal traceability](#16-owasp-asvs-v500-minimal-traceability)
- [17. AI workflow productivity (optional)](#17-ai-workflow-productivity-optional)
- [18. Legacy mapping (old file → new section)](#18-legacy-mapping-old-file--new-section)

---

## 1. Executive intent

Paket A adalah website profesional yang berfungsi sebagai:

1) **Positioning**: memperjelas siapa Alfa Beauty, 3 pilar (Products, Education, Partnership), dan keunggulan kurasi brand.  
2) **Discovery**: katalog produk yang mudah dinavigasi untuk salon/barbershop (tanpa harga publik).  
3) **Conversion**: jalur cepat ke WhatsApp untuk konsultasi + **Become Partner** (lead capture) dengan profil dasar.

> Prinsip utama: **B2B-first, professional, no retail gimmicks.**

### What success looks like (outcomes)

- Pengunjung dapat menemukan produk yang relevan **tanpa harga publik** (navigasi + filter jelas).
- Jalur konversi (WhatsApp + Become Partner) **terlihat cepat** dan **berfungsi konsisten** di mobile.
- Lead “Become Partner” **tidak hilang**: persisted (durable) sebelum dianggap sukses, terlindungi dari spam, dan dapat diexport oleh admin.
- Setelah launch, performa dipantau via **RUM p75** (CWV) + indikator conversion (WA click + lead submit).

### Company introduction (approved copy)

_PT Alfa Beauty is a professional beauty distribution company dedicated to providing products, education, and technical support for salons and barbershops in Indonesia. We represent carefully selected international brands and work as a strategic partner to professionals, ensuring every product we distribute delivers consistent performance, real-world relevance, and is supported by proper technical knowledge._

### Blueprint sign-off record (PASS + Evidence)

Blueprint dianggap “approved” hanya bila ada sign-off eksplisit + evidence.

| Field | Value |
|---|---|
| Status | **PENDING** |
| Approved by | _[Nama, jabatan]_ |
| Approval date | _[YYYY-MM-DD]_ |
| Approval method | _Email / WA / Meeting minutes_ |
| Evidence link | _[URL / path ke bukti: email screenshot / minutes / ticket]_ |

---

## 2. Scope boundary (anti scope creep)

### In scope (Paket A)

- Homepage (positioning + CTA)
- Product overview (kategori + filter profesional)
- Product detail (decision support, ringkas & teknis)
- Education/Event highlight (showcase, bukan LMS)
- Partnership / Become Partner (form + WhatsApp)
- About/Contact/Privacy/Terms
- Basic SEO + social metadata + JSON-LD minimum
- Analytics events
- Core Web Vitals RUM wiring (field/RUM; p75-ready)
- **Option B lead pipeline** (persisted, anti-spam, export protected)
- Runbook + production checklist

### Out of scope (Paket A)

- Harga publik / tier pricing / diskon volume / loyalty
- Login Partner/Agent/Admin (private zone)
- Keranjang/inquiry builder + submit order workflow
- Integrasi ERP (stok, kredit, sinkronisasi), degraded mode
- SLA routing & escalation dashboard
- Invoice & payment tracking

> Semua modul di atas merupakan **Paket B**.

---

## 3. Information architecture & sitemap

### Sitemap (public)

- Home
- Products
  - Overview (filter)
  - Detail
- Education
  - Trainings & Events (listing)
  - Event detail (optional)
- Partnership
  - Become Partner (lead capture)
  - Partnership benefits (value props)
- About
- Contact
- Privacy Policy
- Terms

### CTA strategy

- Primary CTA (Home): **Explore Products** / **Become Partner**
- Persistent CTA: **WhatsApp Consult** (sticky button) + fallback: email

Konfigurasi yang harus dipastikan sebelum production (agar tidak ambigu saat implementasi):

| Parameter | Value | Notes |
|---|---|---|
| WhatsApp target number | _TBD_ | Format E.164 (contoh: `+62812...`) |
| WhatsApp prefill message | _TBD_ | Disepakati dengan Owner (tone B2B) |
| Fallback contact email | _TBD_ | Dipakai saat device tidak support deep link |

### System diagram (Option B lead pipeline)

```mermaid
graph TD
  HOME[Home] --> PRODUCTS[Products Overview]
  PRODUCTS --> PDETAIL[Product Detail]
  HOME --> EDU[Education/Events]
  EDU --> EDETAIL[Event Detail (optional)]
  HOME --> PARTNER[Partnership]
  PARTNER --> BECOME[Become Partner Form]
  HOME --> ABOUT[About]
  HOME --> CONTACT[Contact]
  HOME --> LEGAL[Privacy/Terms]
  PDETAIL --> WA[WhatsApp Consult CTA]
  HOME --> WA

  %% Lead pipeline (Option B)
  BECOME --> LEADAPI[Lead API (Option B)]
  LEADAPI --> STORE[(Durable Persistence)]
  LEADAPI --> NOTIF[Notification/Fanout]
  LEADAPI --> EXPORT[Admin Export (Access-controlled)]
```

---

## 4. FSD/IDD (pages, behaviors, data interfaces)

### Design thesis

Website harus terasa **professional B2B**:
- katalog sebagai alat *decision support*, bukan retail entertainment
- CTA jelas: konsultasi + become partner
- tanpa harga publik

### Actors (simplified)

| Actor | Capabilities |
|---|---|
| Guest | Browse katalog, baca education/events, submit lead, click WhatsApp |
| Internal Admin (content ops) | Update konten (via repo/CMS) — tidak memerlukan RBAC kompleks di Paket A |

> Paket A tidak memiliki Partner/Agent/Admin login flow.

### Pages & functional requirements

#### Home

**Components:**
- Hero (value prop)
- CTA buttons
- Brand portfolio logo strip
- 3 pillars section
- Quick categories
- Education/event highlight
- WhatsApp quick access

**Acceptance note:** hero + CTA harus terlihat pada fold mobile.

#### Products overview

**Components:**
- Category navigation
- Filter panel: Brand, Function, Audience (Salon/Barber)
- Product grid (thumbnail + short descriptor)
- Empty state + no-results guidance

**Functional:**
- filter kombinatif (AND)
- shareable URL querystring (optional)

#### Product detail

**Components:**
- Product header + breadcrumbs
- Gallery
- Summary + key benefits
- Recommended for + use cases
- How to use
- Training available (optional)
- CTA block: WhatsApp consult / Become Partner

#### Education / events

**Components:**
- Event list + highlight
- Event detail (optional)

**Functional:**
- filter by audience (Salon/Barber) (optional)

#### Partnership — Become Partner

**Goal:** mengubah minat menjadi lead yang siap ditindak.

**Components:**
- Benefits section
- Form + consent
- Success page + WhatsApp prompt

Profil field detail: lihat [Partner profiling](#5-partner-profiling-lead-capture-spec).

### IDD (data interfaces)

Paket A bisa diimplementasikan dengan 2 pendekatan:

- **Option A — Static/Repo Content (No backend changes)**
  - Konten product/event disimpan sebagai file JSON/MD di repo.
  - Form lead mengirim ke email/Google Sheet/CRM via webhook.

- **Option B — Lightweight API (selected)**
  - `GET /api/public/products`
  - `GET /api/public/products/{slug}`
  - `GET /api/public/brands`
  - `GET /api/public/categories`
  - `GET /api/public/events`
  - `POST /api/public/partner-leads`

#### Partner lead payload (example)

```json
{
  "meta": {"timestamp": "ISO8601", "source": "website"},
  "lead": {
    "business_name": "Barber X",
    "contact_name": "Andi",
    "phone_whatsapp": "+62812...",
    "city": "Surabaya",
    "salon_type": "BARBER",
    "chair_count": 6,
    "specialization": "coloring, keratin",
    "preferred_contact": "WHATSAPP",
    "consent": true
  }
}
```

---

## 5. Partner profiling (lead capture spec)

### Purpose

Profiling ringan untuk:
- mengkualifikasi lead (salon/barber, skala bisnis, minat)
- mempercepat follow-up tim sales/BD
- menjadi seed data bila upgrade ke Paket B

### Form placement

- Page: **Partnership → Become Partner**
- CTA entry points:
  - Home hero CTA “Become Partner”
  - Product detail CTA (secondary)

### Field spec

#### Required

- `business_name` (Nama Salon/Barber)
- `contact_name`
- `phone_whatsapp`
- `city`
- `salon_type` (Enum): `SALON | BARBER | BRIDAL | UNISEX | OTHER`
- `consent` (checkbox): persetujuan dihubungi

#### Optional (progressive profiling)

- `chair_count` (integer)
- `specialization` (text)
- `current_brands_used` (text)
- `monthly_spend_range` (enum; optional jika owner setuju)

### Validation rules

- WhatsApp number must be E.164-like (lenient) + normalize
- Consent must be true before submit
- Basic anti-spam: honeypot field + rate limit

### Privacy notes

- tampilkan ringkas: data dipakai untuk kontak bisnis dan tidak dijual
- retensi: default 12 bulan (atau sesuai kebijakan internal)
  - jika kebijakan internal berbeda, angka final wajib tercermin di copy Privacy Policy + SOP purge, dan disetujui saat sign-off

---

## 6. Non-functional requirements

- **Performance:** cepat di mobile; hindari asset berat.
- **SEO basics:** title/meta, canonical, sitemap.xml, robots.txt.
- **Shareability:** social metadata minimum (OpenGraph/Twitter) untuk halaman kunci.
- **Structured data:** JSON-LD minimum (Organization + Breadcrumb; Product bila feasible) dan valid.
- **Accessibility:** struktur heading, kontras, keyboard navigation.
- **Observability:** error logging + pageview/conversion events.
- **Security baseline:** security headers minimum + hardening endpoint lead (Option B).

---

## 7. SLIs & SLOs

### Availability

- **SLO:** 99.9% monthly availability (best effort)
- **SLI:** successful HTTP responses / total requests

### Web performance (user-centric)

Target (best effort):
- LCP p75 < 2.5s (mobile)
- CLS p75 < 0.1
- INP p75 < 200ms (best effort)

Catatan:
- Angka p75 idealnya diambil dari **RUM** (field data) — bukan hanya Lighthouse.

### Conversion SLIs

- WA CTA click success rate (event logged)
- Lead form submission success rate

### Alerting (minimal)

- SEV-1: error rate > 1% for 5 minutes
- SEV-1: lead submit endpoint failing continuously

Contoh rules Prometheus (minimal): `docs-paket-a/prometheus_alerts_example.yml`

---

## 8. Acceptance contract (UAT-A 01–16) + sign-off

Jika seluruh skenario PASS, maka deliverable dianggap selesai.

### UAT-01 — Homepage positioning
**Steps:** buka home di mobile dan desktop  
**Expected:** hero value proposition terlihat, CTA “Explore Products” dan “Become Partner” dapat diklik, logo brand tampil.

### UAT-02 — Products overview navigation
**Steps:** buka Products overview  
**Expected:** kategori tampil, grid produk tampil, tidak ada harga.

### UAT-03 — Filter brand/fungsi/audience
**Steps:** pilih Brand; tambah filter Audience; reset filter  
**Expected:** hasil berubah sesuai filter, empty-state jelas jika tidak ada hasil.

### UAT-04 — Product detail decision support
**Steps:** buka 3 product detail  
**Expected:** header + brand + kategori tampil, benefits/use-cases/how-to-use tampil ringkas, CTA WhatsApp tersedia.

### UAT-05 — WhatsApp contact
**Steps:** klik WhatsApp CTA dari Home + Product detail  
**Expected:** membuka WA (atau deep link), fallback contact tersedia bila device tidak support.

### UAT-06 — Become Partner lead form
**Steps:** submit form valid; coba submit tanpa consent; coba nomor WA invalid  
**Expected:** valid submit sukses + success state; invalid ditolak dengan pesan jelas.

### UAT-07 — Education/events
**Steps:** buka halaman education/events  
**Expected:** listing tampil rapi, CTA register/WA (jika ada) berfungsi.

### UAT-08 — Responsive & basic accessibility
**Steps:** cek breakpoint mobile, tablet, desktop; navigasi keyboard untuk menu  
**Expected:** layout tidak pecah, fokus terlihat.

### UAT-09 — SEO basics
**Steps:** cek title/meta; cek sitemap.xml & robots.txt  
**Expected:** metadata sesuai, sitemap dapat diakses.

### UAT-10 — Performance sanity
**Steps:** load home di koneksi lambat (simulasi)  
**Expected:** tidak ada asset blocking berlebihan; gambar ter-optimized.

### UAT-11 — Lead pipeline (Option B) reliability
**Steps:** submit form valid; lakukan 3x submit cepat; lakukan 1x submit dengan payload invalid  
**Expected:**
- submit valid sukses dan tidak hilang (persisted)
- spam/throttle bekerja (request berlebihan ditolak dengan state yang jelas)
- invalid payload ditolak oleh server-side validation

### UAT-12 — Lead admin export (access-controlled)
**Steps:** akses endpoint export/inbox tanpa kredensial; lalu akses dengan kredensial yang benar; download/export leads  
**Expected:**
- tanpa kredensial ditolak
- dengan kredensial berhasil export (CSV/format lain yang disepakati)
- data minimal sesuai kebutuhan follow-up (nama, kontak, timestamp, metadata penting)

### UAT-13 — Legal & static pages
**Steps:** buka About, Contact, Privacy Policy, Terms dari navigasi/footer  
**Expected:** semua halaman dapat diakses, copy placeholder diperbolehkan tetapi struktur rapi dan link tidak broken.

### UAT-14 — 404 & error fallback
**Steps:** akses URL yang tidak ada (mis. `/this-page-does-not-exist`)  
**Expected:** tampil halaman 404 yang user-friendly dan ada navigasi kembali ke Home.

### UAT-15 — Social metadata
**Steps:** inspeksi `<head>` pada Home + Product detail  
**Expected:** ada OpenGraph metadata minimal (title/description/image) dan Twitter card metadata; tidak ada metadata kosong/invalid.

### UAT-16 — Core Web Vitals reporting (RUM)
**Steps:** buka Home, lakukan interaksi ringan (scroll/click), lalu cek bahwa event Web Vitals terkirim  
**Expected:** metric set minimal (LCP/CLS/INP atau yang disupport) ter-report tanpa mem-blok UI.

Catatan verifikasi payload (minimum):
- ada identifier untuk dedupe (mis. `metric_id`),
- ada dimensi URL untuk diagnosis SPA (mis. `page_url_initial` dan `page_url_current`),
- pengiriman non-blocking (mis. `sendBeacon` / `fetch` keepalive) dan tidak bergantung pada event `unload`.

### UAT sign-off record (PASS + Evidence)

| Field | Value |
|---|---|
| Status | **PENDING** |
| Approved by | _[Nama, jabatan]_ |
| Approval date | _[YYYY-MM-DD]_ |
| Approval method | _Email / WA / Meeting minutes_ |
| Evidence link | _[URL / path ke bukti: email screenshot / minutes / ticket]_ |

---

## 9. Definition of Done (Done = PASS + Evidence)

### Done = PASS + Evidence

Sebuah item dianggap DONE jika:
- memenuhi acceptance criteria (termasuk edge cases), dan
- ada evidence (link, screenshot, log, atau hasil test) di PR atau catatan rilis.

### Functional DoD (conversion path)

#### WhatsApp CTA
- Deep link benar (format nomor + pesan prefill bila ada)
- Ada fallback bila device tidak support deep link
- Event analytics “cta_whatsapp_click” terkirim

#### Become Partner form
- Client-side validation jelas
- Server-side validation ada (tidak percaya input client)
- Success state + error state jelas
- Anti-spam minimum: honeypot + rate limit/throttle

### Lead pipeline DoD (Option B)

- Lead **persisted** (durable) sebelum dianggap sukses
- Ada idempotency / duplicate handling
- Ada mekanisme notifikasi (fanout) + retry/outbox (minimal at-least-once)
- Ada admin export/inbox yang **access-controlled**

### SEO + performance DoD

- Title/meta per page sesuai UAT
- `sitemap.xml` + `robots.txt` tersedia
- Social metadata (OpenGraph + Twitter) tersedia untuk halaman kunci
- Structured data (JSON-LD minimum) tersedia dan valid
- Gambar ter-optimized sesuai policy
- Core Web Vitals RUM wiring aktif (metric terkirim, non-blocking)
  - Metodologi **field/RUM** dan pelaporan memakai **p75** (bukan rata-rata)
  - Target threshold CWV:
    - LCP: $\le 2.5s$ (good)
    - INP: $\le 200ms$ (good)
    - CLS: $\le 0.1$ (good)
  - Reporting minimal breakdown **mobile vs desktop**
  - Lifecycle-safe sending: flush di `visibilitychange` → `hidden` (bukan `unload`)
  - Dedupe menggunakan `metric_id`
  - Kirim `page_url_initial` + `page_url_current` untuk diagnosis SPA

### Accessibility DoD (minimum; aligned with WCAG 2.2 AA where relevant)

- Fokus keyboard terlihat dan **tidak tertutup** oleh sticky header/CTA (termasuk sticky WhatsApp) pada breakpoint utama.
- Target interaktif utama cukup besar untuk tap di mobile (atau memenuhi pengecualian yang valid).
- Tidak ada interaksi yang *wajib* drag-only tanpa kontrol alternatif.

### Observability & ops DoD

- Error logging untuk failure di lead pipeline
- Minimal metric/indikator: lead submit success rate
- Runbook: cara deploy, rollback, incident (SEV-1/2)

### Quality gates DoD

- Playwright smoke untuk: WA CTA + lead form
- Integration test untuk lead API (contract + rate limit)
- UAT-A (01–16) PASS dengan evidence

### Engineering excellence (baseline)

- Versi runtime & dependency **dipin** (lockfile) dan berada pada **supported lifecycle window**
- Aturan UI/CSS konsisten (token-first; fokus terlihat)
- Ada lint/typecheck gate di CI

### Security/privacy DoD (minimum)

- Secrets tidak ada di repo (env/secret store)
- Endpoint admin/export tidak terbuka publik tanpa proteksi
- Consent text jelas di form (privacy policy tersedia)
- Security headers baseline diterapkan (lihat [Security headers baseline](#15-security-headers-baseline))
- Ada traceability minimum berbasis **OWASP ASVS v5.0.0** (lihat [ASVS traceability](#16-owasp-asvs-v500-minimal-traceability))

---

## 10. Audit checklist + audit→WBS mapping

### 10.1 Audit checklist

#### 0) Sign-off & traceability (hard gates)

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| SIGNOFF-01 | Blueprint sign-off recorded | Bagian **Blueprint sign-off record** terisi dan status bukan PENDING | Link/screenshot approval | Tidak boleh “approved by chat tanpa bukti” |
| SIGNOFF-02 | UAT sign-off recorded | Bagian **UAT sign-off record** terisi dan status bukan PENDING | Link/screenshot approval | Gate untuk klaim “DONE” |
| TRACE-01 | DoD/UAT/Audit coverage lengkap | Audit mapping menutup semua item audit; UAT PASS punya evidence pack | Link evidence pack | Menghindari requirement “menggantung” |

#### 1) UX & content structure

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| UX-01 | Navigation & IA jelas | Header/footer konsisten, semua link utama tidak broken | Screenshot + link list | Termasuk footer legal links |
| UX-02 | Conversion path “WA + Become Partner” aman | CTA WA tersedia + fallback; Form bisa submit valid/invalid | Video/screenshot + UAT PASS | Jalur kritikal |
| UX-03 | Static pages tersedia | About/Contact/Privacy/Terms bisa diakses dan rapi | Screenshot | Copy placeholder boleh |
| UX-04 | 404 & error fallback | URL invalid menampilkan 404 ramah; error boundary aman | Screenshot | Jangan “blank page” |

#### 2) Accessibility (baseline)

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| A11Y-01 | Keyboard navigation | Menu + fokus bisa dipakai tanpa mouse; fokus terlihat | Screen recording | Minimal tab order wajar |
| A11Y-02 | Forms usable | Label/placeholder jelas; error state terbaca; consent checkbox accessible | Screenshot | Hindari error hanya warna |
| A11Y-03 | Focus not obscured (WCAG 2.2) | Indikator fokus tidak tertutup sticky header/CTA | Screen recording | SC 2.4.11 (AA) |
| A11Y-04 | Target size minimum (WCAG 2.2) | Target interaktif utama memenuhi minimum atau pengecualian valid | Screenshot + note | SC 2.5.8 (AA) |
| A11Y-05 | No drag-only interactions (WCAG 2.2) | Jika ada drag, ada kontrol alternatif setara | Screen recording | SC 2.5.7 (AA) |

#### 3) SEO & shareability

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| SEO-01 | Metadata per halaman | Title/description sesuai page; canonical bila perlu | View-source | Hindari empty/duplicate |
| SEO-02 | robots.txt + sitemap.xml | Endpoint dapat diakses | URL evidence | Ikuti konvensi Next.js |
| SEO-03 | Social metadata | OG/Twitter tags ada + reasonable defaults | View-source | Minimal title/desc/image |
| SEO-04 | Structured data (JSON-LD) | Organization + Breadcrumb valid (Product optional) | Validator screenshot | Jangan klaim palsu |

#### 4) Performance & Core Web Vitals

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| PERF-01 | Image/font policy | next/image + next/font (atau setara); CLS terkendali | Lighthouse screenshot | Fokus LCP/CLS |
| PERF-02 | CWV RUM wiring | Metric set minimal terkirim via analytics endpoint | Network screenshot | Non-blocking |
| PERF-03 | CWV methodology + attribution | p75 + breakdown mobile/desktop; payload: `metric_id`, `page_url_initial`, `page_url_current` | Dashboard/query + payload sample | Lihat ADR-0002 |
| PERF-04 | Lifecycle-safe analytics + bfcache-friendly | Flush `visibilitychange`→`hidden`; tidak bergantung `unload`; bfcache tidak diblok | DevTools bfcache screenshot | bfcache penting |
| PERF-05 | (Opsional) bfcache diagnostics | Jika perlu, gunakan `PerformanceNavigationTiming.notRestoredReasons` (Chrome) | Screenshot/notes | Jangan bergantung string reason |

#### 5) Security (minimum)

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| SEC-01 | Server-side validation | Allowlist + length limits; invalid ditolak | Test log | Jangan percaya client |
| SEC-02 | Input hardening | Content-Type check, max body size, reject logging | Log snippet | Prevent abuse |
| SEC-03 | Anti-spam + rate limit | Honeypot + throttle; 429 on abuse | Test evidence | Protect lead endpoint |
| SEC-04 | Admin/export protected | Export/inbox butuh kredensial | UAT evidence | Jangan public |
| SEC-05 | Secrets management | Secret di env/secret store | Repo scan note | No secrets in repo |
| SEC-06 | Security headers baseline | Header snapshot sesuai baseline | Response headers snapshot | Lihat baseline section |
| SEC-07 | OWASP ASVS traceability (v5.0.0) | Ada tabel requirement→evidence untuk scope lead API + export | Evidence links | Format `v5.0.0-...` |

#### 6) Observability & ops

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| OPS-01 | Error logging lead pipeline | Error lead tidak silent; ada log/trace minimal | Screenshot/log | Fokus drop lead |
| OPS-02 | Metric “lead success rate” | Ada indikator sukses/gagal per periode | Dashboard/metrics | Minimal cukup |
| OPS-03 | Runbook deploy/rollback | Ada langkah deploy, rollback, incident | Doc link | Handover-ready |

Catatan implementasi (Option B Lead API):

- Endpoint metrics (admin-only): `GET /metrics`
- Metric utama untuk OPS-02:
  - `lead_api_lead_submissions_total{result="accepted|invalid|spam|internal|invalid_json|rate_limited"}`
  - (ops queue health) `lead_api_lead_notifications_pending_ready_total`
  - (ops queue health) `lead_api_lead_notifications_oldest_ready_pending_age_seconds`

#### 7) Quality gates

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| QA-01 | Playwright smoke | WA CTA + lead form smoke stabil | CI log/report | Prevent regressions |
| QA-02 | API integration tests | Contract + rate limit PASS | Test log | Coverage minimal |
| QA-03 | UAT PASS | UAT-01..16 PASS + evidence | Evidence pack | DoD |

#### 8) Engineering governance (versioning + UI/CSS)

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| ENG-01 | Supported versions + pinning | Runtime/deps dipin; lockfile committed; policy lihat ADR-0003 | Evidence file + CI log | Supported lifecycle window |
| ENG-02 | UI tokens + styling discipline | Token-first; fokus terlihat; tidak ada style ad-hoc | UI screenshots + snippet | Lihat ADR-0004 |

### 10.2 Audit → WBS mapping

| Audit ID | Covered by WBS epic | Covered by detailed task IDs | Covered by UAT | Notes |
|---|---|---|---|---|
| SIGNOFF-01 | A1 | A1-04 | (gate) | Blueprint sign-off + evidence link required |
| SIGNOFF-02 | A5 | A5-07 | (gate) | Client UAT approval + evidence link required |
| TRACE-01 | A5 | A5-03 | UAT-01..16 | Evidence pack + mapping completeness |
| UX-01 | A2 | A2-01 | UAT-01/02 | Navigation + footer links |
| UX-02 | A2, A4, A6 | A2-03, A2-08, A2-12–A2-13, A4-06, A6-01..A6-07 | UAT-05/06/11/12 | Conversion path end-to-end |
| UX-03 | A2 | A2-16..A2-18 | UAT-13 | Static/legal pages |
| UX-04 | A2 | A2-19 | UAT-14 | 404 + error fallback |
| A11Y-01 | A2 | A2-14, A2-15 | UAT-08 | Keyboard + focus |
| A11Y-02 | A2 | A2-12..A2-14 | UAT-06/08 | Form error states |
| A11Y-03 | A2 | A2-14, A2-15 | UAT-08 | Focus not obscured |
| A11Y-04 | A2 | A2-14, A2-15 | UAT-08 | Target size |
| A11Y-05 | A2 | A2-14, A2-15 | UAT-08 | Dragging alternatives |
| SEO-01 | A4 | A4-01 | UAT-09 | Title/desc/canonical |
| SEO-02 | A4 | A4-02 | UAT-09 | robots + sitemap |
| SEO-03 | A4 | A4-03 | UAT-15 | OG/Twitter |
| SEO-04 | A4 | A4-04 | (audit) | JSON-LD validation |
| PERF-01 | A4 | A4-05 | UAT-10 | Image/font policy |
| PERF-02 | A4 | A4-07 | UAT-16 | CWV RUM wiring |
| PERF-03 | A4, A5 | A4-07, A5-03 | UAT-16 | p75 schema + URL attribution |
| PERF-04 | A4, A5 | A4-07, A5-03 | (audit) | Lifecycle-safe sending; bfcache |
| PERF-05 | A4 | A4-07 | (optional) | notRestoredReasons |
| SEC-01 | A6 | A6-01 | UAT-11 | Server-side allowlist validation |
| SEC-02 | A6 | A6-06 | UAT-11 | content-type/body limits + reject logging |
| SEC-03 | A6 | A6-05 | UAT-11 | honeypot + rate limit |
| SEC-04 | A6 | A6-04 | UAT-12 | access control export |
| SEC-05 | A7 | A7-01 | (doc) | no secrets in repo |
| SEC-06 | A7 | A7-02 | (audit) | security headers baseline |
| SEC-07 | A7 | A7-05 | (audit) | ASVS minimal traceability |
| OPS-01 | A4/A6 | A6-07 | UAT-11 (indirect) | logging lead failures |
| OPS-02 | A4/A6 | A6-07 | (ops) | lead success rate metric |
| OPS-03 | A7 | A7-03, A5-05 | (handover) | runbook + rollback |
| QA-01 | A5 | A5-01 | (CI) | Playwright smoke |
| QA-02 | A5 | A5-02 | UAT-11 | API integration tests |
| QA-03 | A5 | A5-03 | UAT-01..16 | evidence pack |
| ENG-01 | A7, A5 | A7-04, A5-06 | (CI) | pinning + lifecycle compliance |
| ENG-02 | A2 | A2-20 | UAT-08 (indirect) | UI tokens + discipline |

---

## 11. WBS (workstreams) + delivery plan

### Assumptions

- Konten kreatif disediakan klien; tim dev menyediakan placeholder dan struktur.
- Tidak ada login, tidak ada harga publik.
- Fokus: UX cepat, profesional, mudah di-maintain.
- **Option B dipilih:** lead capture menggunakan **lightweight API**.
- “Selesai” = **production-ready**: ada acceptance evidence, anti-spam, observability, dan runbook minimum.

### Workstreams

#### Epic A1 — Discovery & IA (PM/Architect)
- A1.1 Alignment scope Paket A vs Paket B (dokumen + sign-off)
- A1.2 Sitemap + content inventory
- A1.3 Copy guideline (tone B2B)
- A1.4 Blueprint sign-off (client approval + evidence)

#### Epic A2 — UI/Frontend
- A2.1 Layout shell + navigation + footer
- A2.2 Homepage sections
- A2.3 Products overview (filter + grid)
- A2.4 Product detail template
- A2.5 Education/events pages
- A2.6 Partnership + lead form + success state
- A2.7 Responsive + accessibility pass
- A2.8 Static pages: About, Contact, Privacy, Terms
- A2.9 Global 404 + error fallback UI

#### Epic A3 — Content system
- A3.1 Define content schema (brand/category/product/event)
- A3.2 Seed content pipeline (JSON/MD)

#### Epic A4 — SEO / Analytics / Ops
- A4.1 SEO basics: metadata, sitemap, robots
- A4.2 Social metadata + JSON-LD minimum
- A4.3 Analytics events
- A4.4 Core Web Vitals (RUM) reporting wiring
- A4.5 Error logging + basic monitoring

#### Epic A5 — QA & UAT
- A5.1 Test cases execution (UAT-A)
- A5.2 Bug fix & polish
- A5.3 Client UAT sign-off + evidence

#### Epic A6 — Lead API (Option B)
- A6.1 Lead API contract + validation
- A6.2 Lead persistence + idempotency
- A6.3 Delivery fanout + retry/outbox
- A6.4 Admin export + access control
- A6.5 Anti-spam + rate limiting
- A6.6 Input validation hardening

#### Epic A7 — Production readiness
- A7.1 Secrets/config management
- A7.2 Security headers baseline
- A7.3 Deployment wiring + rollback
- A7.4 Runbook + handover checklist

### Delivery plan (indicative)

- Week 1: A1 + A2.1–A2.3 (Home + Products overview)
- Week 2: A2.4–A2.7 + A3 + A4
- Week 3 (buffer): A6 + A7 + A5 + polish + content finalization

### Stage gates (hard stops)

- **Gate 0 — Scope freeze:** §2 dan §8 dianggap final (perubahan = change request).
- **Gate 1 — Blueprint sign-off:** tabel “Blueprint sign-off record” status bukan PENDING + evidence.
- **Gate 2 — Staging readiness:** smoke test lulus (Home/Products/Detail/WA CTA/Lead form) + baseline security headers siap diambil.
- **Gate 3 — UAT PASS:** UAT-01..16 PASS + evidence pack terisi.
- **Gate 4 — Production release:** deploy, smoke test ulang, monitoring aktif, dan rencana rollback siap.

---

## 12. Work breakdown (detailed) + estimation envelope

### 12.1 Detailed tasks (likely)

Effort expressed as **MD** (1 MD = 8 hours focused work).

> **Catatan penting (hindari salah tafsir):** Kolom **Class (A/B/C)** di tabel ini adalah **band risiko/kritis** untuk kebutuhan *planning* (dipakai untuk multiplier di §12.2), **bukan** label “tingkat sulit” atau “rate card”.
> 
> - Class **A** = jalur konversi/ops/security yang *hard gate* (bisa saja implementasinya sederhana, tapi dampaknya kritikal & rework biasanya muncul di akhir).
> - Class **B** = pekerjaan sistematis dengan banyak *paper cuts* (SEO/perf/a11y/ops/evidence).
> - Class **C** = UI/struktur yang relatif stabil setelah pola dasar jadi.
>
> Jika ingin menghitung biaya berbasis **kompleksitas day rate**, buat **tier terpisah** (mis. T1/T2/T3) atau mapping yang eksplisit dan disetujui Finance/Owner.

| ID | Task | Effort (MD) | Class | Notes |
|---|---|---:|:---:|---|
| A1-01 | Scope alignment Paket A vs B (sign-off) | 0.5 | A | Signed boundary |
| A1-02 | Sitemap + content inventory | 0.75 | B | Covers key pages |
| A1-03 | Copy guideline (tone B2B) | 0.5 | B | Tone rules |
| A1-04 | Blueprint sign-off + evidence capture | 0.25 | B | Fill blueprint sign-off record |
| A2-01 | Layout shell (header/nav/footer) | 0.75 | C | Responsive |
| A2-20 | Design tokens + UI/CSS scaffolding | 0.75 | B | Token-first |
| A2-02 | Homepage sections | 1.0 | C | Mobile fold CTA visible |
| A2-03 | Sticky WhatsApp CTA + fallback | 0.75 | A | Deep link + fallback |
| A2-04 | Products overview page | 1.25 | C | No public pricing |
| A2-05 | Filter panel | 1.25 | B | AND filters; reset works |
| A2-06 | Shareable filter URL | 0.5 | B | Querystring stable |
| A2-07 | Product detail template | 1.25 | C | Decision support blocks |
| A2-08 | Product CTA block | 0.75 | A | Consistent placement |
| A2-09 | Education/events listing | 0.75 | C | Listing clean |
| A2-10 | Event detail page | 0.5 | C | Optional |
| A2-11 | Partnership page | 0.75 | C | Value props clear |
| A2-12 | Become Partner form | 1.5 | A | Valid/invalid states |
| A2-13 | Success state + WhatsApp prompt | 0.5 | A | Confirmation |
| A2-14 | Basic accessibility pass | 1.25 | B | Focus visible; labels usable |
| A2-15 | Responsive QA pass | 0.75 | B | No layout break |
| A2-16 | About page | 0.25 | C | B2B tone |
| A2-17 | Contact page | 0.25 | C | WA + fallback contact |
| A2-18 | Privacy + Terms pages | 0.25 | B | Placeholder allowed |
| A2-19 | Global 404 + error fallback UI | 0.5 | B | No blank page |
| A3-01 | Content schema definition | 1.0 | B | JSON/MD structure |
| A3-02 | Content seeding pipeline | 1.0 | C | Repo-based content |
| A4-01 | SEO basics metadata per page | 1.0 | B | Titles/description |
| A4-02 | sitemap.xml + robots.txt | 0.5 | B | Accessible endpoints |
| A4-03 | Social metadata | 0.75 | B | Share cards |
| A4-04 | Structured data JSON-LD minimum | 0.75 | B | Validates |
| A4-05 | Image + font optimization policy | 0.75 | B | Prevent CLS |
| A4-06 | Analytics events | 0.75 | A | Event names fixed |
| A4-07 | CWV RUM wiring | 0.75 | B | p75-ready + lifecycle-safe |
| A6-01 | Lead API contract + endpoint | 1.0 | A | Server-side validation |
| A6-02 | Lead persistence + idempotency | 1.0 | A | Durable storage |
| A6-03 | Fanout + retry/outbox | 1.0 | A | At-least-once |
| A6-04 | Admin export + access protection | 0.75 | A | Protected export |
| A6-05 | Anti-spam (honeypot + rate limit) | 0.75 | A | 429 on abuse |
| A6-06 | Input hardening (max body, content-type, reject logging) | 0.5 | A | Prevent malformed input |
| A6-07 | Error logging + metrics lead pipeline | 0.75 | A | Success rate visible |
| A7-01 | Secrets/config management | 0.5 | A | No secrets in repo |
| A7-02 | Security headers baseline | 0.75 | B | Snapshot evidence |
| A7-05 | ASVS v5.0.0 minimal traceability | 0.5 | B | Fill evidence links |
| A7-03 | Deployment wiring + runbook | 1.0 | B | Deploy + rollback |
| A7-04 | Version pinning + lifecycle compliance | 0.5 | B | Lockfile + CI |
| A5-01 | Playwright smoke tests | 1.0 | A | WA CTA + lead form |
| A5-02 | API integration tests | 0.75 | A | Contract + rate limit |
| A5-06 | CI quality gates | 0.5 | B | lint + typecheck + smoke |
| A5-03 | UAT-A execution + evidence | 1.25 | B | PASS evidence |
| A5-07 | Client UAT sign-off + evidence | 0.25 | B | Fill UAT sign-off record |
| A5-04 | Bugfix & polish wave | 2.0 | B | Includes retest |
| A5-05 | Production readiness review + handover | 0.75 | B | Checklist + owner handoff |

**Total (likely):** **40.25 MD**

### 12.2 Estimation ranges (envelope)

Breakdown by class (from table):
- Class A: **12.75 MD**
- Class B: **19.75 MD**
- Class C: **7.75 MD**

Range multipliers:

| Class | Best multiplier | Likely | Worst multiplier | Rationale |
|---:|---:|---:|---:|---|
| A | 0.95× | 1.00× | 1.35× | Jalur kritikal: rework & integration sering muncul di akhir |
| B | 0.90× | 1.00× | 1.25× | Banyak “paper cuts”: SEO/perf/a11y/ops + evidence |
| C | 0.90× | 1.00× | 1.15× | UI stabil tapi bisa kena rework minor |

Results:

$$\text{Best} = 12.75\times0.95 + 19.75\times0.90 + 7.75\times0.90 \approx 36.86\ \text{MD}$$

$$\text{Likely} = 40.25\ \text{MD}$$

$$\text{Worst} = 12.75\times1.35 + 19.75\times1.25 + 7.75\times1.15 \approx 50.81\ \text{MD}$$

Rounded:
- **Best:** ~**36.9 MD**
- **Likely:** **40.25 MD**
- **Worst:** ~**50.8 MD**

### Planning decision (current)

Gunakan **Worst = ~50.8 MD** sebagai baseline planning/delivery.

Optional maximal planning cap (P95-ish):

$$\text{Maximal} = \text{Worst}\times1.15 \approx 58.5\ \text{MD}$$

---

## 13. Architecture decisions (ADR-0001..0004)

### ADR-0001 — Lead API hosting target (Option B)

**Decision:** default rekomendasi host Lead API di **dedicated backend service**. Jika constraint mengharuskan Next.js route handler, tetap wajib memenuhi persistence non-lossy dan export protected.

**Persistence decision (current):** gunakan **managed Postgres (Supabase — Free plan)** sebagai persistence awal untuk lead pipeline.

**Risk note (wajib disadari & disetujui):** berdasarkan informasi di halaman pricing Supabase, **Free projects dipause setelah 1 minggu tidak ada aktivitas**, **tidak ada automatic backups**, dan **log retention lebih pendek**. Karena Paket A punya hard gate “lead persisted” (UAT-11/DoD), keputusan ini dianggap **PASS** hanya jika:
- risiko tersebut diterima Owner/Finance (evidence sign-off), dan
- ada **upgrade trigger** yang jelas: upgrade ke plan berbayar sebelum/ketika free plan constraints mulai mengancam reliability (mis. kebutuhan backup/retention, kebutuhan always-on yang lebih ketat, dsb.).

**Consequences:** repo implementasi harus menyediakan `.env.example`/secret store untuk `LEAD_API_ADMIN_TOKEN`; UAT-11/12 tetap gate.

### ADR-0002 — Core Web Vitals (CWV) RUM strategy

- Library: `web-vitals`
- Reporting: **p75** + minimal breakdown **mobile vs desktop**
- Transport: `sendBeacon()` + fallback `fetch(..., {keepalive:true})`
- Lifecycle: flush `visibilitychange`→`hidden` (bukan `unload`)
- Dedupe: `metric_id`
- SPA-safe attribution: `page_url_initial` + `page_url_current`
- Soft navigations: eksperimen terpisah (bukan acceptance gate)

### ADR-0003 — Tech stack & versioning policy (2025–2026)

- Node.js production: Active LTS / Maintenance LTS (default Jan 2026: Node 24.x; fallback 22.x)
- Next.js: default 16.x (mengikuti support policy)
- React: mengikuti kompatibilitas Next.js
- TypeScript: di-lock sebagai devDependency + lockfile (Jan 2026: 5.9)
- Go (jika dedicated backend): target default Jan 2026: Go 1.25.x (supported window)

Operational policy:
- lockfile wajib; CI fail bila drift
- patch/security updates cepat (≤ 7 hari bila relevan)
- routine minor maintenance 1×/bulan
- major upgrades diperlakukan sebagai change project (testing + rollback + doc update)

### ADR-0004 — UI/CSS strategy & frontend architecture

- Token-first design system minimal (CSS variables)
- Default utility-first (mis. Tailwind), CSS Modules hanya untuk pengecualian
- No runtime CSS-in-JS overhead
- Folder architecture: `components/ui`, `components/sections`, `components/forms`
- A11y baseline baked-in (WCAG 2.2 risk areas)
- Performance guardrails: `next/font`, `next/image`

---

## 14. Ops & governance pack

### Operating principle

- Perubahan konten harus **terkontrol** (traceable).
- Error harus **terlihat** (logging/metrics minimal).
- Jalur lead (Become Partner) **tidak boleh putus** (persisted + export protected).

### Incident severity

| Level | Definition | Example | Target response |
|---|---|---|---|
| SEV-1 | Website down / lead form down | 5xx mass, deployment broken | < 30 min |
| SEV-2 | Major feature degraded | filter rusak, WA CTA broken | < 4 hours |
| SEV-3 | Content issue | typo, gambar missing | < 24 hours |

### Change management + sign-off (hard gate)

- Blueprint dianggap approved hanya jika sign-off record terisi + evidence.
- UAT dianggap complete hanya jika sign-off record terisi + evidence.

Evidence & execution artifacts (dipakai saat implementasi):

- Backlog eksekusi: `artifacts/paket-a/backlog.md`
- Evidence pack (PASS + Evidence): `artifacts/paket-a/evidence-pack/`
- Kickoff plan: `artifacts/paket-a/kickoff.md`

#### RAB & procurement (baseline + syarat approval)

Bagian ini mendokumentasikan **baseline biaya** untuk Paket A yang dipakai sebagai acuan approval budget dan setup vendor. Karena jalur lead adalah komponen kritikal, setiap angka harus **bisa dibuktikan**.

**Syarat approval (wajib):**
- Setiap line item memiliki **bukti** (pricing link/invoice/receipt) dan **kurs** USD→IDR pada tanggal approval.
- Bukti approval budget (Owner/Finance) disimpan sebagai **lampiran** di `artifacts/paket-a/evidence-pack/01-signoff/`.

**Domain (untuk procurement & DNS):**
- Primary domain: `alfabeautycosmetica.com`
- Redirect/defensive domain: `alfabeautycosmetica.co` (redirect ke `.com`)

### Baseline biaya — CapEx (delivery)

Envelope biaya delivery (IDR) berdasarkan estimasi Best/Likely/Worst:
- Best: ~**13.017.000**
- Likely: **15.112.500**
- Worst (baseline planning): ~**19.071.000**

### Baseline biaya — OpEx (running)

Baseline operasi yang dipakai saat ini (Scenario M / Medium):
- Kurs: `usd_to_idr = 16851.60`
- Parameter operasi: `vercel_seats = 2`, `upstash_usd = 10`, `sentry_usd = 26`, database = **Supabase Free**

Ringkasan OpEx (IDR):
- Subtotal OpEx (tanpa Domain/DNS/Email): **Rp1.280.722 / bulan**
- Domain/DNS/Email (Year-1 total): **Rp1.148.774 / tahun** (≈ **Rp95.732 / bulan**)
- Total OpEx (dengan Domain/DNS/Email): **Rp1.376.454 / bulan**
- Total OpEx tahun 1 (dengan Domain/DNS/Email): **Rp16.517.438**

**Lampiran bukti domain/email (Year-1 purchase):** `artifacts/paket-a/evidence-pack/01-signoff/domain_email_quote_2026-01-10.md`.

### Parameter procurement yang harus diputuskan sebelum billing/PO aktif

- **Vercel:** jumlah seat yang benar-benar dibayar (`vercel_seats`).
- **Upstash:** pilihan plan (free/payg/fixed) dan/atau target `commands_per_month`.
- **Sentry:** pilihan plan (Developer/Team/Business) dan kebijakan billing (annual/monthly).
- **Kurs USD→IDR:** sumber kurs + bukti snapshot pada tanggal approval.
- **Renewal Year-2+ (domain/email):** angka renewal wajib berasal dari invoice/quote renewal (bukan asumsi/promo).

#### Scope freeze checklist (pra-implementasi)

Paket A dianggap **scope-frozen** bila:

- [ ] In-scope/out-of-scope di §2 tidak ada item “abu-abu”.
- [ ] UAT-A 01–16 di §8 dianggap final (perubahan = change request).
- [ ] Risiko utama disepakati (contoh: content readiness, hosting, DNS/SSL).
- [ ] “Option B Lead API” dipastikan benar-benar dipakai (bukan revert ke webhook tanpa persistence).

#### Sign-off workflow (PASS + Evidence)

1) Jalankan UAT-A 01–16 (staging), isi `artifacts/paket-a/evidence-pack/02-uat/index.md` + lampiran bukti.  
2) Kumpulkan bukti security/perf/a11y/ops (folder evidence pack masing-masing).  
3) Minta approval Blueprint + UAT dan simpan buktinya di `artifacts/paket-a/evidence-pack/01-signoff/`.  

> Catatan: Status sign-off di tabel dalam dokumen ini boleh tetap **PENDING** sampai bukti approval di folder evidence pack tersedia.

### Lead handling SOP

- Lead masuk harus memiliki owner (tim sales/BD)
- SLA follow-up internal disarankan: < 24 jam
- Jika jalur integrasi lead gagal: fallback manual (export inbox)

Operational minimum (Option B):
- lead **wajib persisted** (durable)
- admin export/inbox access-controlled
- logging + indikator sederhana (success rate)

### Runbook (deploy/rollback/incident)

**Deploy (staging/prod):** deploy via pipeline; smoke test Home/Products/Detail/WA CTA/Lead form.  
**Rollback:** lakukan bila SEV-1 atau error rate tinggi; rollback ke release known-good; ulangi smoke test + 1 submit lead valid.  
**Lead pipeline health checks:** monitor success rate + error counts; jika drop dicurigai, submit lead test dan cek persistence/notification.

#### Alertability + triage (minimal, Paket A)

File contoh alert rules: `docs-paket-a/prometheus_alerts_example.yml`.

Prinsip triage:
- **Mitigate first** (rollback / disable risky change) untuk SEV-1.
- Gunakan **metrics** untuk melihat *scope* (berapa banyak, sejak kapan).
- Gunakan **logs** untuk melihat *why*.
- Gunakan **exemplars (trace_id)** untuk menghubungkan spike latency ke request representatif (tanpa menambah label/cardinality).

**Cara pakai exemplar `trace_id`:**

1) Buka panel latency (mis. `lead_api_http_request_duration_seconds`) di Grafana/Prometheus.
2) Klik exemplar (jika tersedia) untuk mendapatkan `trace_id`.
3) Cari di log server event `http_request` pada field `trace` yang berisi traceparent.
  - `trace` adalah string W3C `traceparent`.
  - `trace_id` adalah substring 32-hex (bagian ke-2 dari `traceparent`).

> Catatan: exemplars biasanya tampil jika scraper menggunakan OpenMetrics. Endpoint `/metrics` mendukung negosiasi format via `Accept`.

##### Playbook: LeadAPIHighErrorRate / LeadAPISubmitFailingContinuously

1) Pastikan ada traffic (agar rasio bermakna):
  - lihat `sum(rate(lead_api_http_requests_total{route="/api/v1/leads"}[5m]))`
2) Periksa error burst (5xx):
  - `sum(rate(lead_api_http_requests_total{route="/api/v1/leads",status_class="5xx"}[5m]))`
3) Periksa hasil lead pipeline (OPS-02):
  - `sum(rate(lead_api_lead_submissions_total[5m])) by (result)`
4) Mitigasi cepat:
  - rollback release terakhir (jika error muncul pasca deploy)
  - jalankan 1 submit lead valid (smoke) dan verifikasi persistence + export

##### Playbook: LeadNotificationBacklogStuck

1) Lihat backlog (ready vs delayed):
  - `lead_api_lead_notifications_pending_ready_total`
  - `lead_api_lead_notifications_pending_delayed_total`
2) Lihat usia oldest ready:
  - `lead_api_lead_notifications_oldest_ready_pending_age_seconds`
3) Cek endpoint admin stats (lebih informatif per status):
  - `GET /api/v1/admin/lead-notifications/stats` (admin-only)
4) Interpretasi cepat:
  - `pending_ready_total` tinggi + `oldest_ready_pending_age_seconds` tinggi → worker/sender tidak jalan atau provider hard-fail
  - `pending_delayed_total` tinggi → retry/backoff meningkat (provider flaky)

##### Playbook: LeadAPISlowP95

1) Konfirmasi p95 query sesuai route template (tidak pakai raw path):
  - `histogram_quantile(0.95, sum(rate(lead_api_http_request_duration_seconds_bucket{route="/api/v1/leads"}[5m])) by (le))`
2) Gunakan exemplars (trace_id) untuk mengambil contoh request lambat, lalu korelasikan ke log.
3) Mitigasi cepat:
  - jika lambat karena dependency (DB) → cek health DB / pool / timeouts
  - rollback jika regresi pasca deploy

##### Playbook: LeadAPIInternalLeadFailures

1) Konfirmasi ada kenaikan result=internal:
  - `sum(rate(lead_api_lead_submissions_total{result="internal"}[5m]))`
2) Korelasikan dengan log event:
  - `http_request` (status 5xx pada route leads)
  - `lead_notification_enqueue_failed` (enqueue outbox gagal)
3) Mitigasi:
  - rollback / degrade mode (jika ada) / matikan channel notifikasi bermasalah bila memicu error (ops decision)

Ops shortcut (admin-only):

- `GET /api/v1/admin/lead-notifications/stats` → cek backlog outbox (counts per status + oldest ready pending age).
  - Jika `pending_ready_count` tinggi dan `oldest_ready_pending_age_seconds` besar → worker/sender kemungkinan bermasalah.
  - Jika `pending_delayed_count` tinggi → banyak retry/backoff (indikasi provider email/webhook flaky).

### Production checklist (summary)

**Pre-launch:** DNS/SSL (primary `alfabeautycosmetica.com` + redirect `alfabeautycosmetica.co`), WA number + prefill message, robots/sitemap, analytics, OG/Twitter, JSON-LD, CWV RUM (non-blocking; payload dims), security headers snapshot.  
**Launch day:** smoke test flows, monitor logs, monitor success rate.  
**Post-launch:** review CWV p75 from RUM, tuning rate limit.

---

## 15. Security headers baseline

**Status:** Proposed (becomes PASS when evidence snapshot is attached)

### Baseline headers (recommended)

#### Website responses (HTML)

1) **Content Security Policy (CSP)**
- `Content-Security-Policy`
- Baseline directives (starting point):
  - `base-uri 'none'`
  - `object-src 'none'`
  - `frame-ancestors 'none'`
  - `upgrade-insecure-requests`

2) `X-Content-Type-Options: nosniff`

3) `Referrer-Policy: strict-origin-when-cross-origin`

4) `Strict-Transport-Security: max-age=31536000; includeSubDomains` (tambah `preload` hanya setelah siap)

5) `Permissions-Policy: geolocation=(), microphone=(), camera=()`

6) Clickjacking:
- utamakan CSP `frame-ancestors`
- `X-Frame-Options: DENY` opsional (legacy)

#### Lead API responses (JSON)

1) `Content-Type: application/json; charset=utf-8`
2) `X-Content-Type-Options: nosniff`
3) `Cache-Control: no-store` (khusus admin/export)
4) `Referrer-Policy: no-referrer` (opsional)

### Verification & evidence

Evidence yang diterima:
- Screenshot DevTools headers (Home + lead submit + admin/export), atau
- header snapshot via tooling (curl/HTTP client), atau
- screenshot konfigurasi CDN/WAF + contoh HTTP response.

Minimal evidence set:
- 1 snapshot **Home (HTML)**
- 1 snapshot **Lead submit (JSON)**
- 1 snapshot **Admin/export**

### Exception policy

Jika baseline tidak bisa dipenuhi 100%:
- catat header yang tidak bisa dipasang
- jelaskan alasan
- tambahkan mitigasi
- lampirkan evidence

---

## 16. OWASP ASVS v5.0.0 minimal traceability

**Status:** PENDING (becomes PASS when evidence links are filled)  
**Scope:** Option B Lead API + admin/export endpoint  

| ASVS ID | Requirement (excerpt/summary) | Applies to | Implementation notes | Evidence link |
|---|---|---|---|---|
| v5.0.0-V2.2.1 | Positive validation (allowlist/expected structure) for business/security decisions (L1) | lead submit | Schema constraints; reject invalid; log rejects safely | `internal/domain/lead/lead.go` (Validate) + `internal/service/lead_service.go` |
| v5.0.0-V2.2.2 | Input validation enforced at trusted service layer (L1) | lead submit | Server-side validation; client validation not trusted | `internal/service/lead_service.go` (Create validates) |
| v5.0.0-V1.2.4 | Parameterized queries/ORM protections against injection (L1) | persistence | Parameterized queries; no SQL concat | `internal/repository/postgres/lead_repository.go` + `internal/repository/postgres/lead_notification_repository.go` |
| v5.0.0-V2.4.1 | Anti-automation controls (L2) | lead submit | Rate limiting; honeypot; 429 on abuse | `internal/handler/app.go` (limiter) + `internal/domain/lead/lead.go` (honeypot) |
| v5.0.0-V8.3.1 | Authorization enforced at trusted service layer (L1) | admin/export | Auth token/basic auth/allowlist; server-side checks | `internal/handler/admin_leads.go` (requireAdminToken) + `internal/handler/app.go` |
| v5.0.0-V1.2.10 | Protect against CSV/Formula Injection (L3) | export CSV | Escape dangerous leading chars (`=`,`+`,`-`,`@`, tab, null) | `internal/handler/admin_leads.go` (csvSafe) |
| v5.0.0-V4.1.1 | Correct Content-Type incl. charset (L1) | API responses | Ensure JSON content-type w/ charset | `internal/handler/json.go` + evidence: `artifacts/paket-a/evidence-pack/03-security/2026-01-12_lead-api_headers_snapshot.md` |
| v5.0.0-V3.4.4 | `X-Content-Type-Options: nosniff` (L2) | website/API | Enable header at edge/app | `internal/handler/app.go` + evidence: `artifacts/paket-a/evidence-pack/03-security/2026-01-12_lead-api_headers_snapshot.md` |
| v5.0.0-V3.4.6 | CSP `frame-ancestors` prevents embedding by default (L2) | website | `frame-ancestors 'none'` unless allowlisted | Runbook: `artifacts/paket-a/evidence-pack/03-security/website_headers_verification_runbook.md` (evidence tracked in `artifacts/paket-a/evidence-pack/03-security/index.md`) |
| v5.0.0-V3.4.3 | CSP baseline includes `object-src 'none'` and `base-uri 'none'` (L2) | website | Ensure directives present | Runbook: `artifacts/paket-a/evidence-pack/03-security/website_headers_verification_runbook.md` (evidence tracked in `artifacts/paket-a/evidence-pack/03-security/index.md`) |

Acceptable evidence examples:
- integration test logs
- header snapshots
- code pointers (file path + line range)
- sample CSV export showing escaping

---

## 17. AI workflow productivity (optional)

Objective function:

$$
\textbf{maximize } P(\text{UAT-A PASS} \wedge \text{Lead Path Healthy} \wedge \text{Professional UX})
$$

Key rules:
- No-placeholder policy for lead path/CTA/instrumentation.
- Task classes A/B/C: Class A = conversion+ops critical; gate with stronger tests.
- Workflow: spec-first → counterexamples → diff-limited implementation → red-team review.

---

## 18. Legacy mapping (old file → new section)

Dokumen berikut **disupersede** oleh dokumen ini (untuk traceability):

| Old file | New location |
|---|---|
| `docs-paket-a/_deprecated/dev/implementation_pack.md` | (overall) this document |
| `docs-paket-a/_deprecated/blueprint.md` | §1–3 + blueprint sign-off |
| `docs-paket-a/_deprecated/fsd-idd.md` | §4 |
| `docs-paket-a/_deprecated/partner_profiling.md` | §5 |
| `docs-paket-a/_deprecated/SLI_SLO.md` | §7 |
| `docs-paket-a/_deprecated/uat.md` | §8 |
| `docs-paket-a/_deprecated/dev/definition_of_done.md` | §9 |
| `docs-paket-a/_deprecated/dev/audit_checklist.md` | §10.1 |
| `docs-paket-a/_deprecated/dev/audit_wbs_mapping.md` | §10.2 |
| `docs-paket-a/_deprecated/wbs.md` | §11 |
| `docs-paket-a/_deprecated/dev/work_breakdown_complete.md` | §12.1 |
| `docs-paket-a/_deprecated/dev/estimation_ranges.md` | §12.2 |
| `docs-paket-a/_deprecated/dev/adr_0001_lead_api_hosting.md` | §13 |
| `docs-paket-a/_deprecated/dev/adr_0002_web_vitals_rum_strategy.md` | §13 |
| `docs-paket-a/_deprecated/dev/adr_0003_stack_versioning_policy.md` | §13 |
| `docs-paket-a/_deprecated/dev/adr_0004_ui_css_architecture.md` | §13 |
| `docs-paket-a/_deprecated/governance.md` | §14 |
| `docs-paket-a/_deprecated/prod/runbook.md` | §14 |
| `docs-paket-a/_deprecated/prod/production_checklist.md` | §14 |
| `docs-paket-a/_deprecated/dev/security_headers_baseline.md` | §15 |
| `docs-paket-a/_deprecated/dev/asvs_v5_traceability.md` | §16 |
| `docs-paket-a/_deprecated/prod/system_diagrams.md` | §3 |
| `docs-paket-a/_deprecated/dev/ai_workflow_productivity.md` | §17 |
