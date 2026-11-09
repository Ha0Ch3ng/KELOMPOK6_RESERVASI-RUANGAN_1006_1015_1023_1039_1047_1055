// Konfigurasi koneksi MySQL menggunakan mysql2/promise + connection pool
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 8889),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_reservasi_ruangan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Pastikan tanggal/jam dikembalikan sebagai string agar tidak bergeser zona waktu
  dateStrings: true,
});

// Uji koneksi saat modul dimuat (dipanggil dari server.js setelah listen)
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('Koneksi MySQL berhasil');
    conn.release();
  } catch (err) {
    console.error('Koneksi MySQL gagal:', err.message);
  }
}

module.exports = { pool, testConnection };
