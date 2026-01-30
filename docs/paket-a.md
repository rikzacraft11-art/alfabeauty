# Paket A — Website B2B + Lead Capture (WhatsApp + Become Partner)

## PT. Alfa Beauty Cosmetica

**Version:** 4.1 (Hybrid Next.js + Supabase DB + email notifikasi; Audit Ready)
**Date:** January 26, 2026
**Scope:** Website Paket A + **Become Partner lead persistence di Supabase + email notifikasi + export CSV**
**Architecture Note:** Project ini menggunakan **Hybrid Architecture** (Next.js App Router dengan `runtime='nodejs'`), bukan murni Static Website. Hal ini diperlukan untuk fitur validasi server-side dan API routes.

Dokumen ini adalah **spesifikasi implementasi + kontrak penerimaan (UAT/DoD)** untuk Paket A.

**Aturan konsistensi dokumen:**

- `docs-paket-a/proposal.md` adalah acuan komersial (scope, UAT, biaya, OpEx).
- Dokumen ini adalah acuan teknis untuk cara implementasi dan evidence.
- Jika ada konflik, yang menang adalah: **proposal.md untuk scope/UAT/angka**, dokumen ini untuk **detail teknis**.

---

## Daftar isi

- [1. Executive intent](#1-executive-intent)
- [2. Scope boundary (anti scope creep)](#2-scope-boundary-anti-scope-creep)
- [3. Information architecture & sitemap](#3-information-architecture--sitemap)
- [4. FSD/IDD (pages, behaviors, data interfaces)](#4-fsdidd-pages-behaviors-data-interfaces)
- [5. Partner profiling (lead capture spec)](#5-partner-profiling-lead-capture-spec)
- [6. Non-functional requirements](#6-non-functional-requirements)
- [7. SLIs & SLOs](#7-slis--slos)
- [8. Acceptance contract (UAT-A 01–19) + sign-off](#8-acceptance-contract-uat-a-01%E2%80%9319--sign-off)
- [9. Definition of Done (Done = PASS + Evidence)](#9-definition-of-done-done--pass--evidence)
- [10. Audit checklist + audit→WBS mapping](#10-audit-checklist--auditwbs-mapping)
- [11. WBS (workstreams) + delivery plan](#11-wbs-workstreams--delivery-plan)
- [12. Work breakdown (detailed) + estimation envelope](#12-work-breakdown-detailed--estimation-envelope)
- [13. Architecture decisions (ADR-0001..0004)](#13-architecture-decisions-adr-00010004)
- [14. Ops & governance pack](#14-ops--governance-pack)
- [15. Security headers baseline](#15-security-headers-baseline)
- [16. OWASP ASVS v5.0.0 minimal traceability](#16-owasp-asvs-v500-minimal-traceability)
- [17. AI workflow productivity (internal)](#17-ai-workflow-productivity-internal)
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
- Lead “Become Partner” **tersimpan di database (Supabase) sebagai source of truth**, dan **email internal** digunakan sebagai **notifikasi operasional** untuk follow-up.
- Owner/PIC dapat melakukan **export data lead (CSV)** untuk operasional tanpa copy manual dari email.
- Konversi dipantau via event analytics (WA click + lead submit). Pengukuran performa mengandalkan tools standar (mis. Lighthouse/PageSpeed/CrUX bila tersedia), tanpa wiring RUM khusus.

### Company introduction (approved copy)

_PT Alfa Beauty is a professional beauty distribution company dedicated to providing products, education, and technical support for salons and barbershops in Indonesia. We represent carefully selected international brands and work as a strategic partner to professionals, ensuring every product we distribute delivers consistent performance, real-world relevance, and is supported by proper technical knowledge._

### Blueprint sign-off record (PASS + Evidence)

Blueprint dianggap “approved” hanya bila ada sign-off eksplisit + evidence.

| Field | Value |
|---|---|
| Status | **APPROVED** |
| Approved by | Ponbun Labs |
| Approval date | 21 Januari 2026 |
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
- Lead pipeline “Become Partner”: server-side validation + anti-spam minimum + **persistence di Supabase** + **email notifikasi**
- Export lead: **download CSV** (mekanisme minimal untuk Owner/PIC; tanpa admin dashboard kompleks)
- Integrasi **CMS (free tier)** untuk konten yang disepakati
- Setup **GA4 + Google Search Console** (verifikasi + submit sitemap)
- Runbook + production checklist
- **i18n (bilingual EN/ID)**

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
  - Event detail
  - Article detail
- Partnership
  - Become Partner (lead capture)
  - Partnership benefits (value props)
- About
- Contact
- Privacy Policy
- Terms
- 404

### CTA strategy

- Primary CTA (Home): **Explore Products** / **Become Partner**
- Persistent CTA: **WhatsApp Consult** (sticky button) + fallback: email

Konfigurasi yang harus dipastikan sebelum production (agar tidak ambigu saat implementasi):

| Parameter | Value | Notes |
|---|---|---|
| WhatsApp target number | _TBD_ | Format E.164 (contoh: `+62812...`) |
| WhatsApp prefill message | _TBD_ | Disepakati dengan Owner (tone B2B) |
| Fallback contact email | _TBD_ | Dipakai saat device tidak support deep link |

### System diagram (lead persistence + email notif + export CSV)

```mermaid
graph TD
  HOME[Home] --> PRODUCTS[Products Overview]
  PRODUCTS --> PDETAIL[Product Detail]
  HOME --> EDU[Education/Events]
  EDU --> EDETAIL[Event Detail (jika disepakati)]
  HOME --> PARTNER[Partnership]
  PARTNER --> BECOME[Become Partner Form]
  HOME --> ABOUT[About]
  HOME --> CONTACT[Contact]
  HOME --> LEGAL[Privacy/Terms]
  PDETAIL --> WA[WhatsApp Consult CTA]
  HOME --> WA

  %% Lead delivery (final scope)
  BECOME --> API[Server-side Lead API]
  API --> DB[Supabase (Leads DB)]
  API --> EMAIL[Internal Email Inbox (Perusahaan) — notification]
  OWNER[Owner/PIC] --> CSV[Export CSV]
  CSV --> DB
```

---

## 4. FSD/IDD (pages, behaviors, data interfaces)

### Design thesis

Website harus terasa **professional B2B**:

- katalog sebagai alat _decision support_, bukan retail entertainment
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
- URL querystring dapat disalin (basic; tanpa requirement edge case kompleks)

#### Product detail

**Components:**

- Product header + breadcrumbs
- Gallery
- Summary + key benefits
- Recommended for + use cases
- How to use
- Training available (jika ada konten yang disediakan Perusahaan)
- CTA block: WhatsApp consult / Become Partner

#### Education / events

**Components:**

- Event list + highlight
- Event detail
- Article detail

**Functional:**

- filter by audience (Salon/Barber) bila disepakati sebagai change request

#### Partnership — Become Partner

**Goal:** mengubah minat menjadi lead yang siap ditindak.

**Components:**

- Benefits section
- Form + consent
- Success page + WhatsApp prompt

Profil field detail: lihat [Partner profiling](#5-partner-profiling-lead-capture-spec).

### IDD (data interfaces)

Paket A pada scope ini memakai pendekatan sederhana namun reliabel:

- Konten marketing/teks/gambar yang disepakati dikelola melalui **CMS (free tier)**.
- Konten katalog produk dan education dapat dikelola melalui CMS sesuai keputusan implementasi (minimal: field yang dibutuhkan untuk listing + detail).
- Form lead (Become Partner) diproses melalui endpoint server-side untuk validasi + anti-spam, lalu:
  - **disimpan ke Supabase (database) sebagai source of truth**,
  - mengirim **email notifikasi** ke inbox internal Perusahaan (bukan satu-satunya penyimpanan),
  - mendukung **export CSV** untuk Owner/PIC.

#### Partner lead payload (actual contract)

Frontend mengirim payload **flat** ke endpoint server-side (mis. route handler di Next.js) yang melakukan validasi + anti-spam minimum, lalu mengirim email ke inbox internal:

```json
{
  "business_name": "Barber X",
  "contact_name": "Andi",
  "phone_whatsapp": "+62812...",
  "city": "Surabaya",
  "salon_type": "BARBER",
  "consent": true,
  "chair_count": 6,
  "specialization": "coloring, keratin",
  "current_brands_used": "Brand A, Brand B",
  "monthly_spend_range": "5-10jt",
  "email": "andi@example.com",
  "message": "Interested in partnership",
  "page_url_initial": "https://...",
  "page_url_current": "https://...",
  "company": ""
}
```

> **Catatan:** field tambahan (`chair_count`, `specialization`, dll.) dapat dibiarkan kosong. Field `company` dipakai sebagai honeypot anti-spam.

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

#### Tambahan (progressive profiling)

- `chair_count` (integer)
- `specialization` (text)
- `current_brands_used` (text)
- `monthly_spend_range` (enum; bila disetujui Owner)

### Validation rules

- WhatsApp number must be E.164-like (lenient) + normalize
- Consent must be true before submit
- Basic anti-spam: honeypot field + rate limit

### Privacy notes

- tampilkan ringkas: data dipakai untuk kontak bisnis dan tidak dijual
- retensi: kebijakan internal Perusahaan (default 12 bulan untuk operasional B2B)
  - karena lead disimpan di Supabase (database Perusahaan) dan email hanya notifikasi operasional, kebijakan retensi berlaku untuk database dan mailbox internal (SOP internal Perusahaan) dan perlu dicerminkan di Privacy Policy.

---

## 6. Non-functional requirements

- **Performance:** cepat di mobile; hindari asset berat.
- **SEO basics:** title/meta, canonical, sitemap.xml, robots.txt.
- **Shareability:** social metadata minimum (OpenGraph/Twitter) untuk halaman kunci.
- **Structured data:** JSON-LD minimum (Organization + Breadcrumb; Product bila feasible) dan valid.
- **Accessibility:** struktur heading, kontras, keyboard navigation.
- **Observability:** error logging + pageview/conversion events.
- **Security baseline:** security headers minimum + hardening endpoint lead (server-side validation + anti-spam minimum).

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

- Tanpa wiring RUM khusus, pengukuran performa mengandalkan Lighthouse/PageSpeed dan/atau CrUX bila tersedia.

### Conversion SLIs

- WA CTA click success rate (event logged)
- Lead form submission success rate

### Alerting (minimal)

- SEV-1: error rate > 1% for 5 minutes
- SEV-1: lead submit endpoint failing continuously

Contoh rules Prometheus (minimal): `docs-paket-a/prometheus_alerts_example.yml`

---

## 8. Acceptance contract (UAT-A 01–19) + sign-off

Jika seluruh skenario PASS, maka deliverable dianggap selesai.

### UAT-01 — Homepage positioning

**Steps:** buka home di mobile dan desktop  
**Expected:** hero/value proposition terlihat, CTA dapat diklik, logo/brand tampil.

### UAT-02 — Products overview navigation

**Steps:** buka Products overview  
**Expected:** kategori tampil, grid produk tampil, tidak ada harga.

### UAT-03 — Filter brand/fungsi/audience

**Steps:** pilih filter; reset filter  
**Expected:** hasil berubah sesuai filter, empty-state jelas jika tidak ada hasil.

### UAT-04 — Product detail

**Steps:** buka beberapa product detail  
**Expected:** struktur konten rapi, CTA WhatsApp tersedia.

### UAT-05 — WhatsApp contact

**Steps:** klik WhatsApp CTA dari Home + Product detail  
**Expected:** membuka WA/deep link; fallback tersedia bila device tidak mendukung.

### UAT-06 — Become Partner lead form

**Steps:** submit valid; coba submit tanpa consent; coba nomor WA invalid  
**Expected:** valid sukses + success state; invalid ditolak dengan pesan jelas.

### UAT-07 — Education/Events

**Steps:** buka halaman education/events  
**Expected:** listing rapi; CTA register/WA berfungsi (bila ada).

### UAT-08 — Bilingual (ID/EN)

**Steps:** akses halaman in-scope pada ID dan EN  
**Expected:** semua halaman in-scope dapat diakses di kedua bahasa tanpa merusak navigasi.

### UAT-09 — SEO basics

**Steps:** cek title/meta; cek sitemap.xml & robots.txt  
**Expected:** metadata sesuai; sitemap dan robots dapat diakses.

### UAT-10 — Performance sanity

**Steps:** load home pada simulasi koneksi lambat  
**Expected:** halaman tetap ringan; gambar teroptimasi.

### UAT-11 — Lead persistence + email notification

**Steps:** submit lead valid; cek database; cek email notifikasi  
**Expected:** submit valid sukses; record tersimpan di Supabase; email notifikasi masuk.

### UAT-12 — Lead export (CSV)

**Steps:** lakukan export CSV menggunakan mekanisme yang disepakati (mis. view/export Supabase atau endpoint export yang diproteksi)  
**Expected:** Owner/PIC dapat mengunduh data lead sebagai file CSV.

### UAT-13 — Tracking + GA4

**Steps:** klik WA dan submit lead; cek GA4 Realtime/DebugView  
**Expected:** event tercatat di GA4 sesuai naming yang disepakati.

### UAT-14 — Google Search Console

**Steps:** cek verifikasi GSC dan status sitemap  
**Expected:** situs terverifikasi dan sitemap tersubmit.

### UAT-15 — Legal & static pages

**Steps:** buka About/Contact/Privacy/Terms dari navigasi/footer  
**Expected:** halaman dapat diakses; link tidak broken.

### UAT-16 — 404

**Steps:** akses URL yang tidak ada  
**Expected:** tampil halaman 404 yang user-friendly.

### UAT-17 — CMS editing

**Steps:** ubah teks/gambar yang disepakati melalui CMS; cek tampilan di produksi/staging  
**Expected:** perubahan tampil sesuai environment.

### UAT-18 — Handover & training

**Steps:** serah terima dokumentasi + sesi pelatihan  
**Expected:** dokumentasi diserahkan dan sesi pelatihan dilakukan.

### UAT-19 — Social metadata

**Steps:** inspeksi `<head>` pada Home + Product detail  
**Expected:** OpenGraph + Twitter card ada dan valid (tidak kosong).

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

### Lead pipeline DoD (Supabase + email notif + export)

- Server-side validation (allowlist + length limits)
- Anti-spam minimum: honeypot + rate limit/throttle (429 on abuse)
- **Persistence:** record lead tersimpan di Supabase (source of truth)
- **Notification:** email notifikasi terkirim ke inbox internal
- **Export:** Owner/PIC bisa export/download CSV (mekanisme minimal yang disepakati)
- Evidence: contoh record di Supabase + contoh email notifikasi + contoh file CSV + bukti penolakan payload invalid + bukti 429 saat abuse test

### SEO + performance DoD

- Title/meta per page sesuai UAT
- `sitemap.xml` + `robots.txt` tersedia
- Social metadata (OpenGraph + Twitter) tersedia untuk halaman kunci
- Structured data (JSON-LD minimum) tersedia dan valid
- Gambar ter-optimized sesuai policy
- Performa dijaga via kebijakan asset (image/font) + verifikasi Lighthouse/PageSpeed pada halaman kunci (Home + Products + Product detail)

### Accessibility DoD (minimum; aligned with WCAG 2.2 AA where relevant)

- Fokus keyboard terlihat dan **tidak tertutup** oleh sticky header/CTA (termasuk sticky WhatsApp) pada breakpoint utama.
- Target interaktif utama cukup besar untuk tap di mobile (atau memenuhi pengecualian yang valid).
- Tidak ada interaksi yang _wajib_ drag-only tanpa kontrol alternatif.

### Observability & ops DoD

- Error logging untuk failure pada endpoint lead delivery
- Minimal metric/indikator: lead submit success rate (berbasis event analytics)
- Runbook: cara deploy, rollback, incident (SEV-1/2)

### Quality gates DoD

- Playwright smoke untuk: WA CTA + lead form
- UAT-A (01–19) PASS dengan evidence

### Engineering excellence (baseline)

- Versi runtime & dependency **dipin** (lockfile) dan berada pada **supported lifecycle window**
- Aturan UI/CSS konsisten (token-first; fokus terlihat)
- Ada lint/typecheck gate di CI

### Security/privacy DoD (minimum)

- Secrets tidak ada di repo (env/secret store)
- Tidak ada admin dashboard kompleks pada Paket A; export CSV disediakan untuk Owner/PIC dengan kontrol akses minimal.
- Supabase: akses write untuk lead dilakukan dari server-side (service role) dan akses admin dibatasi ke PIC.
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
| SEO-04 | Structured data (JSON-LD) | Organization + Breadcrumb valid (Product bila feasible) | Validator screenshot | Jangan klaim palsu |

#### 4) Performance (baseline)

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| PERF-01 | Image/font policy | next/image + next/font (atau setara); CLS terkendali | Lighthouse screenshot | Fokus LCP/CLS |
| PERF-02 | Lighthouse/PageSpeed sanity | Home + Products + Product detail memenuhi baseline (best effort) | Lighthouse screenshot | Fokus LCP/CLS/INP (lab) |
| PERF-03 | bfcache sanity (bila relevan) | bfcache tidak terblokir untuk navigasi dasar (best effort) | DevTools bfcache screenshot | Menghindari regresi UX |

#### 5) Security (minimum)

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| SEC-01 | Server-side validation | Allowlist + length limits; invalid ditolak | Test log | Jangan percaya client |
| SEC-02 | Input hardening | Content-Type check, max body size, reject logging | Log snippet | Prevent abuse |
| SEC-03 | Anti-spam + rate limit | Honeypot + throttle; 429 on abuse | Test evidence | Protect lead endpoint |
| SEC-04 | No public admin dashboard | Tidak ada admin dashboard kompleks; export CSV diproteksi untuk Owner/PIC | (audit) | Mengurangi risiko |
| SEC-05 | Secrets management | Secret di env/secret store | Repo scan note | No secrets in repo |
| SEC-06 | Security headers baseline | Header snapshot sesuai baseline | Response headers snapshot | Lihat baseline section |
| SEC-07 | OWASP ASVS traceability (v5.0.0) | Ada tabel requirement→evidence untuk scope endpoint lead submit + headers | Evidence links | Format `v5.0.0-...` |

#### 6) Observability & ops

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| OPS-01 | Error logging lead pipeline | Error lead tidak silent; ada log/trace minimal | Screenshot/log | Fokus drop lead |
| OPS-02 | Metric “lead submit success rate” | Ada indikator submit sukses/gagal per periode | Dashboard/metrics | Minimal cukup |
| OPS-03 | Runbook deploy/rollback | Ada langkah deploy, rollback, incident | Doc link | Handover-ready |

Catatan implementasi:

- Untuk verifikasi UAT-11, gunakan Supabase project (staging) dan alamat email internal (test inbox) yang disepakati.

#### 7) Quality gates

| ID | Check | How to verify (acceptance) | Evidence | Notes |
|---|---|---|---|---|
| QA-01 | Playwright smoke | WA CTA + lead form smoke stabil | CI log/report | Prevent regressions |
| QA-02 | UAT PASS | UAT-01..19 PASS + evidence | Evidence pack | DoD |

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
| TRACE-01 | A5 | A5-03 | UAT-01..19 | Evidence pack + mapping completeness |
| UX-01 | A2 | A2-01 | UAT-01/02 | Navigation + footer links |
| UX-02 | A2, A4 | A2-03, A2-08, A2-12–A2-13, A4-03, A4-04 | UAT-05/06/11 | Conversion path end-to-end |
| UX-03 | A2 | A2-16..A2-18 | UAT-15 | Static/legal pages |
| UX-04 | A2 | A2-19 | UAT-16 | 404 + error fallback |
| A11Y-01 | A2 | A2-14, A2-15 | UAT-08 | Keyboard + focus |
| A11Y-02 | A2 | A2-12..A2-14 | UAT-06/08 | Form error states |
| A11Y-03 | A2 | A2-14, A2-15 | UAT-08 | Focus not obscured |
| A11Y-04 | A2 | A2-14, A2-15 | UAT-08 | Target size |
| A11Y-05 | A2 | A2-14, A2-15 | UAT-08 | Dragging alternatives |
| SEO-01 | A4 | A4-01 | UAT-09 | Title/desc/canonical |
| SEO-02 | A4 | A4-02 | UAT-09 | robots + sitemap |
| SEO-03 | A4 | A4-03 | UAT-19 | OG/Twitter |
| SEO-04 | A4 | A4-04 | (audit) | JSON-LD validation |
| PERF-01 | A4 | A4-05 | UAT-10 | Image/font policy |
| PERF-02 | A4 | A4-05 | UAT-10 | Lighthouse/PageSpeed sanity |
| SEC-01 | A4 | A4-08 | UAT-11 | Server-side allowlist validation |
| SEC-02 | A4 | A4-08 | UAT-11 | content-type/body limits + reject logging |
| SEC-03 | A4 | A4-08 | UAT-11 | honeypot + rate limit |
| SEC-05 | A7 | A7-01 | (doc) | no secrets in repo |
| SEC-06 | A7 | A7-02 | (audit) | security headers baseline |
| SEC-07 | A7 | A7-05 | (audit) | ASVS minimal traceability |
| OPS-01 | A4 | A4-08 | UAT-11 (indirect) | logging lead failures |
| OPS-02 | A4 | A4-03 | (ops) | lead submit success rate |
| OPS-03 | A7 | A7-03, A5-05 | (handover) | runbook + rollback |
| QA-01 | A5 | A5-01 | (CI) | Playwright smoke |
| QA-03 | A5 | A5-03 | UAT-01..19 | evidence pack |
| ENG-01 | A7, A5 | A7-04, A5-06 | (CI) | pinning + lifecycle compliance |
| ENG-02 | A2 | A2-20 | UAT-08 (indirect) | UI tokens + discipline |

---

## 11. WBS (workstreams) + delivery plan

### Assumptions

- Konten kreatif disediakan klien; tim dev menyediakan placeholder dan struktur.
- Tidak ada login, tidak ada harga publik.
- Fokus: UX cepat, profesional, mudah di-maintain.
- Lead capture tersimpan di **Supabase (database)**; email internal dipakai sebagai **notifikasi**; tersedia **export CSV**.
- “Selesai” = **production-ready**: ada acceptance evidence, anti-spam minimum, dan runbook minimum.

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
- A3.2 CMS setup (free tier) + content seeding

#### Epic A4 — SEO / Analytics / Ops

- A4.1 SEO basics: metadata, sitemap, robots
- A4.2 Social metadata + JSON-LD minimum
- A4.3 Analytics events
- A4.4 Setup GA4 + Google Search Console (verifikasi + submit sitemap)
- A4.5 Lead pipeline wiring (Supabase + email notif + export) + logging minimum

#### Epic A5 — QA & UAT

- A5.1 Test cases execution (UAT-A)
- A5.2 Bug fix & polish
- A5.3 Client UAT sign-off + evidence

#### Epic A7 — Production readiness

- A7.1 Secrets/config management
- A7.2 Security headers baseline
- A7.3 Deployment wiring + rollback
- A7.4 Runbook + handover checklist

### Delivery plan (indicative)

- Week 1: A1 + A2.1–A2.3 (Home + Products overview)
- Week 2: A2.4–A2.7 + A3 + A4
- Week 3 (buffer): A7 + A5 + polish + content finalization

### Stage gates (hard stops)

- **Gate 0 — Scope & UAT lock:** §2 dan §8 dianggap final (perubahan = change request).
- **Gate 1 — Blueprint sign-off:** tabel “Blueprint sign-off record” status bukan PENDING + evidence.
- **Gate 2 — Staging readiness:** smoke test lulus (Home/Products/Detail/WA CTA/Lead form) + baseline security headers siap diambil.
- **Gate 3 — UAT PASS:** UAT-01..19 PASS + evidence pack terisi.
- **Gate 4 — Production release:** deploy, smoke test ulang, monitoring aktif, dan rencana rollback siap.

---

## 12. Work breakdown (detailed) + estimation envelope

### 12.1 Detailed tasks (likely)

Effort expressed as **MD** (1 MD = 8 hours focused work).

> **Catatan penting (hindari salah tafsir):** Kolom **Class (A/B/C)** di tabel ini adalah **band risiko/kritis** untuk kebutuhan _planning_, **bukan** label “tingkat sulit” atau “rate card”.
>
> - Class **A** = jalur konversi/ops/security yang _hard gate_ (bisa saja implementasinya sederhana, tapi dampaknya kritikal & rework biasanya muncul di akhir).
> - Class **B** = pekerjaan sistematis dengan banyak _paper cuts_ (SEO/perf/a11y/ops/evidence).
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
| A2-10 | Event detail page | 0.5 | C | In-scope |
| A2-10b | Article detail page | 0.5 | C | In-scope |
| A2-11 | Partnership page | 0.75 | C | Value props clear |
| A2-12 | Become Partner form | 1.5 | A | Valid/invalid states |
| A2-13 | Success state + WhatsApp prompt | 0.5 | A | Confirmation |
| A2-14 | Basic accessibility pass | 1.25 | B | Focus visible; labels usable |
| A2-15 | Responsive QA pass | 0.75 | B | No layout break |
| A2-16 | About page | 0.25 | C | B2B tone |
| A2-17 | Contact page | 0.25 | C | WA + fallback contact |
| A2-18 | Privacy + Terms pages | 0.25 | B | Placeholder allowed |
| A2-19 | Global 404 + error fallback UI | 0.5 | B | No blank page |
| A3-01 | Content model definition | 1.0 | B | CMS model (product/event/pages) |
| A3-02 | CMS setup + seeding | 1.0 | C | Free tier + initial content |
| A4-01 | SEO basics metadata per page | 1.0 | B | Titles/description |
| A4-02 | sitemap.xml + robots.txt | 0.5 | B | Accessible endpoints |
| A4-03 | Social metadata | 0.75 | B | Share cards |
| A4-04 | Structured data JSON-LD minimum | 0.75 | B | Validates |
| A4-05 | Image + font optimization policy | 0.75 | B | Prevent CLS |
| A4-06 | Analytics events | 0.75 | A | Event names fixed |
| A4-07 | Setup GA4 + Google Search Console | 0.5 | B | Verifikasi + submit sitemap |
| A4-08 | Lead pipeline wiring (Supabase + email notif + export CSV) | 1.0 | A | Validation + anti-spam + persistence + notif + export |
| A7-01 | Secrets/config management | 0.5 | A | No secrets in repo |
| A7-02 | Security headers baseline | 0.75 | B | Snapshot evidence |
| A7-05 | ASVS v5.0.0 minimal traceability | 0.5 | B | Fill evidence links |
| A7-03 | Deployment wiring + runbook | 1.0 | B | Deploy + rollback |
| A7-04 | Version pinning + lifecycle compliance | 0.5 | B | Lockfile + CI |
| A5-01 | Playwright smoke tests | 1.0 | A | WA CTA + lead form |
| A5-02 | Lead pipeline verification (staging) | 0.75 | A | Bukti record Supabase + email notif + export CSV + reject invalid + 429 abuse |
| A5-06 | CI quality gates | 0.5 | B | lint + typecheck + smoke |
| A5-03 | UAT-A execution + evidence | 1.25 | B | PASS evidence |
| A5-07 | Client UAT sign-off + evidence | 0.25 | B | Fill UAT sign-off record |
| A5-04 | Bugfix & polish wave | 2.0 | B | Includes retest |
| A5-05 | Production readiness review + handover | 0.75 | B | Checklist + owner handoff |

Catatan: angka komersial final (MD dan Fixed Price) mengacu ke `docs-paket-a/proposal.md` agar tidak terjadi duplikasi angka yang berisiko beda versi.

---

## 13. Architecture decisions (ADR-0001..0004)

### ADR-0001 — Lead pipeline strategy (Supabase + email notif + export)

**Decision:** lead “Become Partner” diproses server-side untuk validasi + anti-spam minimum, kemudian:

1) disimpan di **Supabase (database)** sebagai source of truth,
2) mengirim **email notifikasi** ke inbox internal Perusahaan,
3) mendukung **export CSV** untuk Owner/PIC.

**Security note:** endpoint lead memakai server-side validation + anti-spam minimum untuk mencegah spam ke inbox internal/DB.

### ADR-0002 — Web performance measurement (no RUM wiring)

- Baseline: verifikasi Lighthouse/PageSpeed untuk halaman kunci (Home + Products + Product detail)
- Fokus: menjaga LCP/CLS/INP secara best effort tanpa menambah wiring RUM khusus

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
- Folder architecture:
  - `components/ui` — primitives, icons, buttons, links
  - `components/site` — layout: SiteHeader, SiteFooter, MobileDrawer, etc.
  - `components/home`, `components/products`, `components/education` — page-specific sections
  - `components/lead` — form components
  - `components/i18n`, `components/seo` — cross-cutting concerns
- A11y baseline baked-in (WCAG 2.2 risk areas)
- Performance guardrails: `next/font`, `next/image`

---

## 14. Ops & governance pack

### Operating principle

- Perubahan konten harus **terkontrol** (traceable).
- Error harus **terlihat** (logging/metrics minimal).
- Jalur lead (Become Partner) **tidak boleh putus** (validasi server-side + persistence Supabase + email notifikasi + export).

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

#### RAB & procurement (ringkas)

Angka CapEx/OpEx final mengacu ke `docs-paket-a/proposal.md` agar Owner/Finance mengaudit **1 sumber angka**.

**Domain (untuk DNS):**

- Primary domain: `alfabeautycosmetica.com`
- Redirect/defensive domain: `alfabeautycosmetica.co` (redirect ke `.com`)

**Garansi bug fix pasca go-live:**

- **90 hari kalender (3 bulan)** sejak tanggal go-live: Vendor melakukan bug fix untuk defect yang terverifikasi berasal dari implementasi Vendor pada scope Paket A.
- Garansi ini tidak mencakup perubahan scope/fitur baru, perubahan konten besar, atau perubahan akibat kebijakan/platform pihak ketiga.

**Maintenance (pasca garansi):**

- Tersedia **Paket M2 Light** (Rp 100.000/bulan): hingga 4× perubahan konten kecil, perbaikan bug minor, kuota 1 jam/bulan, SLA next business day.
- Detail lihat `docs-paket-a/proposal.md` §10.

**Kepemilikan aset digital:**

- Kode sumber: diserahkan ke Perusahaan pada saat handover.
- Aset desain (Figma): diserahkan ke Perusahaan.
- Akun Vercel/Supabase/CMS/GA4/GSC: berada di pihak Perusahaan; Vendor sebagai collaborator selama implementasi.
- Detail lihat `docs-paket-a/proposal.md` §4.1.

**Backup Supabase:**

- Vendor menyiapkan skrip backup terjadwal (atau instruksi manual yang jelas) dan langkah restore yang terdokumentasi.
- Detail playbook lihat §14 "Backup & restore Supabase — playbook minimal".

**Termin pembayaran:**

- **35%** saat ruang lingkup dan UAT disepakati.
- **35%** saat staging siap UAT.
- **30%** saat go-live.
- Detail lihat `docs-paket-a/proposal.md` §11.

### Parameter yang harus diputuskan sebelum go-live

- **Vercel:** jumlah seat yang benar-benar dibayar.
- **Kurs USD→IDR:** sumber kurs + bukti snapshot pada tanggal approval.
- **Lead notification email:** alamat email tujuan + kebijakan spam/quarantine.
- **Email deliverability:** domain/From address yang dipakai untuk pengirim + akses DNS untuk setup **SPF/DKIM/DMARC**.
- **Supabase:** PIC owner untuk akses admin + kebijakan backup/retention.

#### Kickoff checklist (pra-implementasi)

Paket A dianggap siap dikerjakan bila:

- [ ] In-scope/out-of-scope di §2 tidak ada item “abu-abu”.
- [ ] UAT-A 01–19 di §8 dianggap final (perubahan = change request).
- [ ] Risiko utama disepakati (contoh: content readiness, hosting, DNS/SSL, deliverability email).
- [ ] Jalur lead disepakati: Supabase project siap (PIC owner) + email notifikasi tujuan + mekanisme export CSV yang dipilih.

#### Sign-off workflow (PASS + Evidence)

1) Jalankan UAT-A 01–19 (staging), isi `artifacts/paket-a/evidence-pack/02-uat/index.md` + lampiran bukti.  
2) Kumpulkan bukti security/perf/a11y/ops (folder evidence pack masing-masing).  
3) Minta approval Blueprint + UAT dan simpan buktinya di `artifacts/paket-a/evidence-pack/01-signoff/`.  

> Catatan: Status sign-off di tabel dalam dokumen ini boleh tetap **PENDING** sampai bukti approval di folder evidence pack tersedia.

### Lead handling SOP

- Lead masuk harus memiliki owner (tim sales/BD)
- SLA follow-up internal disarankan: < 24 jam
- Jika jalur lead bermasalah: lakukan pengecekan log + verifikasi record Supabase + jalankan 1 submit lead test (staging/prod) sesuai runbook

Operational minimum:

- server-side validation + anti-spam minimum
- logging minimum untuk kegagalan insert Supabase / pengiriman email notifikasi / export

### Email deliverability (SPF/DKIM/DMARC) — playbook minimal

Tujuan: mengurangi risiko email notifikasi lead masuk **Spam/Junk/Quarantine**.

Checklist:

- [ ] Tentukan domain pengirim dan From address untuk email notifikasi.
- [ ] Setup DNS: SPF, DKIM, DMARC (bersama PIC IT Perusahaan).
- [ ] Lakukan test kirim dari staging dan verifikasi: inbox utama, spam/junk, dan quarantine (jika ada).

Triage jika email tidak masuk (namun lead tersimpan):

1) Verifikasi record Supabase (cek insert pada timestamp submit).
2) Cek folder Spam/Junk/Quarantine pada mailbox internal.
3) Cek log pengiriman email (reject/429/provider policy).
4) Validasi DNS SPF/DKIM/DMARC masih aktif (tidak ada perubahan record).

### Backup & restore Supabase — playbook minimal

Tujuan: mitigasi risiko human error (mis. data terhapus tidak sengaja) dengan prosedur backup dan pemulihan yang jelas.

Kebijakan minimum yang disiapkan:

- jadwal backup (mis. harian),
- lokasi penyimpanan backup (di luar Supabase),
- retensi backup (mis. 14–30 hari),
- prosedur restore ke environment staging untuk verifikasi.

Triage jika data hilang/terhapus:

1) Konfirmasi scope data yang hilang (range waktu, tabel terkait).
2) Jika masih ada, lakukan restore parsial (tabel/row) atau full restore sesuai prosedur.
3) Verifikasi hasil restore pada staging terlebih dahulu, lalu putuskan pemulihan produksi.

### Runbook (deploy/rollback/incident)

**Deploy (staging/prod):** deploy via pipeline; smoke test Home/Products/Detail/WA CTA/Lead form + verifikasi lead persistence/email notif.  
**Rollback:** lakukan bila SEV-1 atau error rate tinggi; rollback ke release known-good; ulangi smoke test + 1 submit lead valid.  
**Lead health checks:** cek log error (Supabase insert/email); bila drop dicurigai, submit lead test, verifikasi record Supabase + email notifikasi.

#### Alertability + triage (minimal, Paket A)

Prinsip triage:

- **Mitigate first** (rollback) untuk SEV-1.
- Gunakan **logs** untuk melihat penyebab kegagalan pengiriman email.

Playbook: LeadPipelineFailing

1) Jalankan 1 submit lead test (staging/prod) dan catat timestamp.
2) Pastikan record masuk di Supabase.
3) Pastikan inbox internal menerima email notifikasi (cek spam/quarantine).
4) Jika gagal:

- cek log error (Supabase/auth/reject/provider email)
- rollback release terakhir bila regresi pasca deploy

### Production checklist (summary)

**Pre-launch:** DNS/SSL (primary `alfabeautycosmetica.com` + redirect `alfabeautycosmetica.co`), WA number + prefill message, robots/sitemap, analytics, OG/Twitter, JSON-LD, security headers snapshot.  
**Launch day:** smoke test flows, monitor logs, monitor success rate.  
**Post-launch:** review performa via Lighthouse/PageSpeed (best effort), tuning rate limit.

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

1) `X-Content-Type-Options: nosniff`

