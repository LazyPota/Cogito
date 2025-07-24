const pool = require("../db/pool");

<<<<<<< HEAD
const getAllUsers = async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
};

const findUserByUsername = async (username) => {
    const res = await pool.query("SELECT * FROM users WHERE username = $1", [
        username,
    ]);
    return res.rows[0];
};
const createUser = async ({ username, email, password }) => {
    const res = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, password]
    );
    return res.rows[0];
};

module.exports = {
    getAllUsers,
    findUserByUsername,
    createUser,
};
=======
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

    async create({ username, email, password }) {
        const res = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, password]
        );
        return res.rows[0];
    },
};

module.exports = UserModel;
>>>>>>> 45791c0 (first-commit)
