# Frontend Spec — Paket A (Canonical for UI)

> **Canonical UI spec** untuk Paket A (Frontend): Design language + design system contract + Education/Events spec.
>
> **Source of truth (scope/contract):** `docs-paket-a/paket-a.md`
>
> **Legacy pointer (backward links):** `docs-paket-a/design-language.md` → menunjuk ke dokumen ini

**Status:** ACTIVE (canonical UI spec)
**Last updated:** 2026-01-13

## 🔒 Frozen decisions (must not change)

Keputusan berikut **HARUS DIFREEZE** dan tidak boleh diubah tanpa CR (Change Request):

1) Calvin Klein (primary): https://www.calvinklein.us/en
2) Lekker Home: https://lekkerhome.com/
3) Saint Jane Beauty: https://saintjanebeauty.com/

Implementasi UI (monochrome, flat, sharp corners, minimal shadow, mobile-first, bilingual ID/EN) harus konsisten dengan 3 referensi di atas.

## Design Language Freeze (snapshot)

Bagian ini menandai bahwa keputusan “Design Language Freeze — Paket A (Frontend)” **dikunci**.

**Status:** FROZEN

Rincian aturan (references, principles, component rules, non-goals, Education/Events) ada di:
- §1–§2 (Visual language + Core principles)
- §3 (Design system contract)
- §4 (Education & Events spec)

## Paket A alignment (contract reminders)

Dokumen ini adalah spesifikasi UI/Frontend. Untuk kontrak penerimaan & scope, rujuk:
- `docs-paket-a/paket-a.md` §2 (Scope boundary)
- `docs-paket-a/paket-a.md` §4–§5 (FSD/IDD + Partner profiling)
- `docs-paket-a/paket-a.md` §6–§7 (NFR + SLI/SLO)
- `docs-paket-a/paket-a.md` §8–§9 (UAT-A 01–16 + DoD)

### Scope boundary (anti scope creep)

UI Paket A **harus** terasa B2B-first, professional, dan **tanpa retail gimmicks**.

**In-scope UI**:
- Home, Products overview + detail, Education/Events (showcase), Partnership + Become Partner form, About/Contact/Privacy/Terms.

**Out-of-scope UI (wajib dihindari)**:
- Harga publik, cart/checkout, tier pricing, loyalty/rewards, login multi-role (itu Paket B).

### CTA & conversion path (hard requirements)

Mengacu `paket-a.md` §3 (CTA strategy) + UAT:
- **Primary CTA (Home):** Explore Products + Become Partner (UAT-01)
- **Persistent CTA:** WhatsApp Consult (sticky) + fallback email (UAT-05)
- Event tracking minimal (Paket A):
   - `cta_whatsapp_click`
   - `cta_email_click`
   - `lead_submit_*` (success/error)

Konfigurasi yang harus tersedia sebelum production (Paket A §3):
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (format E.164-like)
- `NEXT_PUBLIC_WHATSAPP_PREFILL`
- `NEXT_PUBLIC_FALLBACK_EMAIL`

### Page requirements (UI checklist per Paket A)

Ringkasan ini menurunkan komponen/behavior dari `paket-a.md` §4, supaya implementasi UI konsisten.

#### Home (UAT-01)
- Hero (value prop) + CTA terlihat pada **fold mobile**.
- 3 pillars: Products, Education, Partnership.
- Jalur cepat ke Products, Education, dan Become Partner.

#### Products overview (UAT-02, UAT-03)
- Filter panel minimal: **Brand**, **Function**, **Audience (Salon/Barber)**.
- Filter kombinatif (AND) dan clear/reset jelas.
- Shareable URL querystring untuk state filter (optional; jika diimplementasikan harus stabil).
- Empty-state / no-results guidance (tidak membingungkan).
- **No public pricing** di semua card/list/detail.

#### Product detail (UAT-04, UAT-05)
- Breadcrumbs.
- Summary singkat & teknis.
- Key benefits + use cases.
- How to use.
- CTA block konsisten: WhatsApp consult + Become Partner.

