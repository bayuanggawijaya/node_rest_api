require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Router
const authRouter = require('./router');
const itemTypeRouter = require('./index');

const app = express();
const port = process.env.PORT || 3000;


// Pastikan JWT Secret tersedia
if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET.length < 32
) {
    throw new Error(
        'JWT_SECRET harus diisi dengan secret acak yang kuat'
    );
}

// Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(cors());

// Authentication Routes
app.use('/api', authRouter);

// CRUD Routes
app.use('/', itemTypeRouter);

// Endpoint tidak ditemukan
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint tidak ditemukan'
    });
});

// Error Handling
app.use((err, req, res, next) => {

    console.error(err);

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'Data sudah terdaftar'
        });
    }

    const status = err.status || err.statusCode || 500;

    res.status(status).json({
        message: status === 500
            ? 'Internal Server Error'
            : err.message
    });
});

// Menjalankan Server
app.listen(port, () => {
    console.log(`Server Berjalan pada port ${port}`);
});




