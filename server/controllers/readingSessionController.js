const { ReadingSession, Book } = require('../models/models');

class ReadingSessionController {

    // 🔒 helper
    safeNumber(value) {
        const num = Number(value);
        return isNaN(num) || num < 0 ? 0 : num;
    }

    // ▶ START SESSION
    async startSession(req, res) {
        try {
            const { bookId, startPage } = req.body;

            const safeStart = Math.max(0, Number(startPage));

            // 🔥 закриваємо стару активну сесію
            await ReadingSession.update({
                status: 'finished',
                endTime: new Date()
            }, {
                where: {
                    userId: req.user.id,
                    status: 'active'
                }
            });

            const session = await ReadingSession.create({
                userId: req.user.id,
                bookId,
                startPage: safeStart,
                startTime: new Date(),
                status: 'active'
            });

            await Book.update({ status: "reading" }, { where: { id: bookId } });

            return res.json(session);

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // ⏹ END SESSION
    async endActiveSession(req, res) {
        try {
            const endPage = Math.max(0, Number(req.body.endPage));

            const session = await ReadingSession.findOne({
                where: {
                    userId: req.user.id,
                    status: 'active'
                },
                order: [
                    ['startTime', 'DESC']
                ]
            });

            if (!session) {
                return res.status(404).json({ message: "Active session not found" });
            }

            if (endPage < session.startPage) {
                return res.status(400).json({
                    message: "End page cannot be less than start page"
                });
            }

            const endTime = new Date();

            const durationSeconds = Math.floor(
                (endTime - new Date(session.startTime)) / 1000
            );

            const durationMinutes = Math.floor(durationSeconds / 60);

            await session.update({
                endPage,
                endTime,
                durationMinutes,
                status: 'finished'
            });

            const book = await Book.findByPk(session.bookId);

            if (book.pages && endPage >= book.pages) {
                await book.update({ status: "finished" });
            } else {
                await book.update({ status: "reading" });
            }

            return res.json(session);

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // 📊 GET ALL SESSIONS
    async getMySessions(req, res) {
        try {
            const sessions = await ReadingSession.findAll({
                where: { userId: req.user.id },
                include: [Book]
            });

            return res.json(sessions);

        } catch (e) {
            return res.status(500).json({ message: "Error fetching sessions" });
        }
    }

    // ⭐ NEW: last session for book
    async getLastSessionForBook(req, res) {
        try {
            const session = await ReadingSession.findOne({
                where: {
                    userId: req.user.id,
                    bookId: req.params.bookId
                },
                order: [
                    ['startTime', 'DESC']
                ]
            });

            return res.json(session);

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new ReadingSessionController();