#### Education / Events (UAT-07)
- Showcase, bukan LMS/ticketing.
- Listing rapi (kicker + title + excerpt + CTA).
- Event detail page **boleh ada** dan dianggap *in-scope* (di `paket-a.md` disebut optional).
- Filter by audience boleh ditambahkan (optional, `paket-a.md` §4).

#### Partnership + Become Partner (UAT-06)
- Value props/benefits.
- Form + consent + state success/error jelas.
- Success state mendorong next step via WhatsApp.

#### Static/Legal + fallback pages (UAT-13, UAT-14)
- About, Contact, Privacy Policy, Terms: struktur rapi & tidak ada broken link.
- 404 page user-friendly (link kembali ke Home).
- Error boundary ada (jangan blank page).

## 1) Visual language (frozen references)

Reference sites (frozen):
1) Calvin Klein (primary): https://www.calvinklein.us/en
2) Lekker Home: https://lekkerhome.com/
3) Saint Jane Beauty: https://saintjanebeauty.com/

Catatan:
- Beberapa halaman Calvin Klein / e-commerce lain dapat redirect ke pixel/identity endpoints (tracking). Referensi yang digunakan adalah *visual language* (layout density, typographic hierarchy, minimalism), bukan implementasi teknis e-commerce.

## 2) Core principles (non‑negotiable)

1) **Monochrome, flat, high‑contrast**
   - Dominan: hitam/putih/abu‑abu.
   - Hindari drop shadow lembut/tebal.
   - Depth dibuat lewat **kontras**, **ruang kosong**, dan **garis/border**.

2) **Sharp corners**
   - Tombol, input, kartu: radius **0–2px**.
   - Hindari pill/rounded-full.

3) **Mobile‑first, clean grid**
   - Nyaman dibaca di mobile tanpa terasa ramai.
   - Grid/listing padat tapi tetap breathable (rhythm spacing konsisten).

4) **Typography hybrid**
   - Heading: **fluid** (gunakan `clamp()`).
   - Body/data: **fixed** per breakpoint.

5) **Bilingual (ID/EN)**
   - Copy tersedia Bahasa Indonesia dan English.
   - Route canonical selalu locale‑prefixed (mis. `/en/...`, `/id/...`).

## 3) Design system contract (implementation rules)

### 3.1 Tokens (source-of-truth)

**Color**
- Palet: Tailwind `zinc` + CSS variables di `frontend/src/app/globals.css`.
- Background: putih / near‑white.
- Text: zinc‑950 (utama), zinc‑700/600 (sekunder).
- Border: zinc‑200/300.

**Corner radius**
- Default: `rounded-[2px]` untuk button & input.
- Card: default **tanpa radius** (boleh radius 2px hanya jika konsisten di seluruh halaman).

**Shadows**
- Default: **none**.
- Jika perlu pemisah: pakai `border`, `bg-zinc-50`, atau divider.

**Spacing rhythm**
- Base: 4px grid.
- Section spacing: `py-12 md:py-16` (atau setara) kecuali listing padat.
- Typography spacing: `space-y-2/3/4` konsisten.

### 3.2 Typography

**Heading (fluid)**
- Gunakan utility: `type-h1`, `type-h2`, `type-h3` (lihat `frontend/src/app/globals.css`).

**Body & data (fixed)**
- `type-body`, `type-kicker`, `type-data`.

Rules:
- Hindari ALL CAPS untuk body.
- Kicker boleh uppercase + tracking (pendek).
- Maksimalkan white-space; minim dekorasi.

### 3.3 Layout & grid

**Container**
- Gunakan `Container` (`frontend/src/components/ui/Container.tsx`) max width 80rem.

**Lists (events/articles/products)**
- Wajib punya:
  - kicker (tanggal/kota/kategori)
  - title (type-h3)
  - excerpt 1–2 kalimat
  - CTA kecil (`Button secondary` size sm)

### 3.4 Components (contract)

