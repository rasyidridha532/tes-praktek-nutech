const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');

//get page login
router.get('/', async (req, res) => {
    res.render('login');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const { rows: checkUser } = await pool.query('SELECT username, password FROM users WHERE username = $1', [username]);

    if (checkUser.length !== 0) {
        return res.send('Username sudah ada!');
    } else {
        const { rows: insertQuery } = await pool.query('INSERT INTO users(username,password) VALUES($1, $2) RETURNING *', [username, password]);

        return res.send('Register Berhasil!').status(201);
    }    
})

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    const { rows } = await pool.query('SELECT username, password FROM users WHERE username = $1', [username]);

    if (rows[0].username !== username || rows[0].password !== password) {
        return res.send('Username atau password salah!');
    }

    const token = jwt.sign({username: rows[0].username}, process.env.JWS_ACCESS_KEY, { expiresIn: '900s' }, (err, token) => {
        res.json({
            auth: true,
            token: token
        })
    });
});

module.exports = router;
