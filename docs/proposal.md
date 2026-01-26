## PROPOSAL PEKERJAAN
## Paket A — Website B2B + Lead Capture (WhatsApp + Become Partner)

**Ditujukan kepada:** Bapak Edy (Owner) — PT. Alfa Beauty Cosmetica  
**Disusun oleh:** Farid & Danan (Vendor)  
**Tanggal:** 20 Januari 2026  
**Masa berlaku penawaran:** 14 hari kalender  

Dokumen ini memuat ruang lingkup, deliverables, kriteria penerimaan (UAT), jadwal kerja, biaya, biaya operasional, maintenance, dan termin pembayaran.

---

## 0) Ringkasnya
Website ini berfungsi sebagai alat bantu sales/BD untuk meningkatkan trust, memperjelas katalog produk tanpa harga publik, dan menghasilkan leads melalui WhatsApp dan Become Partner.

| Item | Nilai |
|---|---|
| Paket | **Paket A** — Website B2B + Lead Capture |
| Timeline delivery | **3 minggu kalender** |
| Fixed Price (tanpa PPN) | **Rp 11.850.000** |
| Total effort | **39,50 MD** (316 jam; 1 MD = 8 jam) |
| Hosting | **Vercel Free/Hobby (Rp 0)** |
| Penyimpanan lead | **Supabase (database)** |
| Notifikasi lead | **Email internal Perusahaan** |
| Deliverability email notifikasi | **SPF/DKIM/DMARC** (setup DNS) |
| Export data | **Download CSV** |
| CMS | **Headless CMS (free tier)** |
| Analytics & Search | **GA4 + Google Search Console** |
| Garansi bug fix | **90 hari kalender (3 bulan)** |

---

## 1) Latar belakang & tujuan
Website ini bukan “sekadar profil perusahaan”, tapi alat bantu sales/BD untuk:
- mengurangi pertanyaan berulang,
- mempercepat calon partner memahami produk/brand,
- mengarahkan prospek ke **jalur kontak yang cepat** (WhatsApp) atau **jalur follow-up yang rapi** (Become Partner).

**Target hasil (outcome):**
- Pengunjung paham value Alfa Beauty dalam hitungan detik.
- Pengunjung bisa melihat produk dengan struktur yang jelas.
- Pengunjung “tidak bingung harus kontak kemana”: CTA WhatsApp selalu tersedia.
- Lead dari Become Partner **tidak hilang** (tersimpan di database) dan bisa diproses tim internal (notifikasi email + export CSV).

---

## 2) Nilai bisnis
Yang “Bapak beli” dari Paket A:
- **Brand trust:** tampilan dan struktur B2B yang tegas.
- **Katalog tanpa perang harga:** produk bisa ditemukan tanpa menampilkan harga.
- **Konversi terukur:** klik WhatsApp dan submit lead bisa dipantau.
- **Lead tidak hilang:** lead tersimpan di database walaupun email masuk spam atau server email perusahaan down.
- **Operasional lebih ringan:** data bisa diunduh (CSV) tanpa copy manual dari email.
- **Kemandirian tim internal:** konten marketing dasar bisa diedit lewat CMS tanpa menyentuh kode.

---

## 3) Ruang lingkup
### 3.1 In-scope
- Halaman publik: Home, Products (overview + detail), Education/Events (listing), Education detail (event & article), Partnership landing, Become Partner, About, Contact, Legal bundle (Privacy + Terms), dan 404.
- Responsive (mobile–desktop) + baseline accessibility.
- SEO dasar (meta, robots, sitemap) + social metadata minimal.
- Event tracking konversi (klik WhatsApp, submit lead).
- Lead capture Become Partner yang:
  - ada validasi (server-side),
  - ada anti-spam minimum,
  - **tersimpan di database (Supabase)**,
  - mengirim **notifikasi email ke inbox internal Perusahaan**,
  - menyediakan **ekspor data (download CSV)**.
