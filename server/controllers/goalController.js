const { Goal } = require('../models/models');

class GoalController {

    async create(req, res) {
        try {
            let { type, targetCount } = req.body;

            if (!targetCount || targetCount <= 0) {
                return res.status(400).json({
                    message: "Target must be greater than 0"
                });
            }

            // 🔥 1. перевірка: чи вже є ціль цього типу
            const existingGoal = await Goal.findOne({
                where: {
                    userId: req.user.id,
                    type
                }
            });

            if (existingGoal) {
                return res.status(400).json({
                    message: `You already have a ${type} goal`
                });
            }

            // 📅 дата старту
            const startDate = new Date();
            let endDate = new Date();

            if (type === "week") {
                endDate.setDate(startDate.getDate() + 7);
            }

            if (type === "month") {
                endDate.setMonth(startDate.getMonth() + 1);
            }

            if (type === "year") {
                endDate.setFullYear(startDate.getFullYear() + 1);
            }

            const goal = await Goal.create({
                userId: req.user.id,
                type,
                targetCount,
                currentCount: 0,
                startDate,
                endDate,
                completedBooks: []
            });

            return res.json(goal);

        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async getMy(req, res) {
        try {
            const goals = await Goal.findAll({
                where: { userId: req.user.id }
            });
            const now = new Date();

            for (let goal of goals) {
                if (new Date(goal.endDate) < now) {
                    goal.currentCount = 0;
                    goal.completedBooks = [];
                    await goal.save();
                }
            }
            return res.json(goals);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async updateProgress(req, res) {
        try {
            const { id } = req.params;
            const { bookId } = req.body;

            const goal = await Goal.findOne({
                where: { id, userId: req.user.id }
            });

            if (!goal) {
                return res.status(404).json({ message: "Not found" });
            }

            if (goal.completedBooks.includes(bookId)) {
                return res.json(goal);
            }

            goal.completedBooks = [...goal.completedBooks, bookId];

            goal.currentCount = Math.min(
                goal.currentCount + 1,
                goal.targetCount
            );

            await goal.save();
            await goal.save();

            return res.json(goal);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async remove(req, res) {
        try {
            const { id } = req.params;

            const goal = await Goal.findOne({
                where: { id, userId: req.user.id }
            });

            if (!goal) {
                return res.status(404).json({ message: "Not found" });
            }

            await goal.destroy();

            return res.json({ message: "Deleted" });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }



}

module.exports = new GoalController();