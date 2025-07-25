const DebateModel = require("../models/debate.model");

const waitingQueue = [];

async function matchUser(userId, issueId) {
    const existing = waitingQueue.find((entry) => entry.userId === userId);
    if (existing) {
        return { status: "waiting", role: existing.role };
    }

    const opponentIndex = waitingQueue.findIndex(
        (entry) => entry.issueId === issueId
    );
    if (opponentIndex === -1) {
        const role = Math.random() < 0.5 ? "pro" : "contra";
        waitingQueue.push({ userId, role, issueId });
        return { status: "waiting", role };
    }

    const opponent = waitingQueue.splice(opponentIndex, 1)[0]; 
    const proUserId = opponent.role === "pro" ? opponent.userId : userId;
    const contraUserId = opponent.role === "pro" ? userId : opponent.userId;

    const session = await DebateModel.createSession({
        issue_id: issueId,
        pro_user_id: proUserId,
        contra_user_id: contraUserId,
        is_vs_ai: false,
        session_name: `Debate ${Date.now()}`,
    });

    return { status: "matched", sessionId: session.id };
}

function nonactivatingMatch(userId) {
    const index = waitingQueue.findIndex((entry) => entry.userId === userId);
    if (index !== -1) {
        waitingQueue.splice(index, 1);
        return true;
    }
    return false;
}

function getStatus(userId) {
    const inQueue = waitingQueue.find((entry) => entry.userId === userId);
    return inQueue ? "waiting" : "not_in_queue";
}

module.exports = {
    matchUser,
    nonactivatingMatch,
    getStatus,
};
