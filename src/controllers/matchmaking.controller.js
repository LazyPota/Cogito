const matchmakingService = require("../services/matchmaking.service");

const MatchmakingController = {
    // POST /api/v1/matchmaking/find
    async findMatch(req, res) {
        try {
            const userId = req.user.id;
            const result = await matchmakingService.matchUser(userId);

            return res.status(200).json({
                status: "success",
                data: result,
            });
        } catch (error) {
            console.error("Error in findMatch:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // DELETE /api/v1/matchmaking/cancel
    async cancelMatch(req, res) {
        try {
            const userId = req.user.id;
            const success = await matchmakingService.cancelMatch(userId);

            if (!success) {
                return res.status(404).json({
                    status: "fail",
                    message: "User not in matchmaking queue",
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Matchmaking cancelled",
            });
        } catch (error) {
            console.error("Error in cancelMatch:", error);
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

            return res.status(200).json({
                status: "success",
                data: { status },
            });
        } catch (error) {
            console.error("Error in getStatus:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },
};

module.exports = MatchmakingController;
