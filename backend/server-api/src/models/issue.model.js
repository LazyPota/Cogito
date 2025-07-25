const pool = require("../db/pool");

const IssueModel = {
    async getAll() {
        const res = await pool.query(
            "SELECT * FROM issues ORDER BY created_at DESC"
        );
        return res.rows;
    },

    async getById(id) {
        const res = await pool.query("SELECT * FROM issues WHERE id = $1", [
            id,
        ]);
        return res.rows[0];
    },
};

module.exports = IssueModel;
