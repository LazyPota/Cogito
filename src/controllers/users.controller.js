<<<<<<< HEAD
const { getAllUsers, findUserByUsername } = require("../models/users.model");

const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const getUserByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await findUserByUsername(username);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = { getUsers, getUserByUsername };
=======
const UserModel = require("../models/users.model");

const UserController = {
    // GET /api/v1/users
    async getAll(req, res) {
        try {
            const users = await UserModel.getAllUsers();
            return res.json({
                status: "success",
                data: users,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },

    // GET /api/v1/users/:username
    async getByUsername(req, res) {
        try {
            const { username } = req.params;
            const user = await UserModel.findUserByUsername(username);

            if (!user) {
                return res.status(404).json({
                    status: "fail",
                    message: "User not found",
                });
            }

            return res.json({
                status: "success",
                data: user,
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    },
};

module.exports = UserController;
>>>>>>> 45791c0 (first-commit)
