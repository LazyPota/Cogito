const request = require("supertest");
const jwt = require("jsonwebtoken");
const db = require("../../db/pool");
const app = require("../../app");

const testUser = {
    id: null,
    password: "hashed_password",
    username: "testuser",
};

let accessToken = "";
let insertedIssueIds = [];

beforeAll(async () => {
    const userRes = await db.query(
        `INSERT INTO users (password, username) VALUES ($1, $2) RETURNING id`,
        [testUser.password, testUser.username]
    );
    testUser.id = userRes.rows[0].id;

    accessToken = jwt.sign(
        { id: testUser.id, username: testUser.username },
        process.env.JWT_SECRET
    );

    // Insert sample issues
    const issuesRes = await db.query(
        `INSERT INTO issues (title, description) VALUES 
        ('Issue 1', 'Desc 1'),
        ('Issue 2', 'Desc 2')
        RETURNING id`
    );
    insertedIssueIds = issuesRes.rows.map((row) => row.id);
});

afterAll(async () => {
    await db.query(`DELETE FROM issues WHERE id = ANY($1::int[])`, [
        insertedIssueIds,
    ]);
    await db.query(`DELETE FROM users WHERE id = $1`, [testUser.id]);
    await db.end();
});

describe("IssueController (Integration Test)", () => {
    describe("GET /api/v1/issues", () => {
        it("should return all issues", async () => {
            const res = await request(app)
                .get("/api/v1/issues")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("success");
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("GET /api/v1/issues/:id", () => {
        it("should return issue by id", async () => {
            const issueId = insertedIssueIds[0];
            const res = await request(app)
                .get(`/api/v1/issues/${issueId}`)
                .set("Authorization", `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("success");
            expect(res.body.data).toHaveProperty("id", issueId);
        });

        it("should return 404 if issue not found", async () => {
            const res = await request(app)
                .get("/api/v1/issues/999999")
                .set("Authorization", `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.status).toBe("fail");
            expect(res.body.message).toBe("Issue not found");
        });
    });
});
