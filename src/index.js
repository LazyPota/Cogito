<<<<<<< HEAD
require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const path = require("path");

const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const postsRoutes = require("./routes/posts.routes");
const commentsRoutes = require("./routes/comments.routes");
const repliesRoutes = require("./routes/replies.routes");
const chatRoutes = require("./routes/chat.routes");
const missionRoutes = require("./routes/missions.routes");

const {
    resetDailyMissions,
    resetWeeklyMissions,
} = require("./models/missions.model");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/posts", postsRoutes);
app.use("/api/v1/posts", commentsRoutes);
app.use("/api/v1/posts", repliesRoutes);
app.use("/api/v1/cha                    t", chatRoutes);
app.use("/api/v1/missions", missionRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

cron.schedule("0 0 * * *", () => {
    resetDailyMissions();
});

cron.schedule("0 0 * * 1", () => {
    resetWeeklyMissions();
});

app.listen(PORT, () => {
=======
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const app = require("./app");
const setupWebSocket = require("./services/websocket.service");

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

setupWebSocket(io);

server.listen(PORT, () => {
>>>>>>> 45791c0 (first-commit)
    console.log(`Server running at http://localhost:${PORT}`);
});
