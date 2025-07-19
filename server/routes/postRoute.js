const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  addComment,
  getComments,
  deletePost,
  likeOrUnlikePost,
  updateCaption,
} = require("../controller/postController");

// Create post with image upload
router.post("/create", authMiddleware, upload.single("image"), createPost);

// Get all posts
router.get("/all", authMiddleware, getAllPosts);

// Get all posts by user ID (for profile)
router.get("/user/:userId", authMiddleware, getPostsByUser);
// Get single post by post ID
router.get("/:id", authMiddleware, getPostById);

// Comments
router.post("/:postId/comments", authMiddleware, addComment);
router.get("/:postId/comments", authMiddleware, getComments);

// Delete, Like, Update
router.delete("/:id", authMiddleware, deletePost);
router.put("/like/:id", authMiddleware, likeOrUnlikePost);
router.put("/update/:id", authMiddleware, updateCaption);

module.exports = router;
