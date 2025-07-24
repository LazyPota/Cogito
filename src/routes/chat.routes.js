const express = require("express");
const router = express.Router();
const {
    startChatSession,
    sendMessage,
    getChatHistory,
} = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/sessions", authMiddleware, startChatSession);
router.post("/sessions/:sessionId/messages", authMiddleware, sendMessage);
router.get("/sessions/:sessionId/messages", authMiddleware, getChatHistory);

module.exports = router;
