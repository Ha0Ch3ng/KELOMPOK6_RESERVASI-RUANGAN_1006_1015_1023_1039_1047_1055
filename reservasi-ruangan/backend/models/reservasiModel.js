// Model reservasi: 5 fungsi query dengan parameterized placeholder (?)
const { pool } = require('../config/db');

// Ambil semua reservasi dengan filter opsional (search, kategori, status)
async function getAll({ search, kategori, status } = {}) {
  let sql = `SELECT id, nama_pemesan, nama_ruangan, kategori,
                    DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal,
                    TIME_FORMAT(jam_mulai, '%H:%i') AS jam_mulai,
                    TIME_FORMAT(jam_selesai, '%H:%i') AS jam_selesai,
                    keperluan, status, created_at
             FROM reservasi WHERE 1=1`;
  const params = [];
  if (search) {
    sql += ` AND (nama_pemesan LIKE ? OR nama_ruangan LIKE ? OR keperluan LIKE ?)`;
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (kategori) {
    sql += ` AND kategori = ?`;
    params.push(kategori);
  }
  if (status) {
    sql += ` AND status = ?`;
    params.push(status);
  }
  sql += ` ORDER BY tanggal DESC, jam_mulai ASC`;
  const [rows] = await pool.query(sql, params);
  return rows;
}

// Ambil satu reservasi berdasarkan id
async function getById(id) {
  const sql = `SELECT id, nama_pemesan, nama_ruangan, kategori,
                      DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal,
                      TIME_FORMAT(jam_mulai, '%H:%i') AS jam_mulai,
                      TIME_FORMAT(jam_selesai, '%H:%i') AS jam_selesai,
                      keperluan, status, created_at
               FROM reservasi WHERE id = ?`;
  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
}

// Tambah reservasi baru
async function create(data) {
  const sql = `INSERT INTO reservasi
    (nama_pemesan, nama_ruangan, kategori, tanggal, jam_mulai, jam_selesai, keperluan, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    data.nama_pemesan,
    data.nama_ruangan,
    data.kategori || 'Ruang Kelas',
    data.tanggal,
    data.jam_mulai,
    data.jam_selesai,
    data.keperluan || null,
    data.status || 'Menunggu',
  ];
  const [result] = await pool.query(sql, params);
  return getById(result.insertId);
}

// Ubah reservasi
async function update(id, data) {
  const sql = `UPDATE reservasi SET
    nama_pemesan = ?, nama_ruangan = ?, kategori = ?, tanggal = ?,
    jam_mulai = ?, jam_selesai = ?, keperluan = ?, status = ?
    WHERE id = ?`;
  const params = [
    data.nama_pemesan,
    data.nama_ruangan,
    data.kategori || 'Ruang Kelas',
    data.tanggal,
    data.jam_mulai,
    data.jam_selesai,
    data.keperluan || null,
    data.status || 'Menunggu',
    id,
  ];
  await pool.query(sql, params);
  return getById(id);
}

// Hapus reservasi
async function remove(id) {
  const [result] = await pool.query('DELETE FROM reservasi WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
