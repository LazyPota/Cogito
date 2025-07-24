const { translateToIndonesian } = require("../services/translate.service");
const DebateModel = require("../models/debate.model");
const axios = require("axios");

const sessions = {}; 

function setupWebSocket(io) {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("joinRoom", (sessionId) => {
            socket.join(sessionId);
            console.log(`User ${socket.id} joined session ${sessionId}`);

            if (!sessions[sessionId]) sessions[sessionId] = [];
            if (!sessions[sessionId].includes(socket.id)) {
                sessions[sessionId].push(socket.id);
            }
        });

        socket.on(
            "sendMessage",
            async ({
                sessionId,
                senderUserId,
                senderRole,
                messageOriginal,
            }) => {
                try {
                    const session = await DebateModel.getSessionById(sessionId);
                    if (!session) {
                        return socket.emit("error", {
                            message: "Debate session not found",
                        });
                    }

                    const messageTranslated = await translateToIndonesian(
                        messageOriginal
                    );

                    const userMessage = await DebateModel.sendMessage({
                        sessionId,
                        senderUserId,
                        senderRole,
                        messageOriginal,
                        messageTranslated,
                    });

                    io.to(sessionId).emit("receiveMessage", {
                        message: userMessage,
                    });

                    if (session.is_vs_ai) {
                        const aiRes = await axios.post(
                            "http://localhost:5000/chat",
                            {
                                message: messageOriginal,
                            }
                        );

                        const aiOriginal =
                            aiRes.data.message ||
                            "Maaf, saya tidak bisa membalas saat ini.";
                        const aiTranslated = await translateToIndonesian(
                            aiOriginal
                        );
                        const aiRole = senderRole === "pro" ? "contra" : "pro";

                        const aiMessage = await DebateModel.sendMessage({
                            sessionId,
                            senderUserId: null,
                            senderRole: aiRole,
                            messageOriginal: aiOriginal,
                            messageTranslated: aiTranslated,
                        });

                        io.to(sessionId).emit("receiveMessage", {
                            message: aiMessage,
                        });
                    }
                } catch (error) {
                    console.error("WebSocket sendMessage error:", error);
                    socket.emit("error", { message: "Internal server error" });
                }
            }
        );

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            Object.entries(sessions).forEach(([sessionId, socketIds]) => {
                const index = socketIds.indexOf(socket.id);
                if (index !== -1) socketIds.splice(index, 1);
                if (socketIds.length === 0) delete sessions[sessionId];
            });
        });
    });
}

module.exports = setupWebSocket;
