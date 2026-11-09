// Controller reservasi: 5 handler dengan try/catch, validasi, dan cek bentrok jadwal
const Reservasi = require('../models/reservasiModel');
const { pool } = require('../config/db');

const KATEGORI = ['Ruang Kelas', 'Laboratorium', 'Ruang Rapat', 'Aula'];
const STATUS = ['Menunggu', 'Disetujui', 'Ditolak'];

// Validasi input (dipakai POST & PUT)
function validate(body, isUpdate = false) {
  const errors = [];
  const required = ['nama_pemesan', 'nama_ruangan', 'tanggal', 'jam_mulai', 'jam_selesai'];
  for (const f of required) {
    if (!body[f] || String(body[f]).trim() === '') errors.push(`${f} wajib diisi`);
  }
  if (body.kategori && !KATEGORI.includes(body.kategori)) {
    errors.push(`kategori harus salah satu dari: ${KATEGORI.join(', ')}`);
  }
  if (body.status && !STATUS.includes(body.status)) {
    errors.push(`status harus salah satu dari: ${STATUS.join(', ')}`);
  }
  if (body.tanggal && !/^\d{4}-\d{2}-\d{2}$/.test(body.tanggal)) {
    errors.push('tanggal harus berformat YYYY-MM-DD');
  }
  const timeRe = /^\d{2}:\d{2}(:\d{2})?$/;
  if (body.jam_mulai && !timeRe.test(body.jam_mulai)) errors.push('jam_mulai harus berformat HH:MM atau HH:MM:SS');
  if (body.jam_selesai && !timeRe.test(body.jam_selesai)) errors.push('jam_selesai harus berformat HH:MM atau HH:MM:SS');
  if (body.jam_mulai && body.jam_selesai && timeRe.test(body.jam_mulai) && timeRe.test(body.jam_selesai)) {
    if (body.jam_selesai <= body.jam_mulai) errors.push('jam_selesai harus lebih besar dari jam_mulai');
  }
  return errors;
}

// Cek bentrok jadwal: ruangan & tanggal sama, jam beririsan, abaikan Ditolak dan diri sendiri (PUT)
async function hasConflict({ nama_ruangan, tanggal, jam_mulai, jam_selesai }, ignoreId = null) {
  let sql = `SELECT id FROM reservasi
             WHERE nama_ruangan = ? AND tanggal = ?
               AND status <> 'Ditolak'
               AND jam_mulai < ? AND jam_selesai > ?`;
  const params = [nama_ruangan, tanggal, jam_selesai, jam_mulai];
  if (ignoreId) {
    sql += ' AND id <> ?';
    params.push(ignoreId);
  }
  const [rows] = await pool.query(sql, params);
  return rows.length > 0;
}

// GET /api/reservasi
async function getAllReservasi(req, res) {
  try {
    const { search, kategori, status } = req.query;
    const data = await Reservasi.getAll({ search, kategori, status });
    return res.status(200).json({ success: true, message: 'Daftar reservasi berhasil diambil', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// GET /api/reservasi/:id
async function getReservasiById(req, res) {
  try {
    const data = await Reservasi.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Reservasi tidak ditemukan' });
    return res.status(200).json({ success: true, message: 'Reservasi ditemukan', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// POST /api/reservasi
async function createReservasi(req, res) {
  try {
    const errors = validate(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: 'Validasi gagal', errors });
    const conflict = await hasConflict(req.body);
    if (conflict) {
      return res.status(409).json({ success: false, message: 'Jadwal bentrok: ruangan sudah dipesan pada rentang waktu tersebut' });
    }
    const data = await Reservasi.create(req.body);
    return res.status(201).json({ success: true, message: 'Reservasi berhasil ditambahkan', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// PUT /api/reservasi/:id
async function updateReservasi(req, res) {
  try {
    const existing = await Reservasi.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Reservasi tidak ditemukan' });
    const errors = validate(req.body, true);
    if (errors.length) return res.status(400).json({ success: false, message: 'Validasi gagal', errors });
    const conflict = await hasConflict(req.body, req.params.id);
    if (conflict) {
      return res.status(409).json({ success: false, message: 'Jadwal bentrok: ruangan sudah dipesan pada rentang waktu tersebut' });
    }
    const data = await Reservasi.update(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Reservasi berhasil diperbarui', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

// DELETE /api/reservasi/:id
async function deleteReservasi(req, res) {
  try {
    const existing = await Reservasi.getById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Reservasi tidak ditemukan' });
    await Reservasi.remove(req.params.id);
    return res.status(200).json({ success: true, message: 'Reservasi berhasil dihapus', data: { id: Number(req.params.id) } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

module.exports = {
  getAllReservasi,
  getReservasiById,
  createReservasi,
  updateReservasi,
  deleteReservasi,
};
