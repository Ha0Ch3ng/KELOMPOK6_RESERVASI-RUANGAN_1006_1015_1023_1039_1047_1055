# LKK-ISIAN — Sistem Reservasi Ruangan (CRUD)

> Dokumen ini berisi isian siap salin ke Lembar Kerja Kelompok. Bagian identitas kelompok, anggota, pembagian tugas, kontribusi, repo GitHub, dan pengesahan diisi manual oleh pengguna.

## 1. Konteks (ringkas)
- Topik: Vue.js + MySQL + Tailwind CSS (CRUD)
- Studi kasus: Reservasi Ruangan
- Entitas tunggal: `reservasi`
- Arsitektur: Database (MySQL) → Backend API (Express) → Frontend (Vue 3 SPA)

## 3. Rancangan Database

- **Nama database:** `db_reservasi_ruangan`
- **Nama tabel:** `reservasi`

| No | Field | Tipe Data | Constraint | Contoh Nilai |
|---|---|---|---|---|
| 1 | `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 1 |
| 2 | `nama_pemesan` | VARCHAR(100) | NOT NULL | Muhammad Iqbal |
| 3 | `nama_ruangan` | VARCHAR(100) | NOT NULL | Lab Komputer 2 |
| 4 | `kategori` | ENUM('Ruang Kelas','Laboratorium','Ruang Rapat','Aula') | NOT NULL, DEFAULT 'Ruang Kelas' | Laboratorium |
| 5 | `tanggal` | DATE | NOT NULL | 2026-11-20 |
| 6 | `jam_mulai` | TIME | NOT NULL | 08:00:00 |
| 7 | `jam_selesai` | TIME | NOT NULL | 10:00:00 |
| 8 | `keperluan` | TEXT | NULL | Praktikum Pemrograman Web |
| 9 | `status` | ENUM('Menunggu','Disetujui','Ditolak') | NOT NULL, DEFAULT 'Menunggu' | Disetujui |
| 10 | `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 2026-11-09 09:00:00 |

Catatan: `CHECK (jam_selesai > jam_mulai)`, engine InnoDB, charset `utf8mb4`. Seed 8 baris di `database/schema.sql`.

## 3b. Sketsa ERD
Lihat `docs/erd.mmd` (Mermaid `erDiagram`) untuk entitas `reservasi` beserta seluruh field.

## 4. API Endpoints & Status Test

- **Base URL:** `http://localhost:3000/api`

| No | Method | Endpoint | Fungsi | Sukses | Gagal | STATUS |
|---|---|---|---|---|---|---|
| 1 | GET | `/reservasi` | Ambil semua reservasi (query opsional: `search`, `kategori`, `status`) | 200 | 500 | Belum diuji* |
| 2 | GET | `/reservasi/:id` | Ambil satu reservasi | 200 | 404 | Belum diuji* |
| 3 | POST | `/reservasi` | Tambah reservasi | 201 | 400 / 409 | Belum diuji* |
| 4 | PUT | `/reservasi/:id` | Ubah reservasi | 200 | 400 / 404 / 409 | Belum diuji* |
| 5 | DELETE | `/reservasi/:id` | Hapus reservasi | 200 | 404 | Belum diuji* |

Kasus gagal yang disiapkan di koleksi Postman (`docs/postman_collection.json`): (1) POST validasi kosong → 400, (2) GET id tidak ada → 404, (3) POST jadwal bentrok → 409.

\*STATUS belum diuji pada lingkungan pembuatan karena memerlukan MySQL aktif + konfigurasi `.env` + `npm install` + server berjalan. Jalankan `docs/postman_collection.json` (Postman/Thunder Client/curl) setelah setup, lalu perbarui kolom STATUS menjadi OK/GAGAL berdasarkan hasil nyata.

## 5. Rancangan Frontend

