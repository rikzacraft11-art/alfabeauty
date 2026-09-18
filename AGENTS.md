# Agent Guidelines & Business Constraints — Alfa Beauty Cosmetica

Dokumen ini adalah pedoman dan batasan kerja (rules) yang **wajib dipatuhi oleh seluruh agent AI** yang bekerja di repositori ini.

---

## 1. Perlindungan Cakupan Bisnis (Business Scope Preservation)

- **Tidak Merubah Cakupan Bisnis yang Ada**: Seluruh logika bisnis, model peran (*Guest*, *Konsumen Retail*, *Mitra Salon/Barber*, *Distributor*), pemisahan harga (MSRP vs Harga Net Salon/Distributor), proteksi MAP (*Minimum Advertised Price*), dan alur kemitraan dari [Blueprint.md](docs/Blueprint.md) adalah acuan baku.
- **Dilarang Menambah / Mengubah Fitur Spekulatif**: Jangan membuat portal B2B terpisah, LMS/kelas online, direktori salon publik, atau fitur di luar scope yang telah ditetapkan.
- **Satu Situs, Banyak Peran**: Perbedaan hak akses diatur melalui peran pengguna (*role-based*), bukan memisahkan properti web atau domain.

---

## 2. Larangan Komitmen Kuantitatif Prematur (No Premature Quantitative Claims)
>
> **PENTING**: Keputusan kuantitatif bisnis belum difinalisasi antara tim pengembang dengan **Pak Edy (selaku owner)**.

Oleh karena itu, **DILARANG KERAS** mencantumkan angka, kuota, atau janji kuantitatif yang mengikat secara sepihak di UI/copy/komponen mana pun. Hal-hal berikut adalah **sebagai salah satu contoh** (namun tidak terbatas pada):

1. **SLA Waktu Tertentu (Contoh: "SLA ≤ 4 jam kerja")**: Dilarang mengklaim janji durasi spesifik sebelum ada keputusan resmi. Gunakan kalimat kualitatif netral: *"Verifikasi oleh tim kemitraan kami pada hari kerja"*.
2. **Nominal Paket Kemitraan (Contoh: "Opening Paket Rp1.500.000")**: Angka paket modal/opening salon merupakan ilustrasi awal dan belum di-ACC oleh Pak Edy. Dilarang mengunci angka nominal di copy publik. Gunakan istilah kualitatif umum: *"Paket kemitraan salon perdana"* atau *"Penawaran paket kemitraan salon"*.
3. **Plafon Finansial, Kuota, & Batas Poin (Contoh: batas minimum order, kuota kelas, kelipatan poin)**: Jangan membuat angka kuantitatif definitif tanpa validasi owner. Biarkan parameter tetap dapat dikonfigurasi (*configurable*) atau dinyatakan secara deskriptif sampai ada keputusan resmi dari owner.

---

## 3. Standar Kualitas Teknis

- **Zero Lint & Typecheck Errors**: Setiap perubahan wajib melewati `npm run lint` (0 error, 0 warning) dan `npm run typecheck`.
- **Aksessibilitas (a11y)**: Seluruh kontrol interaktif wajib memenuhi standar WCAG (dukungan keyboard, label asosiasi form, aria attributes).
- **Integritas Build**: Memastikan 100% rute Next.js App Router dapat dikompilasi dengan bersih (`npm run build`).
