const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const db = require("../../db/pool");
const DebateModel = require("../../models/debate.model");
const { translateToIndonesian } = require("../../services/translate.service");

jest.mock("../../models/debate.model");
jest.mock("../../services/translate.service");

const testUser = {
    id: null,
    email: "testuser@example.com",
    password: "hashed_password", // anggap sudah di-hash saat insert
    username: "testuser",
};
let accessToken = "";

beforeAll(async () => {
    const insertResult = await db.query(
        `INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id`,
        [testUser.email, testUser.password, testUser.username]
    );
    testUser.id = insertResult.rows[0].id;
    accessToken = jwt.sign(
        { id: testUser.id, email: testUser.email },
        process.env.JWT_SECRET
    );
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

            const response = await request(app)
                .post("/api/v1/debates/sessions")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    issue_id: 10,
                    pro_user_id: testUser.id,
                    contra_user_id: 3,
                    is_vs_ai: false,
                    session_name: "Test Session",
                });

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty("status", "success");
            expect(response.body.data).toEqual(fakeSession);
        });
    });

    describe("POST /api/v1/debates/messages", () => {
        it("should send user message and respond with AI", async () => {
            const fakeSession = { id: 1, is_vs_ai: true };
            const fakeUserMessage = { id: 101, messageOriginal: "Hai" };
            const fakeAiMessage = { id: 102, messageOriginal: "Halo juga" };

            DebateModel.getSessionById.mockResolvedValue(fakeSession);
            DebateModel.getLastMessage.mockResolvedValue(null);
            DebateModel.sendMessage
                .mockResolvedValueOnce(fakeUserMessage)
                .mockResolvedValueOnce(fakeAiMessage);
            translateToIndonesian.mockResolvedValue("Halo");

            jest.mock("axios");
            const axios = require("axios");
            axios.post = jest.fn().mockResolvedValue({
                data: { message: "Halo juga" },
            });

            const response = await request(app)
                .post("/api/v1/debates/messages")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    sessionId: 1,
                    senderUserId: testUser.id,
                    senderRole: "pro",
                    messageOriginal: "Hai",
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toEqual(fakeUserMessage);
            expect(response.body.data[1]).toEqual(fakeAiMessage);
        });
    });

    describe("GET /api/v1/debates/sessions/:id", () => {
        it("should return session and messages", async () => {
            DebateModel.getSessionById.mockResolvedValue({ id: 1 });
            DebateModel.getMessagesBySession.mockResolvedValue([
                { id: 1, messageOriginal: "Hello" },
            ]);

            const response = await request(app)
                .get("/api/v1/debates/sessions/1")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.data.messages).toHaveLength(1);
        });
    });

    describe("GET /api/v1/debates/sessions/user/:userId", () => {
        it("should return sessions by user", async () => {
            DebateModel.getSessionsByUser.mockResolvedValue([
                { id: 1, session_name: "Debat A" },
            ]);

            const response = await request(app)
                .get(`/api/v1/debates/sessions/user/${testUser.id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveLength(1);
        });
    });
});
