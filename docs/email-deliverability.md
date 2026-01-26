# Email Deliverability Setup Guide

**PT. Alfa Beauty Cosmetica**  
**Paket A: Lead Notification System**

Dokumen ini menjelaskan konfigurasi DNS yang wajib dilakukan oleh Tim IT Perusahaan agar email notifikasi dari website (via SMTP) tidak masuk folder Spam/Junk.

---

## 1. Domain Configuration (DNS)

Anda perlu menambahkan 3 record DNS pada domain pengirim email (`alfabeauty.co.id` atau domain lain yang digunakan).

### 1.1 SPF (Sender Policy Framework)
Mencegah orang lain mengirim email atas nama domain Anda.

**Action:** Tambahkan TXT record pada root domain `@`.
**Value:**
```text
v=spf1 include:_spf.google.com ~all
```
*(Catatan: Jika sudah ada record SPF, tambahkan `include:_spf.google.com` sebelum `~all`)*

### 1.2 DKIM (DomainKeys Identified Mail)
Memastikan email tidak diubah di tengah jalan.

**Action:** Generate DKIM key dari dashboard email provider (Google Workspace / Zoho / cPanel).
**Type:** TXT
**Host/Name:** `google._domainkey` (atau sesuai provider)
**Value:** (Copy dari dashboard admin email)

### 1.3 DMARC
Memberitahu penerima apa yang harus dilakukan jika SPF/DKIM gagal.

**Action:** Tambahkan TXT record.
**Host/Name:** `_dmarc`
**Value:**
```text
v=DMARC1; p=none; rua=mailto:admin@alfabeauty.co.id
```
*(Mulailah dengan `p=none` untuk monitoring. Ubah ke `p=quarantine` atau `p=reject` setelah stabil).*

---

## 2. SMTP Credentials Testing

Setelah DNS terpropagasi (biasanya 1-24 jam), test konfigurasi dengan tools:
1. [MXToolbox SPF Check](https://mxtoolbox.com/spf.aspx)
2. [Mail-Tester](https://www.mail-tester.com/)

Untuk website, pastikan environment variables diatur dengan benar di Vercel:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notifications@alfabeauty.co.id
SMTP_PASS=kunci-aplikasi-anda
SMTP_FROM='"Alfa Beauty Website" <notifications@alfabeauty.co.id>'
SMTP_TO=sales@alfabeauty.co.id
```

> **Peming:** Jangan gunakan password email pribadi. Gunakan **App Password** jika menggunakan Gmail/Google Workspace.

---

## 3. Troubleshooting

**Isu: Email masuk Spam**
- Cek SPF record, pastikan tidak ada sintaks error.
- Cek apakah IP server pengirim (Vercel) diblokir (jarang terjadi jika pake SMTP relay).
- Pastikan subject/konten email tidak mengandung kata-kata spammy (website sudah menggunakan template standar B2B).

**Isu: Connection Timeout**
- Pastikan port 587 (TLS) terbuka.
- Cek firewall jika menggunakan SMTP self-hosted.
