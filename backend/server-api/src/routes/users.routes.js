const express = require("express");
const UserController = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", UserController.getAll);
router.get("/:username", UserController.getByUsername);

module.exports = router;
