const pool = require("../db/pool");

const DebateModel = {
    async createSession({
        issue_id,
        pro_user_id,
        contra_user_id,
        is_vs_ai,
        session_name,
        status = "active",
    }) {
        const res = await pool.query(
            `INSERT INTO debate_sessions (issue_id, pro_user_id, contra_user_id, is_vs_ai, session_name, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
            [
                issue_id,
                pro_user_id,
                contra_user_id,
                is_vs_ai,
                session_name,
                status,
            ]
        );
        return res.rows[0];
    },

    async getSessionById(id) {
        const sessionRes = await pool.query(
            `SELECT * FROM debate_sessions WHERE id = $1`,
            [id]
        );
        const session = sessionRes.rows[0];
        if (!session) return null;

        const debatesRes = await pool.query(
            `SELECT * FROM debates
        WHERE session_id = $1
        ORDER BY created_at ASC`,
            [id]
        );

        return {
            ...session,
            debates: debatesRes.rows,
        };
    },

    async getSessionsByUser(userId) {
        const res = await pool.query(
            `SELECT * FROM debate_sessions
            WHERE pro_user_id = $1 OR contra_user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        );
        return res.rows;
    },

    async sendMessage({
        sessionId,
        senderUserId,
        senderRole,
        messageOriginal,
        messageTranslated,
    }) {
        const res = await pool.query(
            `INSERT INTO debates (session_id, sender_user_id, sender_role, message_original, message_translated)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
            [
                sessionId,
                senderUserId,
                senderRole,
                messageOriginal,
                messageTranslated,
            ]
        );
        return res.rows[0];
    },

    async getMessagesBySession(sessionId) {
        const res = await pool.query(
            `SELECT * FROM debates
        WHERE session_id = $1
        ORDER BY created_at ASC`,
            [sessionId]
        );
        return res.rows;
    },

    async getLastMessage(sessionId) {
        const result = await pool.query(
            `SELECT * FROM debate_messages
         WHERE session_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
            [sessionId]
        );
        return result.rows[0] || null;
    },

    async getActiveSessionCountByUser(userId) {
        const result = await pool.query(
            `SELECT COUNT(*) FROM debate_sessions 
         WHERE (pro_user_id = $1 OR contra_user_id = $1)
         AND status = 'active'`,
            [userId]
        );
        return parseInt(result.rows[0].count, 10);
    },

    async getUserMessageCount(sessionId, userId) {
        const result = await pool.query(
            `SELECT COUNT(*) FROM debates 
         WHERE session_id = $1 AND sender_user_id = $2`,
            [sessionId, userId]
        );
        return parseInt(result.rows[0].count, 10);
    },

    async cancelSession(sessionId) {
        await pool.query(
            `UPDATE debate_sessions 
         SET status = 'cancelled', updated_at = current_timestamp 
         WHERE id = $1`,
            [sessionId]
        );
    },
};

module.exports = DebateModel;
