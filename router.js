const express = require('express');
const router = express.Router();

const db = require('./dbConnection');

const {
    signupValidation,
    loginValidation,
    cekValidasi
} = require('./validation');

const verifikasiToken = require('./authMiddleware');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrasi pengguna baru
router.post(
    '/register',
    signupValidation,
    cekValidasi,
    (req, res) => {

        const { username, email, password } = req.body;

        // Mengubah password menjadi hash
        bcrypt.hash(password, 10, (hashErr, hash) => {

            if (hashErr) {
                console.error(hashErr);

                return res.status(500).json({
                    message: 'Gagal memproses password'
                });
            }

            const sql = `
                INSERT INTO tbuser
                (username, email, password)
                VALUES (?, ?, ?)
            `;

            db.query(
                sql,
                [username, email, hash],
                (err, result) => {

                    if (err) {

                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(409).json({
                                message: 'Username atau email sudah terdaftar'
                            });
                        }

                        console.error(err);

                        return res.status(500).json({
                            message: 'Registrasi gagal'
                        });
                    }

                    return res.status(201).json({
                        message: 'The user successfully registered...',
                        user: {
                            id: result.insertId,
                            username,
                            email
                        }
                    });
                }
            );
        });
    }
);

// Login pengguna
router.post(
    '/login',
    loginValidation,
    cekValidasi,
    (req, res) => {

        const { username, password } = req.body;

        const sql = `
            SELECT id, username, email, password
            FROM tbuser
            WHERE username = ?
            LIMIT 1
        `;

        db.query(sql, [username], (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Terjadi kesalahan server'
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: 'Username atau password salah'
                });
            }

            const user = result[0];

            // Memeriksa password dengan hash
            bcrypt.compare(
                password,
                user.password,
                (bErr, cocok) => {

                    if (bErr) {
                        console.error(bErr);

                        return res.status(500).json({
                            message: 'Gagal memeriksa password'
                        });
                    }

                    if (!cocok) {
                        return res.status(401).json({
                            message: 'Username atau password salah'
                        });
                    }

                    // Membuat JWT
                    const token = jwt.sign(
                        {
                            id: user.id,
                            username: user.username
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '1h',
                            algorithm: 'HS256'
                        }
                    );

                    return res.status(200).json({
                        message: 'You successfully logged in...',
                        token: token,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email
                        }
                    });
                }
            );
        });
    }
);

// Mengambil informasi pengguna yang login
router.get(
    '/get-user',
    verifikasiToken,
    (req, res) => {

        const sql = `
            SELECT id, username, email, created_at
            FROM tbuser
            WHERE id = ?
        `;

        db.query(sql, [req.userId], (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Gagal mengambil informasi pengguna'
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: 'Pengguna tidak ditemukan'
                });
            }

            return res.status(200).json({
                error: false,
                data: result[0],
                message: 'Fetching account is success...'
            });
        });
    }
);

module.exports = router;