- Konten editable tanpa menyentuh kode:
  - Integrasi **headless CMS (free tier)** untuk edit teks/gambar dasar yang disepakati.
- Setup analytics standar:
  - **Google Analytics (GA4)** terpasang + event konversi dasar (klik WA, submit lead).
  - **Google Search Console**: verifikasi kepemilikan situs + submit sitemap.
- CTA WhatsApp ke **nomor WhatsApp Indonesia** + **pesan prefill**.
- **Bilingual (ID/EN) / i18n** untuk **semua halaman in-scope**.
  - **Terjemahan Bahasa Inggris (EN) menjadi tanggung jawab Vendor** (Farid & Danan) agar konsisten dan mendukung **SEO basic**.
  - Konten Bahasa Indonesia (ID) tetap bersumber dari materi/pernyataan resmi perusahaan (bagian 12).
- Handover & knowledge transfer:
  - dokumentasi handover,
  - **1 sesi pelatihan (± 60 menit via Zoom)**.

### 3.2 Out-of-scope
- Harga publik, tier pricing, diskon volume, loyalty.
- Login partner/admin (private dashboard) selain mekanisme export sederhana yang disepakati.
- Cart/inquiry builder + workflow order.
- Integrasi ERP/CRM (kecuali nanti ada change request).
- Pengadaan domain/email perusahaan (tidak diperlukan pada proposal ini).
- Pengembangan CMS ke arah workflow kompleks (role-based editorial workflow, multi-stage approvals) di luar setup dasar.
### 3.3 Kontrol perubahan (Change Request)
Penambahan fitur/halaman di luar in-scope diproses sebagai Change Request:
- kami jelaskan dampak waktu/biaya,
- Bapak Edy approve dulu,
- baru dikerjakan.

**Ketentuan:**
- Setelah ruang lingkup dan UAT (bagian 5) disepakati, UAT menjadi acuan penerimaan.
- Perubahan pada jalur kritikal (lead storage, export, security, operasional) wajib melalui Change Request karena berdampak pada risiko dan verifikasi.

---

## 4) Deliverables (yang diterima Perusahaan)
1) Website B2B siap rilis sesuai ruang lingkup.
2) Katalog produk: rapi, dapat difilter, tanpa harga publik.
3) Jalur konversi: WhatsApp CTA dan form Become Partner.
4) Lead pipeline: validasi + anti-spam, tersimpan di Supabase, notifikasi email internal, export CSV.
	- Deliverability email notifikasi: Vendor menyiapkan panduan dan melakukan verifikasi konfigurasi DNS domain pengirim (**SPF/DKIM/DMARC**) bersama PIC IT Perusahaan.
	- Backup data Supabase: Vendor menyiapkan skrip backup terjadwal (atau instruksi manual yang jelas) dan langkah restore yang terdokumentasi.
5) Integrasi CMS (free tier) untuk konten yang disepakati.
6) GA4 + Search Console terpasang dan tervalidasi.
7) Dokumentasi handover + 1 sesi pelatihan (± 60 menit).

### 4.1 Kepemilikan aset digital
- Kepemilikan kode sumber: seluruh kode implementasi yang dibuat Vendor untuk proyek ini diserahkan kepada Perusahaan pada saat handover (akses repositori, struktur proyek, dan cara build/deploy).
- Aset desain: file desain editable (Figma) diserahkan kepada Perusahaan.
- Kepemilikan akun: akun/akses Vercel, Supabase, CMS, GA4/GSC, dan Figma berada di pihak Perusahaan; Vendor sebagai collaborator selama implementasi.

---

## 5) Kriteria penerimaan (UAT)
Pekerjaan dinyatakan selesai jika seluruh item UAT berikut dinyatakan PASS.

