const db = require("../db/pool");

const createReply = async (commentId, userId, content) => {
    const result = await db.query(
        "INSERT INTO replies (comment_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
        [commentId, userId, content]
    );
    return result.rows[0];
};

const softDeleteReply = async (replyId, userId) => {
    const result = await db.query(
        "UPDATE replies SET is_deleted = TRUE WHERE id = $1 AND user_id = $2 RETURNING *",
        [replyId, userId]
    );
    return result.rows[0];
};

const getRepliesByCommentId = async (commentId) => {
    const result = await db.query(
        `SELECT r.id, r.content, r.is_deleted, r.created_at, u.username
         FROM replies r
         JOIN users u ON r.user_id = u.id
         WHERE r.comment_id = $1
         ORDER BY r.created_at ASC`,
        [commentId]
    );
    return result.rows.map((reply) => ({
        ...reply,
        content: reply.is_deleted ? "**balasan telah dihapus**" : reply.content,
    }));
};

module.exports = { createReply, softDeleteReply, getRepliesByCommentId };
