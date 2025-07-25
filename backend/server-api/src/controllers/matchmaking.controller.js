const matchmakingService = require("../services/matchmaking.service");

const MatchmakingController = {
    // POST /api/v1/matchmaking/find
    async findMatch(req, res) {
        try {
            const userId = req.user.id;
            const { issue_id } = req.body;

            if (!issue_id) {
                return res.status(400).json({
                    status: "fail",
                    message: "Missing required field: issue_id",
                });
            }

            const result = await matchmakingService.matchUser(userId, issue_id);

            return res.json({
                status: "success",
                data: result,
            });
        } catch (error) {
            console.error("Error finding match:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // DELETE /api/v1/matchmaking/nonactivate
    async nonactivatingMatch(req, res) {
        try {
            const userId = req.user.id;
            const success = await matchmakingService.nonactivatingMatch(userId);

            if (!success) {
                return res.status(404).json({
                    status: "fail",
                    message: "User not in matchmaking queue",
                });
            }

            return res.json({
                status: "success",
                message: "Matchmaking nonactive",
            });
        } catch (error) {
            console.error("Error nonactivating match:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // GET /api/v1/matchmaking/status
    async getStatus(req, res) {
        try {
            const userId = req.user.id;
            const status = await matchmakingService.getStatus(userId);

            return res.json({
                status: "success",
                data: { status },
            });
        } catch (error) {
            console.error("Error getting matchmaking status:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },
};

module.exports = MatchmakingController;
