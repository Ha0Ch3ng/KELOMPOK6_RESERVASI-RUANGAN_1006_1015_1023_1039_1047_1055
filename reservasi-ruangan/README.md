# Sistem Reservasi Ruangan (CRUD)

Aplikasi CRUD reservasi/peminjaman ruangan (ruang kelas, laboratorium, ruang rapat, aula) untuk Praktikum Pemrograman Web Dasar (Pertemuan 14, LKK).

- **Entitas:** `reservasi`
- **Arsitektur:** Database (MySQL) → Backend API (Express) → Frontend (Vue 3 SPA)
- **Catatan penting:** Database yang digunakan **wajib MySQL** (MySQL 8 / MariaDB). Jangan menggunakan database lain.

## Prasyarat

- Node.js 18+ dan npm
- **MySQL 8 / MariaDB** (dapat diakses via CLI atau phpMyAdmin)
- Browser modern

## Struktur Folder

```
reservasi-ruangan/
├── database/schema.sql
├── backend/          (Express + mysql2/promise + cors + dotenv)
├── frontend/         (Vue 3 + Vite + Vue Router 4 + Axios + Tailwind CSS v3.4)
├── docs/             (LKK-ISIAN.md, erd.mmd, postman_collection.json)
├── .gitignore
└── README.md
```

## 1) Instalasi Database (MySQL)

Pastikan server MySQL berjalan, lalu impor skema + seed:

```bash
mysql -u root -p < database/schema.sql
```

Verifikasi (harus menghasilkan 8 baris seed):

```bash
mysql -u root -p -D db_reservasi_ruangan -e "SELECT * FROM reservasi;"
```

> Catatan: skema bersifat idempotent (`CREATE DATABASE IF NOT EXISTS`, `DROP TABLE IF EXISTS`). Sesuaikan user/password/port MySQL pada `.env` backend (mis. MAMP sering memakai port `8889` dan password `root`).

## 2) Menjalankan Backend

```bash
cd backend
cp .env.example .env   # jika belum ada, lalu sesuaikan kredensial MySQL
npm install
npm run dev            # atau: npm start
```

- Berjalan di `http://localhost:3000`
- Health check: `GET /`
- Saat start, backend mencoba koneksi dan mencetak `Koneksi MySQL berhasil` atau pesan error yang jelas.

## 3) Menjalankan Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev
```

- Berjalan di `http://localhost:5173`
- Build produksi: `npm run build`

## Daftar Endpoint API

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Fungsi | Sukses | Gagal |
|---|---|---|---|---|
| GET | `/reservasi` | Ambil semua (query opsional: `search`, `kategori`, `status`) | 200 | 500 |
| GET | `/reservasi/:id` | Ambil satu reservasi | 200 | 404 |
| POST | `/reservasi` | Tambah reservasi | 201 | 400 / 409 (bentrok) |
| PUT | `/reservasi/:id` | Ubah reservasi | 200 | 400 / 404 / 409 |
| DELETE | `/reservasi/:id` | Hapus reservasi | 200 | 404 |

Koleksi Postman/Thunder Client: `docs/postman_collection.json` (5 request utama + 3 kasus gagal).

## Hasil Pengujian

Pengujian end-to-end dan pengujian API terhadap database **memerlukan MySQL aktif** dengan kredensial yang sesuai di `backend/.env`.

| Skenario | Status | Keterangan |
|---|---|---|
| Import `schema.sql` menghasilkan ≥ 5 seed | Belum dieksekusi di lingkungan ini | Kode skema + 8 seed disiapkan; jalankan perintah di bagian Database. |
| 5 endpoint lulus (Postman/curl) + 3 kasus gagal | Belum dieksekusi di lingkungan ini | Koleksi tersedia; jalankan setelah backend + MySQL aktif, catat hasil di `docs/LKK-ISIAN.md`. |
| E2E: READ/CREATE/UPDATE/DELETE/refresh/responsif/bentrok | Belum dieksekusi di lingkungan ini | Butuh backend+frontend+MySQL berjalan. |
| `npm run build` frontend | Lihat catatan eksekusi | Coba jalankan `cd frontend && npm install && npm run build`. |

**Lingkungan pembuatan (terdeteksi):** Node v26.13.0, npm 11.20.0, MySQL CLI 8.4.11 tersedia. Koneksi `mysql -u root` tanpa password ditolak di mesin ini (`Access denied`), sehingga pengujian terhadap DB nyata tidak dapat dijalankan tanpa kredensial yang benar. Semua kode dibuat sesuai spesifikasi dan siap diuji setelah konfigurasi `.env`.

## Asumsi

1. Database menggunakan **MySQL** (MySQL 8 / MariaDB) sesuai catatan/kebutuhan tugas.
2. Kredensial MySQL default di `.env.example` adalah `root` tanpa password pada port `3306`; pengguna menyesuaikan (mis. MAMP).
3. Cek bentrok jadwal mengabaikan reservasi berstatus `Ditolak` dan (pada PUT) mengabaikan record yang sedang diubah.
4. `CHECK (jam_selesai > jam_mulai)` didukung oleh MySQL 8.0.16+; validasi waktu tetap ditegakkan di backend.
5. Tanggal/jam direspons diformat sebagai string (`YYYY-MM-DD`, `HH:mm`) via `DATE_FORMAT`/`TIME_FORMAT` dan `dateStrings: true` untuk menghindari pergeseran zona waktu.
6. Tanpa autentikasi/otorisasi (tidak diminta oleh requirement).

## Dokumentasi LKK

- `docs/LKK-ISIAN.md` — isian bagian 3, 4, 5, checklist, dan template log kendala
- `docs/erd.mmd` — ERD Mermaid
- `docs/postman_collection.json` — koleksi pengujian API

> Identitas kelompok, anggota, pembagian tugas, kontribusi, repo GitHub, dan pengesahan diisi manual oleh pengguna.
