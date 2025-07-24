// app.js
const express = require("express");
const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const debateRoutes = require("./routes/debate.routes");
const issueRoutes = require("./routes/issue.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/issues", issueRoutes);
app.use("/api/v1/debates", debateRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