**Button** (`frontend/src/components/ui/Button.tsx`)
- Variants: primary/secondary/ghost.
- Radius: 2px.
- Hover: subtle (zinc‑900 / zinc‑50 / zinc‑100).

**Input** (`frontend/src/components/ui/Input.tsx`)
- Border: zinc‑300.
- Focus ring: zinc‑900.
- Radius: 2px.

**Card** (`frontend/src/components/ui/Card.tsx`)
- Border 1px, bg putih, no shadow.

**Links**
- Default: tidak underline.
- Hover: underline (opsional tambah underline-offset konsisten bila dibutuhkan).

### 3.5 Content rules (Paket A)
- **No public pricing**.
- CTA utama: WhatsApp (konsultasi/order) + Become Partner (lead capture).
- Education/Events: highlight, bukan LMS/ticketing.

Tambahan guardrails (selaras Paket A §1–§2):
- Hindari bahasa “retail promo”: diskon, flash sale, checkout, cart, dll.
- Copy harus ringkas, tegas, editorial (B2B).

### 3.6 QA checklist (UI)
- [ ] Tidak ada komponen pill/rounded-full.
- [ ] Tidak ada shadow dekoratif.
- [ ] Heading scale konsisten (fluid), body/data fixed.
- [ ] Semua link internal mengikuti locale prefix.
- [ ] Copy ID & EN bukan placeholder.
- [ ] CTA WhatsApp + fallback email berfungsi (UAT-05).
- [ ] Become Partner form memiliki success + error state yang jelas (UAT-06).
- [ ] 404 + error fallback user-friendly (UAT-14).

## 4) Education & Events spec

> **Scope:** showcase untuk profesional salon & barbershop. **Bukan** LMS, **bukan** ticketing.

### 4.1 Routes (canonical)
- Hub: `/{locale}/education`
- Event detail: `/{locale}/education/events/{slug}`
- Article detail: `/{locale}/education/articles/{slug}`

`{locale}` ∈ `en | id`.

### 4.2 Data source (repo-based JSON)

File locations:
- Events:
  - `frontend/src/content/education/events.en.json`
  - `frontend/src/content/education/events.id.json`
- Articles:
  - `frontend/src/content/education/articles.en.json`
  - `frontend/src/content/education/articles.id.json`

Schemas (selaras dengan `frontend/src/lib/education.ts`):

**Event**
- `slug` (string, required)
- `title` (string, required)
- `excerpt` (string, required; 1–2 kalimat)
- `date` (string, required; `YYYY-MM-DD`)
- `city` (string, required)
- `audience` (string[], required)
- `cta_label` (string, required)
- `body` (string[], required; 2–6 paragraf)

**Article**
- `slug` (string, required)
- `title` (string, required)
- `excerpt` (string, required)
- `date` (string, required; `YYYY-MM-DD`)
- `body` (string[], required; 3–10 paragraf)

### 4.3 Behavior

**Listing (hub)**
- Desktop: 2 kolom (Events + Articles).
- Mobile: stack.
- Setiap item menampilkan kicker, title link, excerpt, CTA secondary small.

**Detail pages**
- Title, kicker, excerpt, body.
- Back to Education.
- CTA ke jalur WhatsApp/Contact.
- Note jadwal dapat berubah (copy via i18n).

**Optional: filter by audience**
- Jika diaktifkan, gunakan audience yang konsisten dengan event data (mis. Salon/Barber) dan pastikan empty-state jelas.

### 4.4 SEO
- Canonical + hreflang alternates untuk listing dan detail.
- Slug boleh berbeda antar locale.

### 4.5 Content guidelines
- Profesional, ringkas, teknis.
- Hindari klaim medis.
- Struktur: problem → approach → next step.

### 4.6 QA checklist
- [ ] JSON valid.
- [ ] Link internal locale‑prefixed.
- [ ] Tidak ada placeholder.
- [ ] Lint/build/e2e PASS.

## 5) Become Partner — form contract (Paket A)

