const jwt = require('jsonwebtoken');

module.exports = function (...roles) {
    return function (req, res, next) {

        if (req.method === "OPTIONS") {
            return next();
        }

        try {
            if (!req.headers.authorization) {
                return res.status(401).json({ message: "Не авторизований" });
            }

            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: "Токен відсутній" });
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            // 🔥 FIX: roles замість role
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Немає доступу" });
            }

            req.user = decoded;
            next();

        } catch (e) {
            return res.status(401).json({ message: "Не авторизований" });
        }
    };
};