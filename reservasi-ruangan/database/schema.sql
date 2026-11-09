-- Schema database untuk Sistem Reservasi Ruangan
-- Database: MySQL 8 / MariaDB

CREATE DATABASE IF NOT EXISTS db_reservasi_ruangan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_reservasi_ruangan;

DROP TABLE IF EXISTS reservasi;

CREATE TABLE reservasi (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nama_pemesan  VARCHAR(100) NOT NULL,
  nama_ruangan  VARCHAR(100) NOT NULL,
  kategori      ENUM('Ruang Kelas','Laboratorium','Ruang Rapat','Aula') NOT NULL DEFAULT 'Ruang Kelas',
  tanggal       DATE NOT NULL,
  jam_mulai     TIME NOT NULL,
  jam_selesai   TIME NOT NULL,
  keperluan     TEXT NULL,
  status        ENUM('Menunggu','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_jam CHECK (jam_selesai > jam_mulai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data (8 baris), tanpa jadwal bentrok pada ruangan & tanggal yang sama
INSERT INTO reservasi (nama_pemesan, nama_ruangan, kategori, tanggal, jam_mulai, jam_selesai, keperluan, status) VALUES
('Muhammad Iqbal',      'Lab Komputer 2',     'Laboratorium', '2026-11-20', '08:00:00', '10:00:00', 'Praktikum Pemrograman Web',              'Disetujui'),
('Siti Aisyah',         'Ruang Kelas 301',    'Ruang Kelas',  '2026-11-20', '10:00:00', '12:00:00', 'Kuliah pengganti Basis Data',            'Disetujui'),
('Budi Santoso',        'Ruang Rapat A',      'Ruang Rapat',  '2026-11-21', '09:00:00', '11:00:00', 'Rapat koordinasi himpunan mahasiswa',    'Menunggu'),
('Dewi Lestari',        'Aula Utama',         'Aula',         '2026-11-22', '13:00:00', '16:00:00', 'Seminar teknologi informasi',            'Disetujui'),
('Ahmad Fauzi',         'Lab Komputer 1',     'Laboratorium', '2026-11-23', '08:00:00', '10:00:00', 'Ujian praktik jaringan komputer',        'Menunggu'),
('Rina Kurniawati',     'Ruang Kelas 202',    'Ruang Kelas',  '2026-11-24', '13:00:00', '15:00:00', 'Presentasi tugas akhir kelompok',        'Disetujui'),
('Hendra Wijaya',       'Ruang Rapat B',      'Ruang Rapat',  '2026-12-01', '10:00:00', '12:00:00', 'Pembahasan proposal penelitian dosen',   'Ditolak'),
('Nurul Hidayah',       'Lab Komputer 2',     'Laboratorium', '2026-12-02', '13:00:00', '15:00:00', 'Pelatihan desain antarmuka pengguna',    'Menunggu');

-- Verifikasi: SELECT * FROM reservasi;
