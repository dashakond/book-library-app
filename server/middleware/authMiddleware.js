const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    try {
        // 📌 беремо токен із headers
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Користувач не авторизований"
            });
        }

        // 📌 формат: "Bearer TOKEN"
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "Токен відсутній"
            });
        }

        // 📌 перевірка токена
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // 📌 кладемо user в req
        req.user = decoded;

        next();

    } catch (e) {
        return res.status(401).json({
            message: "Не авторизований"
        });
    }
};