- UAT-01 — Homepage: value proposition terlihat, CTA dapat diklik, logo/brand tampil di mobile & desktop.
- UAT-02 — Products overview: kategori & grid produk tampil; tidak ada harga.
- UAT-03 — Filter: hasil berubah sesuai filter; reset filter bekerja; empty-state jelas.
- UAT-04 — Product detail: struktur konten rapi; CTA WhatsApp tersedia.
- UAT-05 — WhatsApp contact: klik CTA membuka WA/deep link; fallback tersedia bila device tidak mendukung.
- UAT-06 — Become Partner: submit valid sukses; consent wajib; validasi nomor WA bekerja.
- UAT-07 — Education/Events: listing rapi; CTA register/WA berfungsi.
- UAT-08 — Bilingual: ID/EN tersedia dan seluruh halaman in-scope dapat diakses di kedua bahasa.
- UAT-09 — SEO: title/meta sesuai; sitemap.xml dan robots.txt dapat diakses.
- UAT-10 — Performance: halaman utama tetap ringan pada simulasi koneksi lambat; gambar teroptimasi.
- UAT-11 — Lead persistence + email: submit valid sukses; record tersimpan di database; notifikasi email masuk.
- UAT-12 — Lead export: Owner/PIC dapat mengunduh data lead sebagai file CSV.
- UAT-13 — Tracking + GA4: event klik WA dan submit lead terlihat di GA4 (Realtime/DebugView).
- UAT-14 — Search Console: situs terverifikasi dan sitemap tersubmit.
- UAT-15 — Static pages: About/Contact/Privacy/Terms dapat diakses; link tidak broken.
- UAT-16 — 404: URL tidak ada menampilkan halaman 404 user-friendly.
- UAT-17 — CMS editing: perubahan teks/gambar yang disepakati dapat dilakukan melalui CMS dan tampil di produksi.
- UAT-18 — Handover & training: dokumentasi diserahkan dan sesi pelatihan dilakukan.
- UAT-19 — Social metadata: OpenGraph + Twitter card ada (Home + Product detail), tidak kosong/invalid.

---

## 6) Metode kerja (tahapan delivery)
**Pendekatan:** staging-first dan berbasis checklist UAT.

### Tahap 1 — Kickoff (finalisasi ruang lingkup & UAT)
- Finalisasi halaman in-scope/out-of-scope.
- Finalisasi UAT (bagian 5).
- Finalisasi CTA WhatsApp (nomor + prefill).
- Finalisasi struktur data lead (field form) + kebijakan export.
- Konfirmasi hosting (bagian 9.8) + akses yang dibutuhkan (Supabase, GA4, GSC, CMS).

### Tahap 2 — Implementasi bertahap (Staging)
- Kami bangun halaman dan fitur sesuai urutan prioritas (Home → Products → Detail → Partnership).
- Setup Supabase (schema + penyimpanan lead) + notifikasi email.
- Integrasi CMS (free tier) untuk konten yang disepakati.
- Setup GA4 + GSC.

### Tahap 3 — UAT & perbaikan
- Eksekusi UAT sesuai checklist.
- Perbaikan bug minor dan polishing.

### Tahap 4 — Go-live + handover
- Rilis produksi.
- Verifikasi jalur WA + 1 submit jalur konversi (tersimpan DB + notifikasi email).
- Serah terima dokumentasi + sesi pelatihan.

**Garansi bug fix pasca go-live (tertulis):**
- **90 hari kalender (3 bulan)** sejak tanggal go-live: Vendor melakukan **bug fix** untuk defect yang terverifikasi berasal dari implementasi Vendor pada scope Paket A.
- Garansi ini **tidak** mencakup perubahan scope/fitur baru, perubahan konten besar, atau perubahan akibat kebijakan/platform pihak ketiga.

---

## 7) Kesiapan teknis saat ini
Persiapan teknis sudah ada untuk mempercepat eksekusi:
- Frontend modern: **Next.js 16.x** + **React** (kompatibel) + **TypeScript 5.9**
- Runtime: **Node.js 24.x** (Active LTS; fallback 22.x)
- Struktur route bilingual (ID/EN).
- Jalur lead siap ditingkatkan dengan **persistence Supabase** + notifikasi email + export.
- Tersedia prosedur smoke check untuk memastikan jalur kritikal (WA + submit lead) terverifikasi sebelum go-live.

