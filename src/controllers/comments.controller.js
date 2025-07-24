const {
    createComment,
    deleteCommentById,
    createReply,
    deleteReplyById,
} = require("../models/comments.model");

const addComment = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        const comment = await createComment({ postId, userId, content });
        res.status(201).json({ message: "Comment added", comment });
    } catch (err) {
        next(err);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        await deleteCommentById(commentId, userId);
        res.json({ message: "Comment deleted" });
    } catch (err) {
        next(err);
    }
};

const addReply = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        const reply = await createReply({ commentId, userId, content });
        res.status(201).json({ message: "Reply added", reply });
    } catch (err) {
        next(err);
    }
};

const deleteReply = async (req, res, next) => {
    try {
        const { replyId } = req.params;
        const userId = req.user.id;
        await deleteReplyById(replyId, userId);
        res.json({ message: "Reply deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = { addComment, deleteComment, addReply, deleteReply };
