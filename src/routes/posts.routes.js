const express = require("express");
const {
    handleCreatePost,
    handleGetPosts,
    handleGetPostById,
} = require("../controllers/posts.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/", authMiddleware, upload.array("images", 2), handleCreatePost);
router.get("/", authMiddleware, handleGetPosts);
router.get("/:postId", authMiddleware, handleGetPostById);

module.exports = router;