---

## 8) Jadwal kerja
Timeline delivery: 3 minggu kalender.

- Minggu 1: finalisasi ruang lingkup & UAT, setup Supabase/CMS/GA4/GSC, implementasi struktur halaman inti.
- Minggu 2: Products overview + detail, Partnership/Become Partner, export CSV, bilingual ID/EN.
- Minggu 3: UAT end-to-end, perbaikan minor, go-live, handover (dokumen + training).

---

# 9) Biaya (Fixed Price + OpEx yang jelas)
## 9.1 Ringkasan harga (untuk persetujuan)
| Paket | Cocok untuk | Fixed Price (tanpa PPN) | Timeline | Pembeda utama |
|---|---|---:|---|---|
| **Paket A** | ingin lead tervalidasi, **tersimpan**, dan bisa diekspor | **Rp 11.850.000** | 3 minggu | Supabase (DB) + export CSV + CMS (free tier) + GA4/GSC + bilingual + tracking |

Harga di atas **tidak termasuk PPN** (sesuai arahan).

## 9.2 Dasar perhitungan biaya
Perhitungan biaya mengacu pada base rate dan total effort (MD/jam) untuk workstream utama proyek, termasuk verifikasi UAT untuk jalur kritikal (WhatsApp CTA, submit lead, export CSV, tracking dasar).

## 9.3 Harga Paket A
### 9.3.1 Base rate
Untuk menghindari perdebatan “tier” dan menjaga perhitungan mudah diaudit, proyek ini memakai **1 base rate**:

- **Rp 300.000 / MD (man-day)**
- Definisi 1 MD = **8 jam kerja**
- Setara **Rp 37.500 / jam**

### 9.3.2 Rekap effort & total biaya (Baseline — Likely)
Total effort baseline pada proyek ini mengikuti rincian workstream di 9.3.5.

**Penegasan baseline (final):** baseline yang digunakan pada dokumen ini adalah **Baseline (Likely)** yaitu estimasi realistis untuk menyelesaikan deliverables in-scope beserta verifikasi UAT.

| Item | Nilai |
|---|---:|
| Total effort baseline (Likely) | **39,50 MD** |
| Konversi jam kerja (39,50 × 8) | **316 jam** |
| Base rate | **Rp 300.000/MD** (Rp 37.500/jam) |
| **Total biaya baseline (Likely, CapEx)** | **Rp 11.850.000** |

### 9.3.3 Prinsip Fixed Price
Proposal ini memakai **Fixed Price**.

**Ketentuan:**
- Nilai yang dibayar Owner mengacu ke Fixed Price (bagian 9.3.4).
- Selama ruang lingkup dan UAT (bagian 5) tidak berubah, risiko deviasi effort berada di pihak Vendor.

### 9.3.4 Ringkasan harga yang dibayar Owner (Fixed Price)
Bagian ini menutup pertanyaan paling penting: “Owner membayar berapa, dan angka itu terbentuk dari mana?”

| Item | Nilai (IDR) | Keterangan |
|---|---:|---|
| Biaya baseline (Likely; hasil perhitungan 9.3.5) | **Rp 11.850.000** | 39,50 MD × Rp 300.000/MD |
| **Fixed Price — yang dibayar Owner** | **Rp 11.850.000** | scope & UAT tetap |

### 9.3.5 Rincian perhitungan (final untuk proyek ini)
Tabel ini memfinalisasi rincian perhitungan **untuk proyek ini** agar transparan.

