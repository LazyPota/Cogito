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
        const sessionResult = await pool.query(
            `SELECT * FROM debate_sessions WHERE id = $1`,
            [id]
        );
        const session = sessionResult.rows[0];
        if (!session) return null;

        const debatesResult = await pool.query(
            `SELECT * FROM debates
       WHERE session_id = $1
       ORDER BY created_at ASC`,
            [id]
        );

        return {
            ...session,
            debates: debatesResult.rows,
        };
    },

    async getSessionsByUser(userId) {
        const result = await pool.query(
            `SELECT * FROM debate_sessions
       WHERE pro_user_id = $1 OR contra_user_id = $1
       ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    async sendMessage({
        sessionId,
        senderUserId,
        senderRole,
        messageOriginal,
        messageTranslated,
    }) {
        const result = await pool.query(
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
        return result.rows[0];
    },

    async getMessagesBySession(sessionId) {
        const result = await pool.query(
            `SELECT * FROM debates
       WHERE session_id = $1
       ORDER BY created_at ASC`,
            [sessionId]
        );
        return result.rows;
    },

    async getLastMessage(sessionId) {
        const result = await pool.query(
            `SELECT * FROM debates
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

    async updateUserXP(userId, xpGain) {
        try {
            console.log(
                `Attempting to update XP for user ${userId} by ${xpGain}`
            );

            const result = await pool.query(
                `UPDATE users SET xp = xp + $1 WHERE id = $2 RETURNING xp`,
                [xpGain, userId]
            );

            if (result.rows.length > 0) {
                console.log(
                    `Updated XP for user ${userId}: ${result.rows[0].xp}`
                );
                return result.rows[0].xp;
            } else {
                console.error(`No rows updated for user ${userId}`);
                return null;
            }
        } catch (err) {
            console.error("Error updating XP:", err.message);
            throw err;
        }
    },
    async nonactiveSession(sessionId) {
        await pool.query(
            `UPDATE debate_sessions
       SET status = 'nonactive', updated_at = current_timestamp
       WHERE id = $1`,
            [sessionId]
        );
    },
};

module.exports = DebateModel;
