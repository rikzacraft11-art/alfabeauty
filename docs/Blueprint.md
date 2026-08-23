<aside>
🧱

**Dokumen ini turunan langsung dari lembar keputusan, bukan dokumen baru.** Seluruh isinya dihitung dari 8 keputusan Bagian 3, 10 jawaban notulensi, dan register Bagian 4–8. Saya tidak menambahkan keputusan bisnis baru di sini. 11 item yang belum di-ACC ditulis sebagai **percabangan** (Bagian G), supaya tim developer bisa mulai mengerjakan bagian scope yang sudah pasti tanpa menunggu rapat berikutnya.

</aside>

## Bagian A · Lima prinsip arsitektur

Kelima prinsip ini adalah bentuk teknis dari keputusan Bagian 3. Melanggarnya berarti membatalkan keputusan bisnisnya, bukan sekadar mengubah kode.

1. **Satu situs, banyak peran** (P2=A). Tidak ada subdomain B2B. Perbedaan pengalaman dihasilkan oleh peran akun, bukan oleh properti web terpisah. Konsekuensi positif: satu sumber data produk, satu basis data pelanggan, satu akumulasi SEO.
2. **Harga adalah atribut peran, bukan atribut halaman** (P4=B + P5=A). Satu SKU memiliki satu MSRP dan dua harga net (Salon/Barber, Distributor). Halaman produk tidak pernah diduplikasi per tier — yang berubah hanya angka yang dirender untuk peran yang sedang login.
3. **Dua storefront dalam pengalaman, satu katalog dalam data** (P3=C + M1). Konsumen dan mitra melihat pintu masuk, bahasa, dan ukuran kemasan yang berbeda, tetapi sumbernya satu. Yang memisahkan keduanya hanya dua penanda di level SKU: “boleh dijual ke konsumen” dan “harga ter-ACC”.
4. **Bilingual sejak skema, bukan sejak konten** (P8=C, L8). Field dua bahasa dan routing `/id/` – `/en/` dibangun hari pertama meskipun terjemahannya menyusul. Menambal i18n setelah launch berarti membongkar seluruh URL dan kehilangan peringkat yang sudah terbentuk.
5. **Tidak ada angka tanpa ACC** (syarat owner di P3, C10, K10). Sistem memperlakukan kondisi “belum ada harga ter-ACC” sebagai keadaan sah yang punya tampilan sendiri (“Hubungi kami”) — bukan sebagai error, dan bukan diisi angka lama.

---

## Bagian B · Matriks peran & hak akses

### B1. Peran pengunjung & pelanggan

| Peran | Cara mendapat | Katalog & MSRP | Harga net | Checkout | Poin | Resources Hub | Tempo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Guest | tanpa login | ⏳ tergantung ACC C1 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Konsumen terdaftar | email / OTP WhatsApp, tanpa dokumen (D8) | ✅ | ❌ | ✅ hanya SKU white-list (M1) | ❌ (I8, M5) | ❌ | ❌ |
| Pendaftar mitra (menunggu verifikasi) | kirim formulir kemitraan (N4) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Salon / Barber terverifikasi | foto salon + KTP owner, ACC ≤ 4 jam kerja (D2, D3) | ✅ | ✅ daftar harga Salon | ✅ order pertama min Rp1.500.000 (N7) | ✅ per kelipatan Rp500.000 (N8) | ✅ Color Chart + SOP (N9) | ⏳ bila lolos syarat (D5) |
| Distributor terverifikasi | tambahan NIB/NPWP (D2) | ✅ | ✅ daftar harga Distributor | ✅ MOQ khusus (C9, belum ACC) | ✅ | ✅ | ⏳ (D5) |

### B2. Peran internal (back-office)

| Peran | Kewenangan | Batasan yang dipaksakan sistem |
| --- | --- | --- |
| Admin katalog | Tambah/ubah produk, atribut teknis, status Ready/Indent (P6=B) | Tidak bisa mengubah harga di luar daftar harga ter-ACC |
| Admin harga (owner atau yang ditunjuk) | Unggah daftar harga ber-versi, tandai “ter-ACC” | Setiap perubahan tercatat di log, tidak bisa dihapus (K10) |
| Verifikator mitra | Setujui/tolak pendaftaran, minta dokumen tambahan | Tidak berwenang memberi fasilitas tempo |
| Finance | Plafon, tempo, invoice, status pembayaran (D5, D7) | Tidak bisa mengubah harga atau promo |
| Inside sales / CS mitra (K6) | Dampingi mitra baru, buat order atas nama mitra | Tidak bisa memberi diskon di luar daftar harga |
| Admin e-commerce / CS konsumen (K9) | Order ritel, retur & garansi konsumen (M6) | Tidak melihat harga net mitra; tidak bisa membuat promo |
| Owner | ACC daftar harga, ACC promo (M4), kebijakan | — |