**Asumsi hitung (jelas & bisa diaudit):**
- Definisi 1 MD = 8 jam kerja.
- Jumlah template/halaman publik in-scope yang dihitung untuk delivery: **12 template** (Home, Products Overview, Product Detail, Education Hub/Listing, Education Event Detail, Education Article Detail, Partnership Landing, Become Partner Form, About, Contact, Legal/Policy bundle, 404).
- Bilingual (ID/EN) berlaku untuk seluruh halaman in-scope.
- Jalur kritikal yang wajib diverifikasi dan dibuat evidence-nya mengikuti UAT: **WA CTA, submit lead (tersimpan DB + email), export CSV, tracking events/GA4, i18n, SEO basic**.

**Aturan perhitungan (ringkas):**
- Untuk workstream UI/halaman: MD = (foundation/layout) + (jumlah template/halaman × effort per template) + (responsive+a11y baseline).
- Untuk fitur teknis (i18n/SEO/tracking/lead pipeline/CMS): MD = (setup plumbing) + (implementasi) + (verifikasi/evidence).
- QA/UAT readiness adalah effort terpisah untuk menjalankan checklist UAT, mengumpulkan evidence, dan menutup bug minor.

| Workstream | MD | Dasar hitung (ringkas) | Rate (IDR/MD) | Subtotal |
|---|---:|---|---:|---:|
| Setup proyek & scaffolding (repo, env, routing dasar) | 1,25 | setup Next.js + struktur repo + env dasar (termasuk koneksi Supabase/CMS/GA4 pada level plumbing) | 300.000 | 375.000 |
| UI/halaman publik (Home, About, Contact, legal bundle, 404) | 5,50 | design system + section components + 0,75 × 4 template halaman | 300.000 | 1.650.000 |
| Products overview (listing + filter + empty-state) | 5,25 | listing + data model + filter UX/state + polish/responsive | 300.000 | 1.575.000 |
| Product detail (struktur, CTA, content blocks) | 4,25 | template + blocks + struktur konten + CTA + polish | 300.000 | 1.275.000 |
| Education/Events listing (baseline) | 2,00 | listing template + polish + empty-state | 300.000 | 600.000 |
| i18n/bilingual (ID/EN) untuk semua halaman in-scope | 3,00 | setup i18n + implement per template + QA bahasa | 300.000 | 900.000 |
| SEO basic (meta, sitemap, robots, social metadata) | 1,75 | meta per template + sitemap/robots + OG/Twitter + verifikasi | 300.000 | 525.000 |
| Tracking konversi + setup GA4/GSC | 1,25 | event tracking + pasang GA4 + verifikasi GSC + evidence | 300.000 | 375.000 |
| Lead pipeline (Supabase + email notif + export CSV + anti-spam) | 4,00 | endpoint + validation + anti-spam + persistence DB + export + evidence | 300.000 | 1.200.000 |
| QA/UAT readiness (regresi dasar + evidence jalur kritikal) | 3,00 | jalankan UAT + evidence + bugfix minor/polish | 300.000 | 900.000 |
| PM, koordinasi, handover & pelatihan | 3,00 | kickoff + review staging + rilis + dokumentasi handover + 1 jam training | 300.000 | 900.000 |
| Kontinjensi risiko & iterasi UAT (Likely) | 5,25 | buffer realistis untuk integrasi (Supabase/CMS/GA4/GSC), iterasi UAT, dan polishing sebelum go-live | 300.000 | 1.575.000 |
| **TOTAL baseline (Likely)** | **39,50** |  |  | **11.850.000** |

**Referensi singkat (untuk transparansi):**
- Workstream di atas mencakup delivery + verifikasi (UAT evidence) untuk jalur kritikal (WA + lead tersimpan + export + analytics basic).
- Jika ada change request setelah ruang lingkup dan UAT disepakati, effort tambahan dihitung terpisah.

### 9.3.6 Validasi harga — konsisten dengan base rate
Tujuan bagian ini: memvalidasi bahwa Fixed Price selaras dengan base rate yang disepakati.

**Basis yang dipakai di proposal ini:**
- 1 MD = 8 jam
- Rp 300.000/MD = Rp 37.500/jam

