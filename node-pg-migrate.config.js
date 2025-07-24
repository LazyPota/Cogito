require("dotenv").config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const databaseUrl = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

module.exports = {
    direction: "up",
    migrationsTable: "pgmigrations",
    dir: "migrations",
    databaseUrl,
};
