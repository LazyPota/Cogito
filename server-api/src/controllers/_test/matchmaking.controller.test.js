const request = require("supertest");
const jwt = require("jsonwebtoken");
const db = require("../../db/pool");
const app = require("../../app");
const DebateModel = require("../../models/debate.model");

jest.mock("../../models/debate.model");

describe("Matchmaking API", () => {
    const user1 = {
        password: "password123",
        username: "user1",
    };

    const user2 = {
        password: "password123",
        username: "user2",
    };

    let user1Token, user2Token;
    const issueId = 999;

    beforeAll(async () => {
        // Insert user 1
        const res1 = await db.query(
            `INSERT INTO users (password, username) VALUES ($1, $2) RETURNING id`,
            [user1.password, user1.username]
        );
        user1.id = res1.rows[0].id;
        user1Token = jwt.sign(
            { id: user1.id, username: user1.username },
            process.env.JWT_SECRET
        );

        // Insert user 2
        const res2 = await db.query(
            `INSERT INTO users (password, username) VALUES ($1, $2) RETURNING id`,
            [user2.password, user2.username]
        );
        user2.id = res2.rows[0].id;
        user2Token = jwt.sign(
            { id: user2.id, username: user2.username },
            process.env.JWT_SECRET
        );
    });

    afterAll(async () => {
        await db.query(`DELETE FROM users WHERE username IN ($1, $2)`, [
            user1.username,
            user2.username,
        ]);
        await db.end();
    });

    test("should match two users with same issue_id and create a debate session", async () => {
        DebateModel.createSession.mockResolvedValue({
            id: "session-xyz-123",
        });

        const res1 = await request(app)
            .post("/api/v1/matchmaking/find")
            .set("Authorization", `Bearer ${user1Token}`)
            .send({ issue_id: issueId });

        expect(res1.statusCode).toBe(200);
        expect(res1.body.status).toBe("success");
        expect(res1.body.data.status).toBe("waiting");

        const res2 = await request(app)
            .post("/api/v1/matchmaking/find")
            .set("Authorization", `Bearer ${user2Token}`)
            .send({ issue_id: issueId });

        expect(res2.statusCode).toBe(200);
        expect(res2.body.status).toBe("success");
        expect(res2.body.data.status).toBe("matched");
        expect(res2.body.data.sessionId).toBe("session-xyz-123");

        expect(DebateModel.createSession).toHaveBeenCalledTimes(1);
        expect(DebateModel.createSession).toHaveBeenCalledWith(
            expect.objectContaining({
                issue_id: issueId,
                pro_user_id: expect.any(Number),
                contra_user_id: expect.any(Number),
                is_vs_ai: false,
                session_name: expect.stringMatching(/^Debate \d+/),
            })
        );
    });

    test("should not match users with different issue_id", async () => {
        DebateModel.createSession.mockClear();

        const res1 = await request(app)
            .post("/api/v1/matchmaking/find")
            .set("Authorization", `Bearer ${user1Token}`)
            .send({ issue_id: 1000 });

        expect(res1.statusCode).toBe(200);
        expect(res1.body.status).toBe("success");
        expect(res1.body.data.status).toBe("waiting");

        const res2 = await request(app)
            .post("/api/v1/matchmaking/find")
            .set("Authorization", `Bearer ${user2Token}`)
            .send({ issue_id: 2000 });

        expect(res2.statusCode).toBe(200);
        expect(res2.body.status).toBe("success");
        expect(res2.body.data.status).toBe("waiting");

        expect(DebateModel.createSession).not.toHaveBeenCalled();
    });
});
