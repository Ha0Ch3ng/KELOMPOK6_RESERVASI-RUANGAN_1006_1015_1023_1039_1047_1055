// Entry point backend API (Express)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const reservasiRoutes = require('./routes/reservasiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Reservasi Ruangan aktif', base: '/api/reservasi' });
});

// Rute utama
app.use('/api/reservasi', reservasiRoutes);

// Handler 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
});

app.listen(PORT, async () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  await testConnection();
});
