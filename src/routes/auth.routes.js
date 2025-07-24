const express = require("express");
<<<<<<< HEAD
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
=======
const AuthController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
>>>>>>> 45791c0 (first-commit)

module.exports = router;