2) `Referrer-Policy: strict-origin-when-cross-origin`

3) `Strict-Transport-Security: max-age=31536000; includeSubDomains` (tambah `preload` hanya setelah siap)

4) `Permissions-Policy: geolocation=(), microphone=(), camera=()`

5) Clickjacking:

- utamakan CSP `frame-ancestors`
- `X-Frame-Options: DENY` legacy (jika dibutuhkan)

#### Lead submit endpoint responses (JSON)

1) `Content-Type: application/json; charset=utf-8`
2) `X-Content-Type-Options: nosniff`
3) `Cache-Control: no-store`
4) `Referrer-Policy: no-referrer` (jika diperlukan)

### Verification & evidence

Evidence yang diterima:

- Screenshot DevTools headers (Home + lead submit), atau
- header snapshot via tooling (curl/HTTP client), atau
- screenshot konfigurasi CDN/WAF + contoh HTTP response.

Minimal evidence set:

- 1 snapshot **Home (HTML)**
- 1 snapshot **Lead submit (JSON)**

### Exception policy

Jika baseline tidak bisa dipenuhi 100%:

- catat header yang tidak bisa dipasang
- jelaskan alasan
- tambahkan mitigasi
- lampirkan evidence

---

## 16. OWASP ASVS v5.0.0 minimal traceability

