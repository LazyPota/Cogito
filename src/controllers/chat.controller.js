const {
    createSession,
    getSessionById,
    createMessage,
    getMessagesBySession,
} = require("../models/chat.model");
const { askDeepSeek } = require("../services/deepseek.services");

const startChatSession = async (req, res, next) => {
    try {
        const session = await createSession(req.user.id);
        res.status(201).json({ sessionId: session.id });
    } catch (err) {
        next(err);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const { content } = req.body;
        const session = await getSessionById(sessionId);
        if (!session || session.user_id !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Unauthorized or invalid session" });
        }

        await createMessage({ sessionId, role: "user", content });

        const history = await getMessagesBySession(sessionId);
        const reply = await askDeepSeek(history);

        const savedReply = await createMessage({
            sessionId,
            role: "assistant",
            content: reply.content,
        });

        res.json({ reply: savedReply });
    } catch (err) {
        next(err);
    }
};

const getChatHistory = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const session = await getSessionById(sessionId);
        if (!session || session.user_id !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Unauthorized or invalid session" });
        }

        const history = await getMessagesBySession(sessionId);
        res.json({ messages: history });
    } catch (err) {
        next(err);
    }
};

module.exports = { startChatSession, sendMessage, getChatHistory };
