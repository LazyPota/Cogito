const { getAIResponse } = require("../services/llama.service");
const {
    translateToIndonesian,
    translateToEnglish,
} = require("../services/translate.service");
const DebateModel = require("../models/debate.model");
const IssueModel = require("../models/issue.model");
const axios = require("axios");

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

            const issue = await IssueModel.getById(issue_id);
            if (!issue) {
                return res.status(404).json({
                    status: "fail",
                    message: "Issue not found",
                });
            }

            if (is_vs_ai) {
                const senderRole = contra_user_id ? "contra" : "pro";
                const senderUserId =
                    senderRole === "pro" ? pro_user_id : contra_user_id;
                const userMessageOriginal =
                    senderRole === "pro"
                        ? issue.pro_first_message
                        : issue.contra_first_message;

                if (userMessageOriginal) {
                    const userMessageTranslated = await translateToEnglish(
                        userMessageOriginal
                    );

                    const userMessage = await DebateModel.sendMessage({
                        sessionId: session.id,
                        senderUserId,
                        senderRole,
                        messageOriginal: userMessageOriginal,
                        messageTranslated: userMessageTranslated,
                    });

                    try {
                        // Mendapatkan balasan dari AI
                        const aiRawResponse = await getAIResponse(
                            userMessageTranslated
                        ).catch((err) => {
                            console.error(
                                "❌ Error in AI first reply:",
                                err.message
                            );
                            return {
                                content:
                                    "Maaf, saya tidak dapat membalas saat ini.",
                            }; // Fallback
                        });

                        const aiOriginal =
                            aiRawResponse.content ||
                            "Maaf, saya tidak dapat membalas saat ini.";
                        const aiTranslated = await translateToIndonesian(
                            aiOriginal
                        );

                        const aiRole = senderRole === "pro" ? "contra" : "pro";

                        await DebateModel.sendMessage({
                            sessionId: session.id,
                            senderUserId: null, // AI tidak memiliki user ID
                            senderRole: aiRole,
                            messageOriginal: aiOriginal,
                            messageTranslated: aiTranslated,
                        });
                    } catch (err) {
                        console.error("❌ Error in AI response:", err.message);
                    }
                }
            } else if (contra_user_id) {
                const messageOriginal = issue.contra_first_message;
                if (messageOriginal) {
                    const messageTranslated = await translateToEnglish(
                        messageOriginal
                    );
                    await DebateModel.sendMessage({
                        sessionId: session.id,
                        senderUserId: contra_user_id,
                        senderRole: "contra",
                        messageOriginal,
                        messageTranslated,
                    });
                }
            }

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

            // Validasi parameter wajib
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

            if (session.status === "nonactive") {
                return res.status(403).json({
                    status: "fail",
                    message: "You cannot send messages in a nonactive session.",
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
                const flaskRes = await axios.post(
                    "http://localhost:5000/assess",
                    {
                        argument: messageOriginal,
                    }
                );
                const score = flaskRes.data?.scores?.final;
                analysisScore = Math.max(1, Math.min(100, score));
                console.log("User Message Analysis Score: ", analysisScore);
            } catch (err) {
                console.error("Flask analysis error:", err.message);
            }

            if (req.io) {
                req.io
                    .to(sessionId)
                    .emit("receiveMessage", { message: userMessage });
            }

            if (session.is_vs_ai) {
                const aiInput = await translateToEnglish(messageOriginal);
                const aiRes = await getAIResponse(aiInput).catch((err) => {
                    console.error("❌ Error in AI response:", err.message);
                    return { content: "Sorry, We can't reply at this time.." }; // Fallback
                });

                const aiOriginal =
                    aiRes.content || "Sorry, We can't reply at this time..";
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
                    const flaskRes = await axios.post(
                        "http://localhost:5000/assess",
                        {
                            argument: aiOriginal,
                        }
                    );
                    const score = flaskRes.data?.scores?.final;
                    aiAnalysisScore = Math.max(1, Math.min(100, score));
                    console.log(
                        "AI Response Analysis Score: ",
                        aiAnalysisScore
                    );
                } catch (err) {
                    console.error("Flask analysis error (AI):", err.message);
                }

                if (req.io) {
                    req.io
                        .to(sessionId)
                        .emit("receiveMessage", { message: aiMessage });
                }

                const xpGain = Math.floor(aiAnalysisScore);

                try {
                    console.log(
                        "Updating user XP for both pro and contra users..."
                    );
                    await DebateModel.updateUserXP(session.pro_user_id, xpGain);
                    await DebateModel.updateUserXP(
                        session.contra_user_id,
                        xpGain
                    );
                    console.log("XP update attempted.");
                } catch (err) {
                    console.error("Error updating user XP:", err.message);
                }

                return res.status(201).json({
                    status: "success",
                    message: "AI responded",
                    data: [
                        { ...userMessage, analysisScore },
                        { ...aiMessage, analysisScore: aiAnalysisScore },
                    ],
                });
            }

            const xpGain = Math.floor(analysisScore);

            try {
                console.log(
                    "Updating user XP for both pro and contra users..."
                );
                await DebateModel.updateUserXP(session.pro_user_id, xpGain);
                await DebateModel.updateUserXP(session.contra_user_id, xpGain);
                console.log("XP update attempted.");
            } catch (err) {
                console.error("Error updating user XP:", err.message);
            }

            return res.status(201).json({
                status: "success",
                message: "Message sent successfully",
                data: { ...userMessage, analysisScore },
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
            return res.json({
                status: "success",
                data: { ...session },
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

    // POST /api/v1/debates/sessions/:id/surrender/
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

            await DebateModel.nonactiveSession(id);

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
