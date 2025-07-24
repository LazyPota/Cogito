const {
    createPost,
    addAttachment,
    getPosts,
    getPostWithComments,
} = require("../models/posts.model");

const handleCreatePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // --- PERUBAHAN 1: Ganti 'caption' menjadi 'content' ---
        // Ini untuk mengambil data dari body request yang akan kita kirim dari Postman
        const { content } = req.body;

        const files = req.files;
        if (!files || files.length === 0) {
            return res
                .status(400)
                .json({ message: "At least one image is required" });
        }
        if (files.length > 2) {
            return res
                .status(400)
                .json({ message: "Maximum 2 images are allowed" });
        }

        // --- PERUBAHAN 2: Kirim 'content' ke fungsi createPost ---
        // Sekarang kita mengirim objek dengan properti 'content' agar cocok dengan model dan database
        const post = await createPost({ userId, content });

        for (const file of files) {
            const fileUrl = `/uploads/${file.filename}`;
            await addAttachment({ postId: post.id, url: fileUrl });
        }

        res.status(201).json({ message: "Post created with photo(s)", post });
    } catch (err) {
        next(err);
    }
};

const handleGetPosts = async (req, res, next) => {
    try {
        const posts = await getPosts();
        res.json(posts);
    } catch (err) {
        next(err);
    }
};

const handleGetPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await getPostWithComments(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(post);
    } catch (err) {
        next(err);
    }
};

module.exports = { handleCreatePost, handleGetPosts, handleGetPostById };
