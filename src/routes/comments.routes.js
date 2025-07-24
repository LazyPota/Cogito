const express = require("express");
const { addComment, deleteComment, addReply, deleteReply } = require("../controllers/comments.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router({ mergeParams: true });

router.post("/:postId/comments", authMiddleware, addComment);
router.delete("/:postId/comments/:commentId", authMiddleware, deleteComment);
router.post("/:postId/comments/:commentId/replies", authMiddleware, addReply);
router.delete("/:postId/comments/:commentId/replies/:replyId", authMiddleware, deleteReply);

module.exports = router;
