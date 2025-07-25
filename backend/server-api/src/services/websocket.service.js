const { translateToIndonesian, translateToEnglish } = require("./translate.service");
const { getAIResponse } = require("../services/llama.service");
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

        socket.on("sendMessage", async ({ sessionId, senderUserId, senderRole, messageOriginal }) => {
            try {
                const session = await DebateModel.getSessionById(sessionId);
                if (!session) {
                    return socket.emit("error", { message: "Debate session not found" });
                }

                if (session.status === "nonactive") {
                    return socket.emit("error", { message: "Session is not active" });
                }

                const lastMessage = await DebateModel.getLastMessage(sessionId);
                if (
                    !session.is_vs_ai &&
                    lastMessage &&
                    lastMessage.sender_user_id === senderUserId
                ) {
                    return socket.emit("error", {
                        message: "You cannot send two messages in a row. Wait for your opponent.",
                    });
                }

                const messageTranslated = await translateToEnglish(messageOriginal);

                const userMessage = await DebateModel.sendMessage({
                    sessionId,
                    senderUserId,
                    senderRole,
                    messageOriginal,
                    messageTranslated,
                });

                let analysisScore = null;
                try {
                    const flaskRes = await axios.post("http://localhost:5000/assess", {
                        argument: messageOriginal,
                    });
                    const score = flaskRes.data?.scores?.final;
                    analysisScore = Math.max(1, Math.min(100, score));
                    console.log("User Message Analysis Score: ", analysisScore);
                } catch (err) {
                    console.error("Flask analysis error:", err.message);
                }

                io.to(sessionId).emit("receiveMessage", {
                    message: { ...userMessage, analysisScore },
                });

                // Handle AI Response
                if (session.is_vs_ai) {
                    const aiRes = await getAIResponse(messageTranslated).catch((err) => {
                        console.error("❌ AI error:", err.message);
                        return { content: "Maaf, AI tidak bisa membalas saat ini." };
                    });

                    const aiOriginal = aiRes.content || "Maaf, AI tidak bisa membalas saat ini.";
                    const aiTranslated = await translateToIndonesian(aiOriginal);
                    const aiRole = senderRole === "pro" ? "contra" : "pro";

                    const aiMessage = await DebateModel.sendMessage({
                        sessionId,
                        senderUserId: null,
                        senderRole: aiRole,
                        messageOriginal: aiOriginal,
                        messageTranslated: aiTranslated,
                    });

                    let aiAnalysisScore = null;
                    try {
                        const flaskRes = await axios.post("http://localhost:5000/assess", {
                            argument: aiOriginal,
                        });
                        const score = flaskRes.data?.scores?.final;
                        aiAnalysisScore = Math.max(1, Math.min(100, score));
                        console.log("AI Message Analysis Score: ", aiAnalysisScore);
                    } catch (err) {
                        console.error("Flask analysis error (AI):", err.message);
                    }

                    io.to(sessionId).emit("receiveMessage", {
                        message: { ...aiMessage, analysisScore: aiAnalysisScore },
                    });

                    // Update XP kedua user
                    const xpGain = Math.floor(aiAnalysisScore);
                    try {
                        await DebateModel.updateUserXP(session.pro_user_id, xpGain);
                        await DebateModel.updateUserXP(session.contra_user_id, xpGain);
                        console.log("XP updated for both users");
                    } catch (err) {
                        console.error("XP update error:", err.message);
                    }
                } else {
                    // Update XP untuk user biasa (non-AI)
                    const xpGain = Math.floor(analysisScore);
                    try {
                        await DebateModel.updateUserXP(session.pro_user_id, xpGain);
                        await DebateModel.updateUserXP(session.contra_user_id, xpGain);
                        console.log("XP updated for both users");
                    } catch (err) {
                        console.error("XP update error:", err.message);
                    }
                }
            } catch (error) {
                console.error("WebSocket sendMessage error:", error);
                socket.emit("error", { message: "Internal server error" });
            }
        });

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
