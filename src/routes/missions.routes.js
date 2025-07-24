const express = require("express");
const {
    getMissions,
    getUserMissionList,
    completeMissionAction,
    getUserPointHistories,
    assignAllMissions,
} = require("../controllers/missions.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getMissions);
router.get("/user", authMiddleware, getUserMissionList);
router.get("/history", authMiddleware, getUserPointHistories);
router.post("/complete", authMiddleware, completeMissionAction);
router.post("/assign", authMiddleware, assignAllMissions);

module.exports = router;
