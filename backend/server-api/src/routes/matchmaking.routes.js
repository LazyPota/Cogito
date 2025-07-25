const express = require("express");
const router = express.Router();
const MatchmakingController = require("../controllers/matchmaking.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/find", MatchmakingController.findMatch);
router.delete("/nonactive", MatchmakingController.nonactivatingMatch);
router.get("/status", MatchmakingController.getStatus);

module.exports = router;
