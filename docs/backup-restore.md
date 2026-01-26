# Backup & Restore Procedures

**PT. Alfa Beauty Cosmetica**  
**Paket A: Leads Database (Supabase)**

---

## 1. Backup

Backup dilakukan dengan cara mengunduh seluruh data leads dalam format CSV.

### Cara 1: Via Script (Manual / Scheduled)
Kami menyediakan script utility untuk backup cepat.

**Prasyarat:**
- `curl` terinstall
- Environment variables: `LEAD_API_BASE_URL` dan `LEAD_API_ADMIN_TOKEN`

**Command:**
```bash
./scripts/backup-supabase.sh
```
File akan tersimpan di folder `backups/leads-YYYY-MM-DD.csv`.

### Cara 2: Via Dashboard Supabase
1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Buka Project > **Table Editor**
3. Pilih tabel `leads`
4. Klik **"Export"** > **"Export to CSV"**

---

## 2. Restore

Restore dilakukan jika data tidak sengaja terhapus. Karena ini hanya tabel tunggal (flat structure), restore dapat dilakukan via Import CSV.

> **Peringatan:** Import CSV akan menambah baris baru. Jika ingin mengembalikan state persis, Anda mungkin perlu truncate (kosongkan) tabel terlebih dahulu.

### Langkah Restore (Via Dashboard):

1. **Persiapkan File CSV**
   - Pastikan file CSV valid (hasil backup).
   - Pastikan header kolom sesuai: `business_name`, `contact_name`, `email`, dll.
   - Hapus kolom `id` dan `created_at` dari CSV jika Anda ingin database men-generate ID baru dan timestamp baru (Recommended).
   - ATAU biarkan `id` jika ingin mempertahankan ID lama (pastikan tidak ada konflik).

2. **Login ke Supabase Dashboard**
   - Buka Project > **Table Editor** > `leads`

3. **Import Data**
   - Klik **"Insert"** > **"Import data from CSV"**
   - Upload file CSV backup Anda.
   - Map kolom CSV ke kolom database (biasanya otomatis jika nama sama).
   - Klik **Import**.

4. **Verifikasi**
   - Cek apakah jumlah baris sesuai.
   - Cek data terbaru di website (Lead Export).

---

## 3. Data Retention Policy (SOP)

Sesuai spesifikasi Paket A:
- Data disimpan di Supabase sebagai **source of truth**.
- Retensi standar: **12 bulan**.
- **SOP Pembersihan:**
  1. Export data lama (misal: > 1 tahun) ke CSV.
  2. Simpan CSV di secure storage (Google Drive / OneDrive Perusahaan).
  3. Hapus data lama dari Supabase via SQL Editor:
     ```sql
     DELETE FROM leads WHERE created_at < NOW() - INTERVAL '1 year';
     ```
