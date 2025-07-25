const IssueModel = require("../models/issue.model");

const IssueController = {
    // GET /api/v1/issues
    async getAll(req, res) {
        try {
            const issues = await IssueModel.getAll();
            return res.json({
                status: "success",
                data: issues,
            });
        } catch (error) {
            console.error("Error fetching issues:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // GET /api/v1/issues/:id
    async getById(req, res) {
        try {
            const { id } = req.params;
            const issue = await IssueModel.getById(id);

            if (!issue) {
                return res.status(404).json({
                    status: "fail",
                    message: "Issue not found",
                });
            }

            return res.json({
                status: "success",
                data: issue,
            });
        } catch (error) {
            console.error("Error fetching issue by id:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },
};

module.exports = IssueController;
