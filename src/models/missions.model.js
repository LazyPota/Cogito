const db = require("../db/pool");

const getAllMissions = async () => {
    const [rows] = await db.query("SELECT * FROM missions");
    return rows;
};

const getUserMissions = async (userId) => {
    const [rows] = await db.query(
        "SELECT um.*, m.title, m.description, m.type, m.action, m.target, m.point FROM user_missions um JOIN missions m ON um.mission_id = m.id WHERE um.user_id = ?",
        [userId]
    );
    return rows;
};

const updateUserMissionProgress = async (userId, missionId) => {
    const [rows] = await db.query(
        "SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ?",
        [userId, missionId]
    );
    const mission = rows[0];
    if (!mission || mission.completed) return;

    mission.progress += 1;
    if (mission.progress >= mission.target) {
        mission.completed = true;

        await db.query("UPDATE users SET point = point + ? WHERE id = ?", [
            mission.point,
            userId,
        ]);

        await db.query(
            "INSERT INTO point_histories (user_id, mission_id, points) VALUES (?, ?, ?)",
            [userId, missionId, mission.point]
        );
    }

    await db.query(
        "UPDATE user_missions SET progress = ?, completed = ? WHERE id = ?",
        [mission.progress, mission.completed, mission.id]
    );
};

const resetDailyMissions = async () => {
    await db.query(
        "DELETE FROM user_missions WHERE mission_id IN (SELECT id FROM missions WHERE type = 'daily')"
    );
};

const resetWeeklyMissions = async () => {
    await db.query(
        "DELETE FROM user_missions WHERE mission_id IN (SELECT id FROM missions WHERE type = 'weekly')"
    );
};

const assignMissionsToUser = async (userId) => {
    const [missions] = await db.query("SELECT * FROM missions");
    for (const mission of missions) {
        await db.query(
            "INSERT INTO user_missions (user_id, mission_id) VALUES (?, ?)",
            [userId, mission.id]
        );
    }
};

const getPointHistories = async (userId) => {
    const [rows] = await db.query(
        "SELECT * FROM point_histories WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
    );
    return rows;
};

module.exports = {
    getAllMissions,
    getUserMissions,
    updateUserMissionProgress,
    resetDailyMissions,
    resetWeeklyMissions,
    assignMissionsToUser,
    getPointHistories,
};
