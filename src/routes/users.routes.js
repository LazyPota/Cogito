const express = require("express");
<<<<<<< HEAD
const { getUsers, getUserByUsername } = require("../controllers/users.controller");
=======
const UserController = require("../controllers/users.controller");
>>>>>>> 45791c0 (first-commit)
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

<<<<<<< HEAD
router.get("/", authMiddleware, getUsers);
router.get("/:username", authMiddleware, getUserByUsername);
=======
router.use(authMiddleware);

router.get("/", UserController.getAll);
router.get("/:username", UserController.getByUsername);
>>>>>>> 45791c0 (first-commit)

module.exports = router;
