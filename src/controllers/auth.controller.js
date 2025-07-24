const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const { findUserByUsername, createUser } = require("../models/users.model");
require("dotenv").config();

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ message: "Username already taken" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await createUser({ username, email, password: hashed });

        res.status(201).json({ message: "User registered", user });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Username and password are required" });
        }

        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", token });
    } catch (err) {
        next(err);
    }
};

const logout = (req, res) => {
    res.json({ message: "Logout successful (client should delete token)" });
};

module.exports = { register, login, logout };
=======
const UserModel = require("../models/users.model");
require("dotenv").config();

const AuthController = {
    // POST /api/v1/auth/register
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    status: "fail",
                    message: "All fields are required",
                });
            }

            const existingUser = await UserModel.findByUsername(username);
            if (existingUser) {
                return res.status(409).json({
                    status: "fail",
                    message: "Username already taken",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await UserModel.create({
                username,
                email,
                password: hashedPassword,
            });

            return res.status(201).json({
                status: "success",
                message: "User registered successfully",
                // data: {
                //     id: user.id,
                //     username: user.username,
                //     email: user.email,
                // },
            });
        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // POST /api/v1/auth/login
    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    status: "fail",
                    message: "Username and password are required",
                });
            }

            const user = await UserModel.findByUsername(username);
            if (!user) {
                return res.status(401).json({
                    status: "fail",
                    message: "Invalid credentials",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: "fail",
                    message: "Invalid credentials",
                });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { algorithm: "HS256", expiresIn: "6h" }
            );

            return res.status(200).json({
                status: "success",
                message: "Login successful",
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    },
                    token: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // GET /api/v1/auth/logout
    logout(req, res) {
        return res.status(200).json({
            status: "success",
            message: "Logout successful",
        });
    },
};

module.exports = AuthController;
>>>>>>> 45791c0 (first-commit)
