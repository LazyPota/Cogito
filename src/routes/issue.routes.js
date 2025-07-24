const express = require("express");
const IssueController = require("../controllers/issue.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", IssueController.getAll);
router.get("/:id", IssueController.getById);

module.exports = router;
