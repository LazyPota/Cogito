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
    console.log(`Server running at http://localhost:${PORT}`);
});
