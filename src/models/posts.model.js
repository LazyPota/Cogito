const pool = require("../db/pool");

// --- PERUBAHAN 1: Pastikan fungsi ini menerima 'content', bukan 'caption' ---
const createPost = async ({ userId, content }) => {
    const query = `
        INSERT INTO posts (user_id, content)
        VALUES ($1, $2)
        RETURNING *;
    `;
    // --- PERUBAHAN 2: Pastikan 'content' yang digunakan di sini ---
    const values = [userId, content];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const addAttachment = async ({ postId, url }) => {
    const query = `
        INSERT INTO post_attachments (post_id, url)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [postId, url];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getPosts = async () => {
    const query = `
        SELECT 
            p.id, p.content, p.created_at,
            u.id as user_id, u.username,
            (SELECT json_agg(json_build_object('id', pa.id, 'url', pa.url)) FROM post_attachments pa WHERE pa.post_id = p.id) as attachments,
            (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) as like_count,
            (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = p.id) as comment_count
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
};

const getPostWithComments = async (postId) => {
    // Fungsi ini diasumsikan sudah benar dan tidak perlu diubah untuk masalah ini
    const query = `SELECT * FROM posts WHERE id = $1;`; // Contoh query sederhana
    const { rows } = await pool.query(query, [postId]);
    return rows[0];
};


module.exports = {
    createPost,
    addAttachment,
    getPosts,
    getPostWithComments,
};
