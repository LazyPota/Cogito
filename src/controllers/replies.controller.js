const { createReply, softDeleteReply } = require("../models/replies.model");

const postReply = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const reply = await createReply(commentId, userId, content);
        res.status(201).json({ message: "Reply created", reply });
    } catch (err) {
        next(err);
    }
};

const deleteReply = async (req, res, next) => {
    try {
        const { replyId } = req.params;
        const userId = req.user.id;

        const deleted = await softDeleteReply(replyId, userId);
        if (!deleted) {
            return res
                .status(404)
                .json({ message: "Reply not found or not authorized" });
        }

        res.json({ message: "Reply deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = { postReply, deleteReply };
