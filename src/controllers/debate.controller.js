const { getAIResponse } = require("../services/llama.service");
const { translateToIndonesian } = require("../services/translate.service");
const DebateModel = require("../models/debate.model");

const DebateController = {
    // POST /api/v1/debates/sessions
    async createSession(req, res) {
        try {
            const {
                issue_id,
                pro_user_id,
                contra_user_id,
                is_vs_ai,
                session_name,
            } = req.body;

            if (!issue_id || !pro_user_id || !session_name) {
                return res.status(400).json({
                    status: "fail",
                    message:
                        "issue_id, pro_user_id, and session_name are required",
                });
            }

            const userId = pro_user_id || contra_user_id;
            const activeCount = await DebateModel.getActiveSessionCountByUser(
                userId
            );
            const sessionStatus = activeCount >= 20 ? "nonactive" : "active";

            const session = await DebateModel.createSession({
                issue_id,
                pro_user_id,
                contra_user_id,
                is_vs_ai,
                session_name,
                status: sessionStatus,
            });

            return res.status(201).json({
                status: "success",
                message: "Debate session created successfully",
                data: session,
            });
        } catch (error) {
            console.error("Error creating debate session:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // POST /api/v1/debates/messages
    async sendMessage(req, res) {
        try {
            const { sessionId, senderUserId, senderRole, messageOriginal } =
                req.body;

            if (!sessionId || !senderRole || !messageOriginal) {
                return res.status(400).json({
                    status: "fail",
                    message:
                        "sessionId, senderRole, and messageOriginal are required",
                });
            }

            const session = await DebateModel.getSessionById(sessionId);
            if (!session) {
                return res.status(404).json({
                    status: "fail",
                    message: "Debate session not found",
                });
            }

            const lastMessage = await DebateModel.getLastMessage(sessionId);
            if (
                !session.is_vs_ai &&
                lastMessage &&
                lastMessage.sender_user_id === senderUserId
            ) {
                return res.status(403).json({
                    status: "fail",
                    message:
                        "You cannot send two messages in a row. Wait for your opponent to reply.",
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

            if (req.io) {
                req.io
                    .to(sessionId)
                    .emit("receiveMessage", { message: userMessage });
            }

            if (session.is_vs_ai) {
                const aiResult = await getAIResponse(messageOriginal);
                const aiOriginal =
                    aiResult.content || "Sorry, We can't reply at this time..";
                const aiTranslated = await translateToIndonesian(aiOriginal);
                const aiRole = senderRole === "pro" ? "contra" : "pro";

                const aiMessage = await DebateModel.sendMessage({
                    sessionId,
                    senderUserId: null,
                    senderRole: aiRole,
                    messageOriginal: aiOriginal,
                    messageTranslated: aiTranslated,
                });

                if (req.io) {
                    req.io
                        .to(sessionId)
                        .emit("receiveMessage", { message: aiMessage });
                }

                return res.status(201).json({
                    status: "success",
                    message: "AI responded",
                    data: [userMessage, aiMessage],
                });
            }

            return res.status(201).json({
                status: "success",
                message: "Message sent successfully",
                data: userMessage,
            });
        } catch (error) {
            console.error("Error sending message:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // GET /api/v1/debates/sessions/:id
    async getSessionById(req, res) {
        try {
            const { id } = req.params;
            const session = await DebateModel.getSessionById(id);
            if (!session) {
                return res.status(404).json({
                    status: "fail",
                    message: "Debate session not found",
                });
            }
            const messages = await DebateModel.getMessagesBySession(id);
            return res.json({
                status: "success",
                data: { ...session, messages },
            });
        } catch (error) {
            console.error("Error getting session:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // GET /api/v1/debates/sessions/user/:userId
    async getSessionsByUser(req, res) {
        try {
            const { userId } = req.params;
            const sessions = await DebateModel.getSessionsByUser(userId);
            return res.json({
                status: "success",
                data: sessions,
            });
        } catch (error) {
            console.error("Error getting sessions by user:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // GET /api/v1/debates/surrender
    async endTheSession(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const session = await DebateModel.getSessionById(id);
            if (!session) {
                return res.status(404).json({
                    status: "fail",
                    message: "Debate session not found",
                });
            }

            const isParticipant =
                session.pro_user_id === userId ||
                session.contra_user_id === userId;
            if (!isParticipant) {
                return res.status(403).json({
                    status: "fail",
                    message: "You are not a participant in this session.",
                });
            }

            const count = await DebateModel.getUserMessageCount(id, userId);
            if (count < 5) {
                return res.status(403).json({
                    status: "fail",
                    message:
                        "You can only surrender after sending at least 5 messages.",
                });
            }

            await DebateModel.cancelSession(id);

            return res.json({
                status: "success",
                message: "You surrendered the session.",
            });
        } catch (error) {
            console.error("Error ending the session:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },
};

module.exports = DebateController;
