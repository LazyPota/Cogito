const express = require("express");
const DebateController = require("../controllers/debate.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/sessions", DebateController.createSession);
router.get("/sessions/:id", DebateController.getSessionById);
router.get("/sessions/user/:userId", DebateController.getSessionsByUser);
router.post("/sessions/:id/surrender", DebateController.endTheSession);
router.post("/messages", DebateController.sendMessage);

module.exports = router;
