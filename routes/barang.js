const express = require('express');
const pool = require('../db');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const verifyToken = require('../middlewares/verification');
const uploads = multer({
    dest: 'public/assets/img/', 
    fieldSize: '100000',
    fileFilter: (req, res, cb) => {
        if (file.mimetype == "image/jpg" || file.mimetype == "image/png") {
            cb(null, true);
        } else {
            return cb(new Error('Hanya JPG dan PNG yang bisa diupload!'));
        }
    }
})

//get all barang
router.get('/', verifyToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM barang');

        return res.send(rows);
    } catch (error) {
        return console.log(error.message);
    }
});

//submit tambah barang
router.post('/', verifyToken, async (req, res) => {
    try {
        const { foto_barang, nama_barang, harga_jual, harga_beli, stok } = req.body;

        if (typeof harga_jual !== 'number' || typeof harga_beli !== 'number' || typeof stok !== 'number') {
            return res.send('Harga jual harus angka!');
        }        

        const { rows } = await pool.query('SELECT nama_barang FROM barang WHERE nama_barang = $1', [nama_barang]);
        
        if (rows.length === 0) {
            const newBarang = await pool.query('INSERT INTO barang (nama_barang, foto_barang, harga_jual, harga_beli, stok) VALUES($1, $2, $3, $4, $5) RETURNING *', 
            [nama_barang, foto_barang, harga_jual, harga_beli, stok]);

            return res.send(newBarang.rows[0]);
        } else {
            return res.send('Nama barang sudah ada!');
        }
    } catch (error) {
        console.log(error.message);
    }
});

//submit edit barang
router.put('/:namabarang', verifyToken, async (req, res) => {
    try {
        const { namabarang } = req.params;
        const { foto_barang, nama_barang, harga_jual, harga_beli, stok } = req.body;

        const updateBarang = await pool.query('UPDATE barang SET foto_barang = $1, nama_barang = $2, harga_jual = $3, harga_beli = $4, stok = $5 WHERE nama_barang = $6',
        [foto_barang, nama_barang, harga_jual, harga_beli, stok, namabarang])

        return res.send('Barang telah diupdate!');
    } catch (error) {
        console.log(error.message);
    }
});

//hapus barang
router.delete('/:namabarang', verifyToken, async (req, res) => {
    try {
        const { namabarang } = req.params;

        const { rows: checkBarang } = await pool.query('SELECT nama_barang FROM barang WHERE nama_barang = $1', [namabarang]);

        if (checkBarang.length !== 0) {
            const { rows: deleteBarang } = await pool.query('DELETE FROM barang WHERE nama_barang = $1', [namabarang]);
            return res.send('Barang telah dihapus!');
        } else {
            return res.send('Barang tidak ada!');
        }
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;