---

## Bagian C · Sitemap

### C1. Aturan URL

- Setiap halaman punya dua alamat: `/id/...` dan `/en/...`, saling terhubung lewat `hreflang` (L8).
- Produk: `/id/produk/{kategori}/{slug}` — satu halaman untuk semua peran, isi dan tombol berubah sesuai peran (prinsip A2).
- Area terkunci: `/id/mitra/*` dan `/id/akun/*` — `noindex`, tidak pernah masuk sitemap.xml.
- Blog & SOP hanya satu bahasa (L9), jadi tidak dibuatkan pasangan `/en/` kosong — halaman kosong lebih merusak SEO daripada tidak ada halaman.

### C2. Struktur halaman publik

1. **Home** — persona router 5 pintu (N2 + B7): Salon Owner · Hair Stylist · Barber · Perawatan di Rumah · Global Brand
2. **Untuk Salon & Barber** `/id/mitra-baru/`
    - Kenapa jadi mitra (proposisi nilai per peran pembelian)
    - **Opening Paket** — penawaran Rp1.500.000 (N7, B4)
    - Cara jadi mitra: 3 langkah + **Formulir kemitraan** (N4) + halaman status pengajuan
    - **Kebijakan harga kami** — halaman publik berisi MAP & janji tidak menjual di bawah harga mitra (C4, M8)
    - FAQ mitra (ongkir, tempo, retur, pengiriman)
3. **Katalog Produk** `/id/produk/`
    - Kategori teknis: Color · Care · Styling · Teknis/Kimia · Tools (E1)
    - Lapisan navigasi per layanan: Bleaching · Coloring · Smoothing & Rebonding · Perawatan
    - **Halaman brand prinsipal** (mini-site per brand, E7)
    - Halaman produk (template tunggal, lihat Bagian D)