Bagian ini merangkum `paket-a.md` §5 agar implementasi form konsisten.

### 5.1 Required fields
- `business_name`
- `contact_name`
- `phone_whatsapp`
- `city`
- `salon_type`: `SALON | BARBER | BRIDAL | UNISEX | OTHER`
- `consent` (wajib true)

### 5.2 Optional (progressive profiling)
- `chair_count` (integer)
- `specialization` (text)
- `current_brands_used` (text)
- `monthly_spend_range` (enum; optional bila disetujui owner)

### 5.3 Validation & anti-spam (UI responsibilities)
- Validasi client-side untuk UX (wajib ada message jelas).
- Tetap anggap server sebagai otoritas (server-side validation adalah gate).
- Consent tidak boleh tersubmit bila unchecked.
- Success state hanya boleh ditampilkan setelah server menerima request (jangan optimistic “langsung sukses”).
- Tampilkan state khusus untuk rate limit (HTTP 429) bila terjadi.

### 5.4 Backend integration (Lead API Option B)

Frontend **wajib** memanfaatkan kontrak backend yang sudah ada (Go Lead API) agar:
- tidak butuh CORS (single origin via proxy)
- ada rate limiting + idempotency + anti-spam yang konsisten
- telemetry & CWV RUM sesuai Paket A

**Proxy pattern (disarankan):**
- UI memanggil endpoint internal Next.js:
   - `POST /api/leads`
   - `POST /api/events` (best-effort)
   - `POST /api/rum` (best-effort)
- Next.js route handlers mem-forward ke Lead API:
   - `POST {LEAD_API_BASE_URL}/api/v1/leads`
   - `POST {LEAD_API_BASE_URL}/api/v1/events`
   - `POST {LEAD_API_BASE_URL}/api/v1/rum`

**Env config (wajib untuk lead capture di prod):**
- `LEAD_API_BASE_URL` (server-side env untuk Next.js)

**Headers & payload rules:**
- `Content-Type: application/json` (wajib)
- `Idempotency-Key: <uuid>` pada submit lead (wajib) untuk retry safety.
- Sertakan field honeypot `company` (hidden input) dan pastikan nilainya kosong untuk user normal.
- Sertakan `page_url_initial` + `page_url_current` untuk diagnosis.

**Response handling (UI):**
- `202 Accepted` = sukses (boleh ada body `{ status: "accepted", id }` atau kosong pada jalur spam/honeypot).
- `400` = invalid (tampilkan error message yang aman untuk user; jangan leak info sensitif).
- `429` = rate limited (tampilkan message khusus + minta coba lagi).
- `5xx/502` = upstream/down (tampilkan error generik + fallback CTA WhatsApp).

## 6) SEO, shareability, accessibility, performance (frontend responsibilities)

### 6.1 SEO basics (Paket A §6 + UAT-09)
- Title/description per page.
- Canonical + hreflang (locale) untuk halaman utama dan detail.
- `sitemap.xml` dan `robots.txt` dapat diakses.

### 6.2 Social metadata (UAT-15)
- OpenGraph + Twitter metadata minimal tersedia untuk Home + Product detail.

### 6.3 Structured data (Paket A §6)
- JSON-LD minimum: Organization + Breadcrumb.
- Product schema bila feasible, tapi jangan klaim yang tidak akurat.

### 6.4 Accessibility baseline (Paket A §6 + audit)
- Fokus keyboard terlihat dan tidak tertutup sticky header/WhatsApp CTA.
- Target interaktif utama nyaman untuk tap mobile.
- Form error state tidak hanya mengandalkan warna.

### 6.5 Web performance & CWV RUM (Paket A §7 + UAT-16)
- Wiring RUM harus non-blocking (sendBeacon/keepalive) dan flush di `visibilitychange`→`hidden`.
- Payload minimal memuat:
   - `metric_id` (dedupe)
   - `page_url_initial` + `page_url_current` (SPA attribution)
   - dimensi mobile vs desktop (minimal)
