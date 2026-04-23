const { Goal } = require('../models/models');

class GoalController {

    async create(req, res) {
        try {
            const goal = await Goal.create({
                userId: req.user.id,
                ...req.body
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

            return res.json(goals);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async updateProgress(req, res) {
        try {
            const { id } = req.params;

            const goal = await Goal.findOne({
                where: { id, userId: req.user.id }
            });

            if (!goal) {
                return res.status(404).json({ message: "Not found" });
            }

            goal.currentCount += 1;
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