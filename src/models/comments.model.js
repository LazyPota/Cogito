const pool = require("../db/pool");

const createComment = async ({ postId, userId, content }) => {
    // Query ini sudah diperbaiki untuk memastikan tidak ada koma yang salah tempat.
    const query = `
        INSERT INTO post_comments (post_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [postId, userId, content];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const deleteComment = async (commentId) => {
    // Fungsi ini mungkin ada di file Anda, diasumsikan sudah benar.
    const query = `
        UPDATE post_comments
        SET is_deleted = true
        WHERE id = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [commentId]);
    return rows[0];
};

// Pastikan untuk mengekspor fungsi yang Anda gunakan.
module.exports = {
    createComment,
    deleteComment,
};
