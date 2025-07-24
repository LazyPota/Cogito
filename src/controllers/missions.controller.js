const {
    getAllMissions,
    getUserMissions,
    updateUserMissionProgress,
    getPointHistories,
    assignMissionsToUser,
} = require("../models/missions.model");

const getMissions = async (req, res) => {
    const missions = await getAllMissions();
    res.json(missions);
};

const getUserMissionList = async (req, res) => {
    const userId = req.user.id;
    const missions = await getUserMissions(userId);
    res.json(missions);
};

const getUserPointHistories = async (req, res) => {
    const userId = req.user.id;
    const histories = await getPointHistories(userId);
    res.json(histories);
};

const completeMissionAction = async (req, res) => {
    const userId = req.user.id;
    const { missionId } = req.body;
    await updateUserMissionProgress(userId, missionId);
    res.json({ success: true });
};

const assignAllMissions = async (req, res) => {
    const userId = req.user.id;
    await assignMissionsToUser(userId);
    res.json({ success: true });
};

module.exports = {
    getMissions,
    getUserMissionList,
    completeMissionAction,
    getUserPointHistories,
    assignAllMissions,
};
