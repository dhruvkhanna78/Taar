import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Notification } from "../models/notification.model.js";
import { getIO, getReceiverSocket } from "../socket/socket.js";

// export const addNewPost = async (req, res) => {
//   try {
//     const { caption, category, tag } = req.body;
//     const image = req.file;
//     const authorId = req.id; // from isAuthenticated middleware

//     // || !category || !tag add this later
//     if (!image) {
//       return res.status(400).json({
//         message: "Complete the process!",
//         success: false,
//       });
//     }

//     // Image resize and optimize
//     const optimizedImageBuffer = await sharp(image.buffer)
//       .resize({
//         width: 800,
//         height: 800,
//         fit: "inside",
//       })
//       .toFormat("jpeg", { quality: 80 })
//       .toBuffer();

//     // Convert buffer to Data URI
//     const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
//       "base64"
//     )}`;

//     // Upload to Cloudinary
//     const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);

//     // Create post
//     const post = await Post.create({
//       caption,
//       category,
//       tag,
//       image: cloudinaryResponse.secure_url,
//       author: authorId,
//     });

//     // Add post to author's profile
//     const user = await User.findById(authorId);
//     if (user) {
//       user.posts.push(post._id);
//       await user.save();
//     }

//     await post.populate({ path: "author", select: "-password" });

//     return res.status(201).json({
//       message: "New post added",
//       post,
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error",
//       success: false,
//     });
//   }
// };

export const addNewPost = async (req, res) => {
  try {
    const { caption, category, tag } = req.body;
    const authorId = req.id;

    // 1. Files access karna (Images aur Video)
    const imageFiles = req.files["images"] || []; // Array of images
    const videoFile = req.files["video"] ? req.files["video"][0] : null; // Single video

    if (imageFiles.length === 0 && !videoFile) {
      return res.status(400).json({
        message: "Kam se kam ek image ya video toh dalo!",
        success: false,
      });
    }

    // --- IMAGES PROCESSING ---
    const imageUrls = [];
    if (imageFiles.length > 0) {
      // Har image ko loop mein process karenge
      const imagePromises = imageFiles.map(async (file) => {
        const optimizedBuffer = await sharp(file.buffer)
          .resize({ width: 800, height: 800, fit: "inside" })
          .toFormat("jpeg", { quality: 80 })
          .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
        const res = await cloudinary.uploader.upload(fileUri);
        return res.secure_url;
      });

      // Saari images upload hone ka wait karenge
      const uploadedImages = await Promise.all(imagePromises);
      imageUrls.push(...uploadedImages);
    }

    // --- VIDEO PROCESSING ---
    let videoUrl = null;
    if (videoFile) {
      // Video ko buffer se base64 banakar direct upload karenge
      // Note: Video ke liye resource_type: "video" zaroori hai
      const videoUri = `data:${videoFile.mimetype};base64,${videoFile.buffer.toString("base64")}`;
      const cloudVideo = await cloudinary.uploader.upload(videoUri, {
        resource_type: "video",
      });
      videoUrl = cloudVideo.secure_url;
    }

    // 2. Database mein Post Create karna
    const post = await Post.create({
      caption,
      category,
      tag,
      image: imageUrls, // Ab ye Array store karega
      video: videoUrl, // Video ke liye naya field (agar model mein hai)
      author: authorId,
    });

    // 3. User update logic (Same rahega)
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
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const category = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = category
      ? { category: { $regex: new RegExp(`^${category}$`, "i") } }
      : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error in getAllPost:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const getAllPost = async (req, res) => {
//   try {
//     // Sabse simple query: {} matlab NO FILTER, poora collection fetch karo
//     const posts = await Post.find({})
//       .sort({ createdAt: -1 }) // Latest posts pehle
//       .populate({
//         path: "author",
//         select: "username profilePicture"
//       })
//       .populate({
//         path: "comments",
//         options: { sort: { createdAt: -1 } },
//         populate: {
//           path: "author",
//           select: "username profilePicture"
//         },
//       });

//     // Terminal check ke liye
//     console.log(`Bhai, DB mein total ${posts.length} posts mili hain.`);

//     return res.status(200).json({
//       success: true,
//       posts, // Ye list saare users ki posts contain karegi
//     });
//   } catch (error) {
//     console.error("Error in getAllPost:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

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

    // duplicate like prevent karega
    if (post.likes.includes(likeKarneWalaKiId)) {
      return res.status(400).json({
        message: "Already liked",
        success: false,
      });
    }

    await post.updateOne({
      $addToSet: { likes: likeKarneWalaKiId },
    });

    // notification DB entry
    await Notification.create({
      senderId: likeKarneWalaKiId,
      receiverId: post.author,
      type: "like",
      postId: postId,
    });

    // realtime emit
    console.log("Post Author ID:", post.author);
    const receiverSocket = getReceiverSocket(post.author);
    console.log("Receiver Socket Found:", receiverSocket);

    if (receiverSocket) {
      getIO().to(receiverSocket).emit("notification", {
        senderId: likeKarneWalaKiId,
        type: "like",
        postId,
      });
      console.log("Event Emitted to:", receiverSocket);
    } else{
      console.log("No active socket found for author");
    }

    return res.status(200).json({
      message: "Post liked",
      success: true,
    });
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
    });

    await comment.populate({
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
      "username profilePicture",
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
