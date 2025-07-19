const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Register
exports.userRegister = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    const profilePic = req.file
      ? `${BASE_URL}/uploads/${req.file.filename}`
      : "https://i.pinimg.com/736x/74/a3/b6/74a3b6a8856b004dfff824ae9668fe9b.jpg"; // default image

    const userExist = await User.findOne({ $or: [{ email }, { username }] });
    if (userExist) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      image: profilePic,
    });

    return res.status(201).json({
      message: "Account created successfully!",
      user: {
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        image: newUser.image,
      },
    });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({
      error: "Registration failed",
      detail: err.message,
    });
  }
};

// Login
exports.userLogin = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { username, password } = req.body;

  try {
    const userExist = await User.findOne({ username });
    if (!userExist)
      return res.status(400).json({ error: "User doesn't exist!" });
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid ID or password" });

    const token = jwt.sign({ id: userExist._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: userExist._id,
        name: userExist.name,
        username: userExist.username,
        image:
          userExist.image && !userExist.image.startsWith("http")
            ? `${BASE_URL}/${userExist.image.replace(/^\/+/, "")}`
            : userExist.image,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.followUnfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (err) {
    console.error("❌ Error in followUnfollowUser:", err.message);
    res.status(500).json({ error: "Follow/Unfollow failed" });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username image"
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ followers: user.followers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch followers" });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "username image"
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ following: user.following });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch following" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const userObj = user.toObject();
    if (userObj.image && !userObj.image.startsWith("http")) {
      userObj.image = `${BASE_URL}/${userObj.image.replace(/^\/+/, "")}`;
    }

    res.status(200).json({ user: userObj });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, bio } = req.body;

    let updatedImage;
    if (req.file) {
      updatedImage = `${BASE_URL}/uploads/${req.file.filename}`;
    }

    const updates = {
      ...(username && { username }),
      ...(bio !== undefined && { bio }),
      ...(updatedImage && { image: updatedImage }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Edit profile error:", err.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
