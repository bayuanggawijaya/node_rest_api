const jwt = require('jsonwebtoken');

function verifikasiToken(req, res, next) {

    const authorization = req.headers.authorization || '';

    const bagian = authorization.trim().split(/\s+/);

    if (
        bagian.length !== 2 ||
        bagian[0] !== 'Bearer' ||
        !bagian[1]
    ) {
        return res.status(401).json({
            message: 'Token tidak tersedia'
        });
    }

    try {
        const decoded = jwt.verify(
            bagian[1],
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );

        req.userId = decoded.id;

        next();

    } catch (err) {
        return res.status(401).json({
            message: 'Token tidak valid atau kedaluwarsa'
        });
    }
}

module.exports = verifikasiToken;