# Runbook Triage (Paket A) — Lead via Email Internal

Dokumen ini melengkapi `docs-paket-a/paket-a.md` (scope final) dengan prosedur cepat untuk menangani keluhan:

1) "Form sudah di-submit tapi lead tidak masuk ke email"
2) "Submit error" / lonjakan 4xx/5xx
3) "Lead masuk tapi tidak konsisten" (mis. sebagian nyangkut spam/quarantine)

## Prinsip (supaya aman & audit-friendly)

- **Jangan debug dari request body.** Log harus tetap **PII-safe** (tanpa nama, email, nomor telepon, isi pesan).
- Mulai dari luar ke dalam: **Browser → Endpoint submit → Email deliverability**.
- Saat investigasi, gunakan **test lead** yang jelas ditandai (mis. subject/pesan berisi `[TEST]`).

---

## 1) Keluhan: "Lead tidak masuk ke email"

### 1.1 Konfirmasi gejala (5 menit)

1) Minta timestamp perkiraan submit + halaman yang dipakai.
2) Ulangi submit dengan data test.
3) Pastikan user mendapat indikasi sukses (mis. toast/redirect) dan tidak ada error di browser.

### 1.2 Cek sisi mailbox (paling sering penyebab)

1) Cari di folder berikut:
   - Inbox
   - Spam/Junk
   - Quarantine (jika ada security gateway)
2) Jika masuk Spam/Junk, lakukan:
   - mark as "Not Spam"
   - allowlist domain/pengirim sesuai kebijakan internal Perusahaan
3) Jika Perusahaan memakai group mailbox, pastikan semua anggota grup menerima.

### 1.3 Cek log server untuk submit (tanpa PII)

Tujuan: memastikan request submit benar-benar sampai ke server dan tidak gagal.

- Cari log request untuk endpoint lead submit pada rentang waktu tersebut.
- Klasifikasikan hasil:
  - **2xx**: submit diterima (lanjut cek deliverability SMTP / mailbox)
  - **4xx**: biasanya validation/rate limit
  - **5xx**: error server (Node.js runtime crash, Supabase connection error)

Jika tersedia metrik, lihat tren:
- lonjakan 4xx/5xx pada endpoint lead submit
- lonjakan invalid submissions atau rate limit rejects

---

## 2) Keluhan: "Submit error" (4xx/5xx)

### 2.1 Jika 4xx (umum)

Kemungkinan:
- Validasi input (format email/telepon, panjang field)
- Content-Type bukan JSON
- Rate limiting aktif (anti-spam)

Tindakan:
- Pastikan payload sesuai kontrak (lihat `docs-paket-a/paket-a.md` bagian lead path).
- Jika rate limit terlalu agresif untuk trafik normal, sesuaikan threshold (tetap menjaga anti-spam minimum).

### 2.2 Jika 5xx

Kemungkinan:
- Konfigurasi email/SMTP tidak lengkap
- Kegagalan koneksi SMTP (DNS, firewall, timeout)
- Deploy/regresi (baru go-live)

Tindakan:
- Cek error log paling dekat dengan timestamp.
- Jika ada perubahan deploy terakhir, pertimbangkan rollback.
- Verifikasi kredensial & konektivitas SMTP (host, port, auth, from/to).

---

## 3) Cek cepat konfigurasi email (tanpa membuka rahasia)

Tujuan: memastikan jalur pengiriman email tidak putus.

- Pastikan variabel/env yang dibutuhkan untuk SMTP terpasang di environment runtime.
- Pastikan alamat tujuan (recipient) adalah mailbox internal Perusahaan yang benar.

Catatan: konfigurasi sensitif (password/token) **tidak** boleh ditaruh di repo; gunakan secret store.

---

## 4) Lokasi implementasi (untuk developer)

- Routing endpoint lead submit: `frontend/src/app/api/leads/route.ts`
- Service handler lead submit: `frontend/src/app/api/leads/route.ts` (inline handler)
- Pengiriman email SMTP: `frontend/src/lib/email.ts`

---

## 5) Jika Perusahaan mengaktifkan scope tambahan (CR)

Jika suatu saat Perusahaan menambah scope "lead tersimpan + export admin + RUM" (CR / bagian 9.5 pada proposal), gunakan dokumen arsip di `docs-paket-a/_deprecated/` sebagai referensi teknis tambahan.
