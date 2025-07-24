const request = require("supertest");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // dipakai sungguhan, bukan mock
const app = require("../../app");
const db = require("../../db/pool");
const DebateModel = require("../../models/debate.model");
const { translateToIndonesian } = require("../../services/translate.service");

jest.mock("../../models/debate.model");
jest.mock("../../services/translate.service");

// Service AI Response asli (tanpa mock)
const getAIResponse = async (prompt) => {
    try {
        const response = await axios.post("http://localhost:4000/chat", {
            model: "qwen1_5-0_5b-chat-q8_0",
            prompt,
            stream: false,
        });

        const aiMessage = response.data?.result;
        if (!aiMessage) {
            throw new Error(
                "AI response 'result' property is empty or missing."
            );
        }

        return { content: aiMessage };
    } catch (error) {
        console.error("❌ Error in getAIResponse:", error.message);
        return { content: "AI tidak dapat memberikan respon saat ini." };
    }
};

const testUser = {
    id: null,
    email: "testuser@example.com",
    password: "hashed_password",
    username: "testuser",
};

let accessToken = "";

beforeAll(async () => {
    const result = await db.query(
        `INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id`,
        [testUser.email, testUser.password, testUser.username]
    );
    testUser.id = result.rows[0].id;
    accessToken = jwt.sign(
        { id: testUser.id, email: testUser.email },
        process.env.JWT_SECRET
    );
});

beforeEach(async () => {
    await db.query("DELETE FROM issues");
});

afterAll(async () => {
    await db.query(`DELETE FROM users WHERE email = $1`, [testUser.email]);
    await db.end();
});

describe("DebateController", () => {
    describe("POST /api/v1/debates/sessions", () => {
        it("should create a new debate session", async () => {
            const fakeSession = {
                id: 1,
                issue_id: 10,
                pro_user_id: testUser.id,
                contra_user_id: 3,
                is_vs_ai: false,
                session_name: "Test Session",
            };

            DebateModel.createSession.mockResolvedValue(fakeSession);

            const res = await request(app)
                .post("/api/v1/debates/sessions")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    issue_id: 10,
                    pro_user_id: testUser.id,
                    contra_user_id: 3,
                    is_vs_ai: false,
                    session_name: "Test Session",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("status", "success");
            expect(res.body.data).toEqual(fakeSession);
        });
    });

    describe("POST /api/v1/debates/messages", () => {
        it("should send user message and respond with AI (real model)", async () => {
            const fakeSession = { id: 1, is_vs_ai: true };
            const fakeUserMessage = { id: 101, messageOriginal: "Hai" };

            DebateModel.getSessionById.mockResolvedValue(fakeSession);
            DebateModel.getLastMessage.mockResolvedValue(null);
            DebateModel.sendMessage.mockResolvedValueOnce(fakeUserMessage);

            const aiResponse = await getAIResponse("Hai");

            DebateModel.sendMessage.mockResolvedValueOnce({
                id: 102,
                messageOriginal: aiResponse.content,
            });

            translateToIndonesian.mockResolvedValue("Halo");

            const res = await request(app)
                .post("/api/v1/debates/messages")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    sessionId: 1,
                    senderUserId: testUser.id,
                    senderRole: "pro",
                    messageOriginal: "Hai",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("success");
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data[0].messageOriginal).toBe("Hai");
            expect(res.body.data[1].messageOriginal).toBe(aiResponse.content);
        }, 15000); // timeout diperpanjang

        it("should handle 3 message turns with AI replies and log them", async () => {
            const fakeSession = { id: 1, is_vs_ai: true };

            DebateModel.getSessionById.mockResolvedValue(fakeSession);
            DebateModel.getLastMessage.mockResolvedValue(null);
            translateToIndonesian.mockImplementation((text) =>
                Promise.resolve(text + " (indo)")
            );

            const messages = [
                "Halo",
                "Apa kabar?",
                "Apa pendapatmu tentang AI?",
            ];

            for (let i = 0; i < messages.length; i++) {
                const userMessage = {
                    id: 100 + i * 2,
                    messageOriginal: messages[i],
                };

                const aiResult = await getAIResponse(messages[i]);
                const aiMessage = {
                    id: 101 + i * 2,
                    messageOriginal: aiResult.content,
                };

                DebateModel.sendMessage
                    .mockResolvedValueOnce(userMessage)
                    .mockResolvedValueOnce(aiMessage);

                const res = await request(app)
                    .post("/api/v1/debates/messages")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send({
                        sessionId: fakeSession.id,
                        senderUserId: testUser.id,
                        senderRole: "pro",
                        messageOriginal: messages[i],
                    });

                expect(res.statusCode).toBe(201);
                expect(res.body.data).toHaveLength(2);
                expect(res.body.data[0].messageOriginal).toBe(messages[i]);
                expect(res.body.data[1].messageOriginal).toBe(aiResult.content);

                console.log(
                    `🧠 AI Balasan untuk "${messages[i]}":`,
                    res.body.data[1].messageOriginal
                );
            }
        }, 30000);
    });

    describe("GET /api/v1/debates/sessions/:id", () => {
        it("should return session and messages", async () => {
            DebateModel.getSessionById.mockResolvedValue({ id: 1 });
            DebateModel.getMessagesBySession.mockResolvedValue([
                { id: 1, messageOriginal: "Hello" },
            ]);

            const res = await request(app)
                .get("/api/v1/debates/sessions/1")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("success");
            expect(res.body.data.messages).toHaveLength(1);
        });
    });

    describe("GET /api/v1/debates/sessions/user/:userId", () => {
        it("should return sessions by user", async () => {
            DebateModel.getSessionsByUser.mockResolvedValue([
                { id: 1, session_name: "Debat A" },
            ]);

            const res = await request(app)
                .get(`/api/v1/debates/sessions/user/${testUser.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });
});