4. **Perawatan di Rumah** `/id/perawatan-di-rumah/` — pintu store konsumen (B7)
    - Kategori konsumen (hanya SKU white-list M1, ukuran retail M3)
    - Panduan memilih produk per masalah rambut
    - **“Kapan Anda butuh profesional”** — halaman yang mengarahkan pekerjaan kimia ke jasa salon (mitigasi risiko Bagian 8 #4)
5. **Alfa Beauty Academy** `/id/academy/` — berbasis acara, bukan LMS (G1)
    - Kalender kelas & form pendaftaran + kuota (G5)
    - Program, educator, dan galeri hairshow/roadshow
6. **Global Brand Gateway** `/en/partner-with-us/` (N10, J1) — bilingual, versi Inggris jadi utama
    - Portofolio brand & rekam jejak (headline), case study (J4)
    - Layanan yang kami sediakan: registrasi/notifikasi BPOM, gudang & distribusi, tim sales lapangan, Academy, dan kanal ritel resmi (J7)
    - Form kualifikasi + penjadwalan meeting (J5)
7. **Artikel & Edukasi** `/id/artikel/` — 2 artikel/bulan, bahasa Indonesia (L2)
    - “Kenali produk asli” (F6)
8. **Tentang Kami** — 18 tahun, 34 provinsi, tim regulatori (bukti pendukung J1)
9. **Kontak & Layanan** — satu nomor WhatsApp pusat (K3), jam layanan & SLA (K4)
10. **Halaman kebijakan** (footer): T&C mitra · Kebijakan harga & MAP · Retur mitra · Retur & garansi konsumen · Kebijakan privasi UU PDP (L4) · Disclaimer produk profesional (L5)

### C3. Area terkunci

- **Dashboard Mitra** `/id/mitra/` — katalog dengan harga net · keranjang & checkout · riwayat order · saldo & riwayat poin (N8) · invoice & sisa plafon tempo (D7) · profil & dokumen · **Resources Hub**: Color Chart digital + SOP bleaching/rebonding (N9)
- **Akun Konsumen** `/id/akun/` — riwayat order, pelacakan kiriman, pengajuan retur 7 hari (M6)

### C4. Back-office

Panel katalog & stok (P6=B) · panel daftar harga ber-versi + log ACC (C10, K10) · panel verifikasi mitra + SLA (N4, D3) · panel order mitra & order konsumen terpisah (K9) · panel promo dengan pagar M2 & M4 · laporan sumber pendaftaran/kode acara (P7=B).

<aside>
🚫

**Halaman yang sengaja TIDAK dibuat** — supaya tidak muncul lagi di tengah development: direktori salon mitra (N6), LMS/kelas online (G1), cek keaslian QR (F3), kalkulator margin publik (P4), portal B2B terpisah (P2=A), halaman segmen sekolah/akademi (B6 ditunda), langganan auto-replenish (I4), dan form laporan penjual tidak resmi (F5).

</aside>

---

## Bagian D · Spesifikasi halaman prioritas

### D1. Sembilan halaman yang menentukan keberhasilan fase 1

| Halaman | Job utama pengunjung | Blok wajib | Kriteria selesai |
| --- | --- | --- | --- |
| Home + persona router | “Situs ini untuk saya atau bukan?” | Pernyataan posisi (A1), 5 pintu persona, bukti kepercayaan (portofolio brand, 18 tahun, 34 provinsi), CTA ganda: jadi mitra / belanja retail | Pengunjung memilih pintu dalam < 10 detik; bounce rate pintu utama terukur |
| Halaman produk (template) | “Apa ini cocok, berapa harganya, bisa saya beli?” | Lihat D2 — halaman paling banyak aturannya | Satu template melayani 4 peran tanpa duplikasi |
| Opening Paket | “Saya mau buka salon, apa yang saya butuh?” | Isi paket, total Rp1.500.000, hitungan estimasi kebutuhan awal, testimoni, tombol daftar mitra | Order pertama tercatat dengan penanda “opening” |
| Formulir kemitraan + status | “Bagaimana cara jadi mitra, dan apa saya diterima?” | Form bertahap, unggah dokumen (D2), penjelasan SLA 4 jam (D3), halaman status, notifikasi WA/email | Pendaftar tahu posisinya tanpa perlu bertanya ke CS |
| Kebijakan harga kami | “Apa kalian akan menyaingi harga saya?” | Janji MSRP, MAP, beda ukuran kemasan, komitmen tidak menjual di bawah harga mitra (M2, M8) | Halaman ini bisa dikirim sebagai jawaban tunggal atas keluhan mitra |
| Store konsumen (Perawatan di Rumah) | “Saya mau produk salon yang aman dipakai sendiri” | Katalog white-list (M1), panduan per masalah rambut, nomor notifikasi BPOM (F1), “kapan butuh profesional” | Konsumen bisa checkout tanpa pernah melihat harga net mitra |
| Dashboard mitra | “Saya mau restock cepat tanpa telepon” | Reorder cepat dari riwayat, harga net, status Ready/Indent, poin, invoice & plafon, Resources Hub | Mitra bisa menyelesaikan reorder < 3 menit tanpa bantuan AM |
| Halaman brand prinsipal | “Brand ini serius atau sekadar dagangan?” | Cerita brand, kategori unggulan, klaim distributor resmi, produk terkait, materi teknis | Dipakai ganda: jualan ke mitra dan bukti ke calon prinsipal |
| Global Brand Gateway (EN) | “Bisakah distributor ini membawa brand saya masuk Indonesia?” | Portofolio, layanan (J7), case study, form kualifikasi, jadwal meeting | Lead prinsipal masuk dengan data cukup untuk dinilai dalam 1 kali baca |

### D2. Template halaman produk — satu halaman, empat perilaku

Halaman ini adalah tempat semua keputusan Bagian 3 bertemu. Karena itu aturannya ditulis eksplisit per peran, bukan diserahkan ke desainer.

| Elemen | Guest | Konsumen | Salon / Barber | Distributor |
| --- | --- | --- | --- | --- |
| Nama, foto, deskripsi, atribut teknis | tampil | tampil | tampil | tampil |
| MSRP | ⏳ tergantung ACC C1 | tampil | tampil (sebagai jangkar harga jual) | tampil |
| Harga net | tidak | tidak | tampil | tampil |
| Tombol beli | tidak (CTA: daftar/masuk) | hanya bila SKU white-list (M1) | tampil | tampil |
| Ukuran kemasan | semua terlihat | hanya retail (M3) | retail + salon/bulk | semua |
| Status stok | Ready / Indent | Ready / Indent | Ready / Indent | Ready / Indent |
| Nomor notifikasi BPOM | tampil bila SKU bisa dibeli konsumen (F1) | wajib tampil | opsional | opsional |
| Blok edukasi teknis | ringkas | versi aman untuk rumah | lengkap + link SOP | lengkap |
| SKU tanpa harga ter-ACC | “Hubungi kami” | “Hubungi kami” | “Hubungi kami” | “Hubungi kami” |

<aside>
⚡

**Satu aturan yang menghemat banyak pekerjaan:** perbedaan antar peran hanya menyangkut **harga, tombol, dan ukuran kemasan**. Semua elemen lain identik. Kalau tim development mulai membuat template terpisah per peran, biaya perawatan naik empat kali tanpa nilai tambah — dan itu tanda prinsip A1 sedang dilanggar.

</aside>

---

## Bagian E · Lima alur kritikal

Alur di bawah ini adalah tempat kebijakan bertemu kode. Kalau salah satu alur tidak punya pemilik proses (nama orang, bukan jabatan), fitur teknisnya akan jadi tapi prosesnya mati.

### E1. Onboarding mitra baru (N4, D1–D4)

`Kunjungan → pilih pintu persona → halaman Opening Paket → formulir kemitraan + unggah dokumen → verifikasi ≤ 4 jam kerja → akun aktif dengan tier (Salon/Barber atau Distributor) → order pertama min Rp1.500.000 → poin mulai berjalan`

- Notifikasi di tiga titik: berkas diterima, disetujui/ditolak, akun siap dipakai.
- Setiap pendaftaran menyimpan **sumber pendaftaran / kode acara** (turunan P7=B) — ini satu-satunya cara mengukur hasil Hairshow tanpa modul komisi.
- Penolakan wajib punya alasan terpilih (dokumen kurang, bukan usaha salon, duplikat) supaya bisa dianalisis.

### E2. Reorder mitra (P1=C, D7)

`Login → katalog harga net → keranjang → pilih bayar: transfer atau tempo → (bila tempo: sistem cek sisa plafon) → konfirmasi order → invoice → kirim → poin ditambahkan setelah pembayaran lunas`

- Fase 1 tetap ada langkah konfirmasi admin sebelum barang dikirim (konsekuensi stok manual P6=B). Ini bukan kelemahan desain, tapi jaring pengaman terhadap stok yang tidak realtime.
- Poin dihitung dari nilai lunas, bukan nilai order — mencegah poin terbit dari order yang dibatalkan.

### E3. Order konsumen (P3=C, M1, M6)

`Masuk lewat pintu “Perawatan di Rumah” → katalog white-list → keranjang → akun ringan (email/OTP) → bayar via payment gateway → kirim → jendela retur 7 hari`

- Bila konsumen membuka SKU profesional: tidak ada tombol beli, diganti blok “kapan Anda butuh profesional”.
- Antrean CS konsumen terpisah dari CS mitra (K9). Menyatukan keduanya akan membuat mitra menunggu di belakang komplain ritel.

### E4. Tata kelola harga (syarat owner di P3, C10, K10)

`Usulan daftar harga baru → ACC owner → admin unggah sebagai versi baru → sistem menandai SKU “harga ter-ACC” → harga tayang → log tercatat (siapa, kapan, versi berapa)`

- SKU yang belum masuk daftar ter-ACC otomatis menyembunyikan harga dan menampilkan “Hubungi kami”.
- Tidak ada jalur mengubah harga satuan di luar mekanisme versi ini. Inilah bentuk teknis dari syarat yang owner tulis sendiri di P3.

### E5. Promo konsumen (M2, M4)

`Usul promo → sistem uji otomatis: apakah harga akhir masih di atas harga net mitra & diskon ≤ 10%? → bila lolos, minta ACC owner → aktif dengan tanggal mulai/berakhir → tercatat`

- Pemeriksaan otomatis ini adalah pengaman termurah terhadap risiko kanibalisasi. Tanpa itu, satu kampanye salah pasang bisa membatalkan seluruh janji di halaman “Kebijakan harga kami”.

---

## Bagian F · Model data minimum

Bukan skema database final, tapi daftar field yang **wajib ada** karena keputusan bisnisnya menuntut. Kalau field ini tidak ada, aturan bisnisnya hanya hidup di kepala admin.

| Entitas | Field wajib | Keputusan sumber |
| --- | --- | --- |
| Produk / SKU | nama & deskripsi (ID + EN), kategori teknis, layanan terkait, brand, atribut teknis (level/tone, rasio developer, waktu proses), ukuran kemasan, kanal (mitra / konsumen / keduanya), boleh dijual ke konsumen (ya/tidak), nomor notifikasi BPOM, status Ready/Indent | P8=C, E1, E3, F1, M1, M3, P6=B |
| Daftar harga | versi, tanggal berlaku, MSRP, harga net Salon/Barber, harga net Distributor, status ter-ACC, pengunggah | P5=A, C10, K10 |
| Akun | jenis (konsumen / salon / barber / distributor), status verifikasi, tier, sumber pendaftaran / kode acara, wilayah, AM pendamping (informasi saja, bukan komisi), plafon & sisa plafon | P5=A, P7=B, D5 |
| Dokumen verifikasi | jenis dokumen, berkas, tanggal unggah, tanggal kedaluwarsa, status, aturan retensi | D2, L4 |
| Order | kanal (mitra / konsumen), penanda order pertama, metode bayar, status pembayaran, status kirim, nilai lunas | N7, D6, E2 |
| Poin | saldo, mutasi per order lunas, nilai tukar berlaku, tanggal kedaluwarsa | N8, I7 |
| Promo | cakupan kanal, besaran, harga akhir hasil hitung, hasil uji terhadap harga net mitra, ACC owner, periode | M2, M4 |
| Lead prinsipal | perusahaan, negara, kategori produk, status kualifikasi, PIC, tanggal respon | J5, J6 |
| Log | perubahan harga, perubahan status akun, perubahan promo — tidak bisa dihapus | K10 |

---

## Bagian G · Percabangan untuk 11 item yang belum di-ACC

Ini bagian yang membuat development bisa jalan **sekarang**. Untuk setiap keputusan yang belum turun, saya tulis dua cabang dan dampaknya ke scope — sehingga tim developer tahu mana yang aman dikerjakan lebih dulu dan mana yang harus dibuat sebagai pengaturan (toggle), bukan sebagai asumsi keras.

| Item | Cabang 1 (usulan default) | Cabang 2 (sebaliknya) | Dampak ke scope |
| --- | --- | --- | --- |
| C1 · MSRP publik? | MSRP tampil untuk guest | Semua harga tersembunyi sampai login | **Buat sebagai pengaturan**, bukan asumsi. Satu tombol di panel admin: “tampilkan MSRP ke pengunjung”. Biayanya kecil sekarang, mahal kalau baru ditambah nanti |
| M1 · White-list konsumen | Kimia profesional tidak dijual ke konsumen | Semua SKU boleh dibeli konsumen | Field “boleh dijual ke konsumen” tetap dibangun di kedua cabang. Yang berubah hanya isi datanya, jadi ini **tidak memblokir** development |
| M2 · Aturan harga konsumen | MSRP, promo maks 10% | Bebas per kampanye | Cabang 1 butuh mesin uji promo (E5). Cabang 2 menghapus fitur itu tapi memindahkan risikonya ke manusia |
| K8 · Insentif sales | Bonus onboarding + KPI aktivasi | Tidak ada pengganti | Cabang 1 butuh laporan “mitra baru per AM” (data sudah ada dari field sumber pendaftaran). Ini pekerjaan kecil dengan dampak adopsi besar |
| D6 · Payment gateway | Masuk fase 1, khusus konsumen | Ditunda | Cabang 2 memotong 1 epik besar tapi membuat store konsumen praktis tidak bisa dipakai — konsumen ritel tidak akan transfer manual |
| C9 · MOQ distributor | Reorder bebas, distributor punya MOQ | Sama dengan salon | Hanya nilai konfigurasi, bukan kode baru. Bisa diputuskan belakangan |
| C4 · MAP di T&C | Ya | Tidak | Cabang 1 hanya butuh halaman kebijakan; tidak ada dampak teknis. Dampaknya legal & hubungan mitra |
| I7 · Nilai poin | Rp5.000 per Rp500.000, kedaluwarsa 12 bulan | Nilai lain | Mesin poin dibangun dengan nilai sebagai parameter. Tidak memblokir, tapi tanpa angka final poin tidak boleh diaktifkan ke mitra |
| A4 · Target 12 bulan | 150 mitra, 30% order via web, B2C ≤ 10% | Angka lain | Menentukan isi dashboard laporan, bukan fitur. Bisa menyusul |
| L5 · Dokumen legal | PIC + tenggat ditetapkan | Belum | **Ini bisa menahan launch**, bukan development. Halaman kebijakan bisa dibangun kosong, tapi tidak boleh live tanpa isi |
| L6 · Scope MVP & tanggal | MoSCoW di Bagian H | Ditambah/dikurangi | Perlu diputuskan sebelum tim developer memberi estimasi, karena inilah yang mereka hitung |

<aside>
💡

**Pola yang saya pakai di seluruh tabel ini:** setiap keputusan yang belum turun diubah menjadi **parameter**, bukan asumsi. Dengan begitu keputusan owner bisa datang minggu depan tanpa membongkar kode — dan tim developer tidak punya alasan untuk menunggu. Dari 11 item, hanya dua yang benar-benar memblokir pekerjaan teknis: **D6** (ada/tidak ada payment gateway) dan **L6** (batas scope).

</aside>

---

## Bagian H · Scope development (MoSCoW + ukuran relatif)

Ukuran memakai T-shirt size (S ≈ beberapa hari, M ≈ 1–2 minggu, L ≈ 3–4 minggu untuk satu tim kecil). Ini bahan pembanding, bukan janji — estimasi resmi tetap dari tim developer.

| Epik | MoSCoW | Isi | Ukuran | Prasyarat |
| --- | --- | --- | --- | --- |
| 1. Fondasi & i18n | Must | Routing /id/ – /en/, hreflang, design system, komponen dasar | L | — |
| 2. Katalog & halaman produk multi-peran | Must | Kategori, brand, filter, template PDP dengan aturan Bagian D2 | L | Epik 1, data produk |
| 3. Akun, peran & gating harga | Must | 5 peran, login, aturan tampil harga, pengaturan C1 | M | Epik 1 |
| 4. Daftar harga ber-versi + ACC + log | Must | Unggah versi, flag ter-ACC, riwayat, “Hubungi kami” otomatis | M | Epik 3 |
| 5. Formulir kemitraan + panel verifikasi | Must | Form bertahap, unggah dokumen, status, notifikasi, SLA | M | Epik 3 |
| 6. Keranjang & order mitra | Must | Harga net, validasi Opening Paket, konfirmasi admin, invoice | M | Epik 2, 4 |
| 7. Store konsumen + pembayaran | Must (bila D6 ya) | Pintu konsumen, white-list, gateway, ongkir, retur 7 hari | L | Epik 2, 3 |
| 8. Mesin poin | Must | Poin per Rp500.000 dari nilai lunas, saldo, riwayat, kedaluwarsa | M | Epik 6, angka I7 |
| 9. Resources Hub terkunci | Must | Halaman unduhan Color Chart + SOP di balik login | S | Epik 3, file dari owner |
| 10. Halaman brand + Global Brand Gateway | Must | Template brand, halaman EN, form kualifikasi | M | Epik 1 |
| 11. Halaman kebijakan & consent PDP | Must | T&C, kebijakan harga, retur, privasi, banner consent | S | Dokumen L5 |
| 12. Panel promo dengan pagar M2 | Should | Uji otomatis harga akhir vs harga net mitra, ACC owner | S | Epik 4, 7 |
| 13. Order tempo online | Should | Plafon, sisa plafon, status invoice | M | Epik 6, aturan D5 |
| 14. Academy: kalender & pendaftaran | Should | Daftar acara, kuota, form peserta | S | Epik 1 |
| 15. Reminder restock (WA/email) | Should | Pemicu berbasis siklus, kelola consent | S | Epik 6, 11 |
| 16. Laporan sumber pendaftaran & kanal | Should | Laporan mitra baru per sumber/kode acara, kontribusi B2C | S | Epik 5, 7 |
| 17. Integrasi ERP | Won't (fase 2) | Sinkron stok & harga realtime | L | Nama sistem (K1) |
| 18. LMS, QR keaslian, direktori, langganan, kalkulator margin | Won't | — | — | Sudah gugur di Bagian 4 |

---

## Bagian I · Urutan build & milestone

Urutan ini disusun dengan satu prinsip: **kerjakan dulu yang tidak menunggu keputusan siapa pun.** Dengan pola parameter di Bagian G, gelombang 1 bisa mulai hari Senin meskipun 11 ACC belum turun.

| Gelombang | Isi | Yang dibutuhkan sebelum mulai | Hasil yang bisa dilihat owner |
| --- | --- | --- | --- |
| **0 · Persiapan** | Kumpulkan aset (Bagian J), tetapkan PIC, ACC 11 item Bagian 6b | Waktu owner, bukan developer | Daftar harga v1 ter-ACC + white-list SKU |
| **1 · Fondasi** | Epik 1, 2, 3 — fondasi & i18n, katalog, akun & gating harga | Foto & deskripsi produk (bisa bertahap) | Katalog bisa dibuka, harga berubah sesuai peran yang login |
| **2 · Mesin kemitraan** | Epik 4, 5, 6, 9 — daftar harga ber-versi, formulir kemitraan, order mitra, Resources Hub | Daftar harga ter-ACC, file Color Chart & SOP | Mitra pertama bisa mendaftar dan order tanpa telepon |
| **3 · Kanal konsumen** | Epik 7, 8, 11, 12 — store konsumen, poin, halaman kebijakan, pagar promo | ACC D6, M1, M2, I7 + dokumen legal | Store ritel jalan tanpa merusak harga mitra |
| **4 · Penguatan** | Epik 10, 13, 14, 15, 16 — Global Brand Gateway, tempo online, Academy, reminder, laporan | Konten brand, aturan tempo, kalender acara | Situs mulai menghasilkan lead prinsipal & data kanal |

### Definisi “selesai” fase 1

Bukan “situs sudah live”, tapi tiga angka yang bisa diperiksa:

1. **30 mitra terverifikasi** menyelesaikan minimal satu order lewat web tanpa bantuan admin.
2. **Nol keluhan harga** dari mitra terkait store konsumen dalam 30 hari pertama (uji apakah pagar M1–M2 bekerja).
3. **Satu daftar harga ter-ACC** berjalan penuh tanpa perlu perubahan harga manual di luar sistem.

---

## Bagian J · Yang harus disiapkan owner (aset, bukan keputusan)

Ini bagian yang paling sering menjadi penyebab keterlambatan proyek website distribusi — bukan kodenya, tapi datanya. Semua item di bawah tidak bisa dikerjakan oleh developer.

- [ ]  **Daftar harga v1 ter-ACC** dalam satu spreadsheet: SKU, MSRP, harga net Salon/Barber, harga net Distributor
- [ ]  **White-list SKU konsumen** — daftar SKU yang boleh dibeli tanpa keahlian profesional (M1)
- [ ]  **Nomor notifikasi BPOM per SKU** yang dijual ke konsumen (F1)
- [ ]  **Foto produk** dengan standar seragam + deskripsi & atribut teknis per SKU
- [ ]  **Isi final Opening Paket** Rp1.500.000 (daftar barang, bukan hanya nilai)
- [ ]  **File Color Chart digital & SOP** bleaching/rebonding siap unggah (N9)
- [ ]  **Konten brand prinsipal**: logo, cerita brand, izin memakai nama & case study (J4)
- [ ]  **Dokumen legal**: T&C mitra, kebijakan harga & MAP, retur mitra, retur konsumen, kebijakan privasi (L5)
- [ ]  **Nomor WhatsApp pusat + jam layanan resmi** (K3, K4)
- [ ]  **Nama PIC** untuk: harga & stok, pemilik website, terjemahan konten EN, dan penanggung jawab lead prinsipal (K2, K7, L9, J6)

<aside>
➡️

**Cara memakai dokumen ini.** Lembar keputusan (halaman induk) adalah tempat berdebat; dokumen ini tempat mengeksekusi. Setelah 11 ACC di Bagian 6b turun, yang perlu diubah di sini hanya kolom “Cabang” di Bagian G — sisanya sudah final. Dokumen ini sudah bisa dikirim ke tim developer untuk estimasi tanpa menunggu ACC, dengan catatan: **estimasi diminta per epik di Bagian H**, bukan per halaman, supaya perbandingan penawaran antar vendor apel-ke-apel.

</aside>
