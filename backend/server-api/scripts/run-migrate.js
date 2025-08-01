const dotenv = require("dotenv");

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});
const { spawn } = require("child_process");

process.env.DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const direction = process.argv[2] === "down" ? "down" : "up";

const migrate = spawn(
  "npx",
  [
    "node-pg-migrate",
    direction,
    "--migrations-dir",
    "migrations",
    "--migrations-table",
    "pgmigrations",
    "--verbose",
  ],
  {
    stdio: "inherit",
    shell: true,
    env: process.env,
  }
);

migrate.on("exit", (code) => {
  process.exit(code);
});