| No | Nama File View | Rute URL | Fungsi | Tailwind komponen (contoh) |
|---|---|---|---|---|
| 1 | `components/ReservasiForm.vue` | – | Form reusable (create & edit), prop `initialData`/`loading`/`submitLabel`, emit `submit`; validasi klien & error per field | grid 1/2 kolom, `rounded-lg border focus:ring`, tombol `bg-indigo-600 hover:bg-indigo-700` |
| 2 | `views/ReservasiListView.vue` | `/` | **READ**: tabel (desktop) / kartu (mobile), Edit & Hapus, tombol "+ Tambah", search/filter, loading/empty/error | `overflow-x-auto`, `md:table`/`md:hidden`, badge status, `sm:grid-cols-2` |
| 3 | `views/ReservasiCreateView.vue` | `/tambah` | **CREATE**: memakai `ReservasiForm`, redirect ke `/` setelah sukses | card `max-w-2xl mx-auto shadow` |
| 4 | `views/ReservasiEditView.vue` | `/edit/:id` | **UPDATE**: load data via `getById`, isi form, simpan; tangani 404 | sama seperti create + skeleton `animate-pulse` |
| 5 | `App.vue` | – | Navbar responsif (judul, link Daftar & Tambah, hamburger mobile) + `<RouterView />` | `sticky top-0`, `hidden md:flex` |

Komponen pendukung: `components/ToastNotif.vue` (sukses hijau / error merah, hilang ±3 detik).

**Fitur tambahan yang dipilih:** [x] Search (debounce ±400 ms, query `search`), [x] Filter kategori & status, [x] Toast notif. [ ] Pagination (opsional), [ ] Dark mode, [ ] Dashboard.

## 6. Checklist (Phase 1–5)

### Phase 1 — Database
- [x] `database/schema.sql` idempotent (CREATE DB IF NOT EXISTS, DROP/CREATE TABLE, seed)
- [x] Seed 8 baris, variasi kategori/status, tanpa jadwal bentrok
- [x] Perintah verifikasi ada di README

### Phase 2 — Backend API
- [x] Struktur backend (config/model/controller/routes/server), CommonJS
- [x] 5 endpoint terdaftar, respons JSON konsisten, port 3000, CORS `http://localhost:5173`
- [x] Validasi, cek bentrok jadwal (409), 404 untuk id tidak ada, query parameterized
- [x] `docs/postman_collection.json` (5 utama + 3 kasus gagal)
- [ ] Seluruh request Postman/curl lulus terhadap MySQL aktif (butuh eksekusi nyata)

### Phase 3 — Frontend Fondasi
- [x] Vite + Vue 3, Vue Router 4, Axios, Tailwind v3.4 (`tailwind.config.js`, `postcss.config.js`, direktif `@tailwind`)
- [x] `api.js` + `reservasiService.js` (5 fungsi), 3 rute

### Phase 4 — Frontend Komponen
- [x] 3 view + `App.vue` + `ReservasiForm.vue` + `ToastNotif.vue`, utility Tailwind saja
- [x] Konfirmasi hapus, loading/empty/error, badge status, format tanggal tampil `id-ID`
- [x] Fitur tambahan: search, filter kategori/status, toast

### Phase 5 — Test End-to-End
- [ ] Skenario E2E diverifikasi pada lingkungan dengan MySQL + backend + frontend berjalan (butuh eksekusi nyata)
- [ ] `npm run build` frontend diverifikasi setelah `npm install` (butuh eksekusi nyata)

## 7. Log Kendala & Solusi

| Tanggal | Kendala | Solusi / Status |
|---|---|---|
| (isi manual) | (belum ada; jangan mengarang) | (isi manual) |

Catatan: Pada saat pembuatan kode, MySQL CLI tersedia (`mysql  Ver 8.4.11`) namun koneksi tanpa password ditolak di lingkungan ini; pengujian API/E2E memerlukan kredensial `.env` dan server MySQL yang sesuai.
