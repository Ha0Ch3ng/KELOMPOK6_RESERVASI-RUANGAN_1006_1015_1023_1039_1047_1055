// Rute API reservasi (5 endpoint)
const express = require('express');
const router = express.Router();
const c = require('../controllers/reservasiController');

router.get('/', c.getAllReservasi);
router.get('/:id', c.getReservasiById);
router.post('/', c.createReservasi);
router.put('/:id', c.updateReservasi);
router.delete('/:id', c.deleteReservasi);

module.exports = router;
