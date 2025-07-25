const pool = require("../db/pool");

const UserModel = {
    async getAll() {
        const result = await pool.query("SELECT * FROM users");
        return result.rows;
    },

    async findByUsername(username) {
        const res = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        return res.rows[0];
    },

    async create({ username, password }) {
        const res = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, password]
        );
        return res.rows[0];
    },
};

module.exports = UserModel;
