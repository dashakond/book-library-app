const { ReadingSession, Book } = require('../models/models');

class ReadingSessionController {

    // ▶ START SESSION
    async startSession(req, res) {
        try {
            const { bookId, startPage } = req.body;

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
                startPage,
                startTime: new Date(),
                status: 'active'
            });

            // 🔥 NEW: book becomes "reading"
            await Book.update({ status: "reading" }, { where: { id: bookId } });

            return res.json(session);

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // ⏹ END SESSION
    async endActiveSession(req, res) {
        try {
            const { endPage } = req.body;

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

            // 📌 CASE 1: finished reading
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

    // 📊 GET MY SESSIONS
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
}

module.exports = new ReadingSessionController();