const db = require("../db/pool");

const createSession = async (userId) => {
    const res = await db.query(
        `INSERT INTO chat_sessions (user_id) VALUES ($1) RETURNING *`,
        [userId]
    );
    return res.rows[0];
};

const getSessionById = async (id) => {
    const res = await db.query(`SELECT * FROM chat_sessions WHERE id = $1`, [
        id,
    ]);
    return res.rows[0];
};

const createMessage = async ({ sessionId, role, content }) => {
    const res = await db.query(
        `INSERT INTO chats (session_id, role, content) VALUES ($1, $2, $3) RETURNING *`,
        [sessionId, role, content]
    );
    return res.rows[0];
};

const getMessagesBySession = async (sessionId) => {
    const res = await db.query(
        `SELECT role, content, created_at FROM chats WHERE session_id = $1 ORDER BY created_at ASC`,
        [sessionId]
    );
    return res.rows;
};

module.exports = {
    createSession,
    getSessionById,
    createMessage,
    getMessagesBySession,
};
