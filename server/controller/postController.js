const Post = require("../models/postModel");

// Create Post (same)
exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newPost = new Post({
      caption,
      imageUrl: `/uploads/${req.file.filename}`,
      postedBy: req.user._id,
    });

    await newPost.save();

    const populatedPost = await newPost.populate("postedBy", "username image");

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (err) {
    console.error("❌ Error in createPost:", err.message);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get all posts (all users)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "username image followers following")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Get a single post by its ID
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId)
      .populate("postedBy", "username image")
      .populate("comments.user", "username image");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("❌ Error fetching post by ID:", err.message);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Get all posts by a specific user (user's profile posts)
exports.getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ postedBy: userId })
      .populate("postedBy", "username image")
      .sort({ createdAt: -1 });

    if (!posts.length) {
      return res.status(404).json({ error: "No posts found for this user" });
    }

    res.status(200).json({ posts });
  } catch (err) {
    console.error("❌ Error fetching posts by user ID:", err.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(postId).populate(
      "comments.user",
      "username image"
    );

    res.status(201).json({
      message: "Comment added successfully",
      comments: populatedPost.comments,
    });
  } catch (err) {
    console.error("❌ Error adding comment:", err.message);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate(
      "comments.user",
      "username image"
    );
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ comments: post.comments });
  } catch (err) {
    console.error("❌ Error fetching comments:", err.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.postedBy || !req.user || !req.user._id) {
      return res.status(400).json({ error: "Missing user data" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deletePost:", err.message);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// Like or unlike a post
exports.likeOrUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likeCount: post.likes.length,
      likes: post.likes,
    });
  } catch (err) {
    console.error("❌ Error in likeOrUnlikePost:", err.message);
    res.status(500).json({ error: "Failed to like/unlike post" });
  }
};

// Update caption
exports.updateCaption = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { caption } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized: Not your post" });
    }

    post.caption = caption || post.caption;
    await post.save();

    res.status(200).json({
      message: "Caption updated successfully",
      post,
    });
  } catch (err) {
    console.error("❌ Error in updateCaption:", err.message);
    res.status(500).json({ error: "Failed to update caption" });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    console.log("Fetching posts for user:", req.params.userId);
    const posts = await Post.find({ postedBy: req.params.userId }).populate(
      "postedBy",
      "_id username image"
    );
    console.log("Posts found:", posts.length);
    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error fetching posts by user:", err);
    res.status(500).json({ error: "Server error" });
  }
};
