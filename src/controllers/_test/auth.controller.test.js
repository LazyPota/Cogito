const request = require("supertest");
const app = require("../../app");
const UserModel = require("../../models/users.model");
const bcrypt = require("bcrypt");

jest.mock("../../models/users.model");

describe("AuthController", () => {
    const userData = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        password: "$2b$10$hashedpassword", // hashed dummy
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        // Hapus user yang mungkin dibuat selama test
        await UserModel.deleteByUsername?.("newuser");
    });

    describe("POST /api/v1/auth/register", () => {
        it("should return 400 if required fields are missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({ username: "testuser" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("All fields are required");
        });

        it("should return 409 if username already exists", async () => {
            UserModel.findByUsername.mockResolvedValue(userData);

            const res = await request(app).post("/api/v1/auth/register").send({
                username: userData.username,
                email: userData.email,
                password: "password123",
            });

            expect(res.status).toBe(409);
            expect(res.body.message).toBe("Username already taken");
        });

        it("should register user successfully", async () => {
            UserModel.findByUsername.mockResolvedValue(null);
            UserModel.create.mockResolvedValue({ id: 2, ...userData });

            const res = await request(app).post("/api/v1/auth/register").send({
                username: "newuser",
                email: "new@example.com",
                password: "password123",
            });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("User registered successfully");
        });
    });

    describe("POST /api/v1/auth/login", () => {
        it("should return 400 if missing credentials", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ username: "testuser" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Username and password are required");
        });

        it("should return 401 if user not found", async () => {
            UserModel.findByUsername.mockResolvedValue(null);

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ username: "notfound", password: "wrong" });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Invalid credentials");
        });

        it("should return 401 if password is incorrect", async () => {
            UserModel.findByUsername.mockResolvedValue(userData);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ username: userData.username, password: "wrongpass" });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Invalid credentials");
        });

        it("should login successfully with valid credentials", async () => {
            UserModel.findByUsername.mockResolvedValue(userData);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

            const res = await request(app).post("/api/v1/auth/login").send({
                username: userData.username,
                password: "password123",
            });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("success");
            expect(res.body.data.user.username).toBe(userData.username);
            expect(res.body.data.token).toMatch(/^Bearer\s/);
        });
    });

    describe("GET /api/v1/auth/logout", () => {
        it("should return 200 on logout", async () => {
            const res = await request(app).get("/api/v1/auth/logout");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Logout successful");
        });
    });
});
