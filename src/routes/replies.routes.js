const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { postReply, deleteReply } = require("../controllers/replies.controller");

const router = express.Router({ mergeParams: true });

router.post("/:commentId/replies", authMiddleware, postReply);
router.delete("/:commentId/replies/:replyId", authMiddleware, deleteReply);

module.exports = router;