**Perhitungan (berdasarkan baseline (Likely) 9.3.5):**
- Total jam kerja: **316 jam**
- 316 jam × Rp 37.500/jam = **Rp 11.850.000**

---

## 9.5 Jika Perusahaan membutuhkan peningkatan di luar baseline (contoh)
Pada proposal ini baseline (**Likely**) sudah mencakup:
- lead tersimpan (Supabase),
- export CSV sederhana,
- analytics basic (GA4 + GSC),
- CMS basic (free tier).

Contoh kebutuhan yang biasanya termasuk peningkatan di luar baseline dan diproses sebagai Change Request:
- role-based access yang kompleks untuk admin/editor,
- workflow editorial multi-level,
- integrasi CRM/ERP,
- dashboard analytics kustom (di luar GA4 standar),
- RUM field metrics yang dikelola sebagai program performa lanjutan.

---

## 9.7 Biaya operasional (OpEx) — domain/email tidak dihitung
Sesuai arahan:
- **Domain/email tidak dihitung** dalam proposal ini (diasumsikan sudah tersedia/ditangani internal).

OpEx yang relevan (Baseline — Likely):
1) Hosting website: **Vercel Free/Hobby (Rp 0)**
2) Supabase (database): **menggunakan Free tier** (selama masih dalam batas penggunaan)
3) Headless CMS: **menggunakan Free tier** (sesuai pilihan yang disepakati)
4) GA4 & Search Console: **Rp 0**

**Kebijakan OpEx (Owner):**
- OpEx dicek **bulanan** oleh **Owner**.
- Jika di kemudian hari terjadi kebutuhan upgrade plan (traffic/build quota meningkat atau kebutuhan enterprise), Vendor akan mengajukan analisa dampak dan rekomendasi.

---

## 9.8 Hosting: Vercel Free/Hobby
**Hosting yang digunakan: Vercel Free/Hobby.**

**Alasan pemilihan (sesuai kebutuhan awal):**
- **Biaya awal Rp 0** untuk fase awal (traffic masih rendah).
- Deploy workflow modern (preview → production) tetap tersedia untuk review cepat.
- Upgrade path jelas bila kebutuhan meningkat.

---

## 9.9 Kepatuhan hukum & keamanan data (ringkas) — UU PDP
Bagian ini menjawab ekspektasi Owner terkait **UU PDP**: bagaimana data calon partner diamankan saat mengalir dari website ke sistem internal.

**Peran (high-level):**
- **Perusahaan** bertindak sebagai pengendali data (menentukan tujuan dan cara pemrosesan data calon partner).
- **Vendor** membantu implementasi teknis sebagai pihak pemroses (sesuai instruksi Perusahaan) untuk jalur lead.

**Kontrol teknis yang diterapkan (ringkas):**
1) **Enkripsi saat transmisi (in-transit):** submit form berjalan melalui **HTTPS (TLS)** agar data tidak terbaca pihak ketiga saat dikirim dari browser ke server.
2) **Validasi server-side + minimisasi data:** field dibatasi (allowlist, batas panjang), consent diwajibkan, dan hanya data yang diperlukan untuk follow-up yang dikumpulkan.
3) **Anti-spam & rate limit:** untuk mencegah penyalahgunaan form yang bisa membanjiri inbox/DB dan menurunkan kualitas data.
4) **Penyimpanan terpusat (Supabase) sebagai source of truth:** lead disimpan di database Perusahaan, sehingga ketika email masuk spam atau server email down, data tetap ada.
5) **Email sebagai notifikasi (bukan satu-satunya penyimpanan):** email diposisikan sebagai channel operasional; risiko “lead hilang karena email” dieliminasi karena data sudah tersimpan.
6) **Kontrol akses & kerahasiaan kredensial:** akses admin dibatasi ke PIC; secret (API keys) tidak ditaruh di repositori; perubahan akses mengikuti kebijakan Perusahaan.
7) **Deliverability email notifikasi:** konfigurasi DNS domain pengirim (SPF/DKIM/DMARC) disiapkan agar notifikasi lead tidak mudah masuk Spam/Junk.
8) **Backup & pemulihan data:** prosedur backup Supabase disiapkan (jadwal backup + lokasi penyimpanan + instruksi restore) untuk mitigasi risiko kesalahan manusia (mis. data terhapus tidak sengaja).

