import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption, category, tag } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image || !category || !tag) {
      return res.status(400).json({
        message: "Complete the process!",
      });
    }

    // Image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //   buffer to data uri
    const fileUri = `data:image/;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      category,
      tag,
      image: cloudinaryResponse.secure_url,
      author: authorId,
    });

    //Adding the post in author's profile
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const { category } = req.body;
    const posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKarneWalaKiId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    //like logic
    await post.updateOne({ $addToSet: { likes: likeKarneWalaKiId } });
    await post.save();

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeKarneWalaKiId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    //like logic
    await post.updateOne({ $pull: { likes: likeKarneWalaKiId } });
    await post.save();

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKarneWalaUserKiId = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(400)
        .json({ message: "Type something", success: false });

    const comment = await Comment.create({
      text,
      author: commentKarneWalaUserKiId,
      post: postId,
    }).populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const { postId } = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );

    if (!comments)
      return res.status(404).json({ message: "No comments", success: false });

    return res.status(200).json({
      comments,
      success: true,
    });
  } catch {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // Check if the logged-in user is the owner of the post

    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: "unauthorized" });

    //ddeleting post
    await Post.findByIdAndDelete(postId);

    //deleting from user collection
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    // deleting associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      //already marked now remove it
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(404).json({ message: "Removed", success: true });
    } else {
      //mark the post
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({ message: "Saved", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
