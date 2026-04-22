const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, } = require('../models/models')

class UserController {
    async registration(req, res) {
        try {
            const { name, email, password } = req.body;

            //  перевірка пустих полів
            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "name, email і password обов'язкові"
                });
            }

            //  перевірка чи існує user
            const candidate = await User.findOne({
                where: { email }
            });

            if (candidate) {
                return res.status(400).json({
                    message: "Користувач з таким email вже існує"
                });
            }
            const hashPassword = await bcrypt.hash(password, 5)

            const user = await User.create({
                name,
                email,
                password: hashPassword
            });
            const token = jwt.sign({
                id: user.id,
                email
            }, process.env.SECRET_KEY, { expiresIn: '24h' })
            return res.json({
                token
            });

        } catch (e) {
            return res.status(500).json({
                message: "Server error",
                error: e.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // 1. перевірка полів
            if (!email || !password) {
                return res.status(400).json({
                    message: "Email і пароль обов'язкові"
                });
            }

            // 2. знайти користувача
            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                return res.status(404).json({
                    message: "Користувача не знайдено"
                });
            }

            // 3. перевірка пароля
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Невірний пароль"
                });
            }

            // 4. створення JWT
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role
            }, process.env.SECRET_KEY, { expiresIn: '24h' });

            return res.json({
                token
            });

        } catch (e) {
            return res.status(500).json({
                message: "Server error",
                error: e.message
            });
        }
    }
    async check(req, res) {
        try {
            // user вже додається через middleware
            const user = await User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({
                    message: "Користувача не знайдено"
                });
            }

            return res.json({
                id: user.id,
                name: user.name,
                email: user.email
            });

        } catch (e) {
            return res.status(500).json({
                message: "Server error",
                error: e.message
            });
        }
    }
}

module.exports = new UserController()