**Batasan yang perlu dipahami:**
- Kepatuhan UU PDP adalah kombinasi implementasi teknis + kebijakan internal (retensi data, siapa boleh mengakses inbox/DB, prosedur penghapusan). Vendor menyiapkan implementasi dan rekomendasi praktisnya di dokumentasi handover.

---

## 10) Maintenance & support
Maintenance adalah layanan bulanan terpisah (di luar Fixed Price) untuk perubahan ringan dan menjaga jalur konversi (WA/lead) tetap sehat.

### Paket M2 — Light (Rp 100.000/bulan)
**Cakupan:**
- hingga 4× perubahan konten kecil per bulan,
- perbaikan bug minor yang jelas (bila ada),
- koordinasi singkat.

**Definisi perubahan konten kecil (contoh):**
- ganti teks singkat,
- ganti 1–2 gambar kecil,
- update link/nomor WhatsApp/pesan prefill,
- koreksi minor data produk.

**Batasan:** kuota kerja total hingga 1 jam/bulan; kuota tidak rollover.

**SLA respon:** next business day (hari kerja)

---

## 11) Pembayaran
- **35%** saat ruang lingkup dan UAT disepakati,
- **35%** saat staging siap UAT,
- **30%** saat go-live.

---

## 12) Data yang dibutuhkan dari Perusahaan

### A) Identitas brand & aset
1) Logo (SVG/PNG)
2) Warna brand/brand guideline (bila ada)
3) Daftar foto/asset yang boleh dipublikasikan

### B) Konten perusahaan
4) Profil singkat perusahaan
5) Daftar brand + deskripsi singkat per brand

### C) Katalog produk (minimum)
6) Kategori produk
7) Data minimum per produk: nama, deskripsi singkat, foto

### D) Education/Events
8) Data minimal event/article: judul, tanggal (jika event), ringkasan, CTA/link

### E) Partnership / Become Partner
9) Kriteria partner
10) Field form yang disepakati

### F) WhatsApp CTA
11) Nomor WhatsApp (+62…)
12) Pesan prefill

### G) Domain & koordinasi go-live
13) Domain publik: `alfabeautycosmetica.com`
14) Domain redirect/defensive: `alfabeautycosmetica.co` (redirect ke `.com`)
15) PIC IT yang memegang akses DNS/SSL saat go-live
16) PIC IT yang memegang akses DNS untuk setup record email (**SPF/DKIM/DMARC**) pada domain pengirim notifikasi

### H) Akses teknis
17) Akses Supabase (PIC owner)
18) Akses Google (GA4 & Search Console) (PIC owner)
19) Akses CMS (PIC owner)

### I) Bilingual (ID/EN)
20) Daftar istilah yang wajib dipertahankan
21) Preferensi gaya bahasa EN (formal B2B)

---

## 13) Persetujuan
Dengan menandatangani bagian ini, Perusahaan menyetujui ruang lingkup, UAT, jadwal, biaya, dan termin pembayaran pada dokumen ini.

| Field | Value |
|---|---|
| Status | APPROVED / PENDING |
| Approved by | Bapak Edy |
| Approval date |  |
| Approval method |  |
| Keterangan |  |

---

## 14) Next step
1) Bapak Edy menunjuk PIC konten + memberi nomor WA & pesan prefill.  
2) Finalisasi ruang lingkup & UAT + akses Supabase/CMS/GA4/GSC.  
3) Staging → UAT PASS → Go-live → handover.

---