**Status:** PENDING (becomes PASS when evidence links are filled)  
**Scope:** Website + endpoint lead submit (delivery via email internal)  

| ASVS ID | Requirement (excerpt/summary) | Applies to | Implementation notes | Evidence link |
|---|---|---|---|---|
| v5.0.0-V2.2.1 | Positive validation (allowlist/expected structure) for business/security decisions (L1) | lead submit | Allowlist field + length limits; reject invalid; log rejects safely | _[link evidence]_ |
| v5.0.0-V2.2.2 | Input validation enforced at trusted service layer (L1) | lead submit | Server-side validation; client validation tidak dipercaya | _[link evidence]_ |
| v5.0.0-V2.4.1 | Anti-automation controls (L2) | lead submit | Rate limit/throttle + honeypot; 429 on abuse | _[link evidence]_ |
| v5.0.0-V4.1.1 | Correct Content-Type incl. charset (L1) | lead submit response | Pastikan JSON content-type + charset | _[link evidence]_ |
| v5.0.0-V3.4.4 | `X-Content-Type-Options: nosniff` (L2) | website/endpoint | Header aktif di response HTML + JSON | _[link evidence]_ |
| v5.0.0-V3.4.6 | CSP `frame-ancestors` prevents embedding by default (L2) | website | `frame-ancestors 'none'` kecuali ada alasan bisnis | _[link evidence]_ |
| v5.0.0-V3.4.3 | CSP baseline includes `object-src 'none'` and `base-uri 'none'` (L2) | website | Pastikan directives hadir | _[link evidence]_ |

Acceptable evidence examples:

- integration test logs
- header snapshots
- code pointers (file path + line range)
- sample request/response untuk lead submit (valid/invalid) + bukti 429 saat abuse test

---

## 17. AI workflow productivity (internal)

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

---

## 19. Governance Log (COBIT Compliance)

**Objective:** Audit trail for critical business decisions and sign-offs.

| Date | Event | Who | Status | Evidence |
|---|---|---|---|---|
| 2026-01-20 | Blueprint Created | Vendor | DRAFT | - |
| 2026-01-26 | Framework Critique (ITIL/COBIT/TOGAF) | AntiGravity Agent | REVIEW | `implementation_plan.md` |
