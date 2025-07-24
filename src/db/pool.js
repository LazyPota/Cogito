const { Pool } = require("pg");
<<<<<<< HEAD
require("dotenv").config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const pool = new Pool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
=======
const dotenv = require("dotenv");

dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
>>>>>>> 45791c0 (first-commit)
});

module.exports = pool;
