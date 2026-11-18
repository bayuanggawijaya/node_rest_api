const { body, validationResult } = require('express-validator');

// Validasi registrasi
const signupValidation = [

    body('username')
        .isString()
        .withMessage('Username harus berupa teks')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username harus 3-50 karakter'),

    body('email')
        .isEmail()
        .withMessage('Format email tidak valid')
        .normalizeEmail(),

    body('password')
        .isString()
        .withMessage('Password harus berupa teks')
        .isLength({ min: 6 })
        .withMessage('Password minimal 6 karakter')
];

// Validasi login
const loginValidation = [

    body('username')
        .isString()
        .withMessage('Username harus berupa teks')
        .trim()
        .notEmpty()
        .withMessage('Username wajib diisi'),

    body('password')
        .isString()
        .withMessage('Password harus berupa teks')
        .notEmpty()
        .withMessage('Password wajib diisi')
];

// Memeriksa hasil validasi
const cekValidasi = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validasi gagal',
            errors: errors.array()
        });
    }

    next();
};

module.exports = {
    signupValidation,
    loginValidation,
    cekValidasi
};


