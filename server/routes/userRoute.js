const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");

const {
  userRegister,
  userLogin,
  followUnfollowUser,
  getFollowers,
  getFollowing,
  getUserById,
  editProfile,
} = require("../controller/userController");

// Auth routes
router.post("/login", userLogin);
router.post("/register", upload.single("image"), userRegister);

// ⚠️ This MUST be above `/:id`
router.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log("User ID from token:", req.user._id);

    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "User ID missing from token" });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// Search users by username
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username query is required" });
    }

    // Case-insensitive search for username starting with query
    const users = await User.find({
      username: { $regex: "^" + username, $options: "i" },
    }).select("username name image");

    res.status(200).json({ users });
  } catch (err) {
    console.error("Error in /search route:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Follow/unfollow
router.put("/follow/:id", authMiddleware, followUnfollowUser);

// Followers & Following lists
router.get("/:id/followers", authMiddleware, getFollowers);
router.get("/:id/following", authMiddleware, getFollowing);

// Edit profile
router.patch(
  "/edit-profile",
  authMiddleware,
  upload.single("image"),
  editProfile
);

// Get user by ID (⚠️ Keep this LAST)
router.get("/:id", getUserById);

module.exports = router;
