import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

//Register function
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "This email is already in use",
        success: false,
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedpassword,
    });

    return res.status(201).json({
      message: "Account created successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

     // Generate token(ticket to stay logged in) after passing all the steps
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
    });

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId)=>{
        const post = await Post.findById(postId);
        if(post.author.equals(user._id)){
          return post;
        }
        return null;
      })
    );

    // creating user object to store essential data
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      follower: user.follower,
      following: user.following,
      posts: user.posts,
    };
    
   
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

//Logout function
export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Getting profile of the users
export const getprofile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId);
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Edit profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file; //We take picture using .file

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.Uploader.upload(fileUri);
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(404).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const SuggestedUsers = await User.find({ id: { $ne: req.id } }).select(
      "-password"
    );
    if (!SuggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      });
    }

    return res.status(200).json({
      success: true,
      users: SuggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKarneWala = req.id; //our id
    const jiskoFollowKarunga = req.params.id;

    if (followKarneWala === jiskoFollowKarunga) {
      return res.status(400).json({
        message: "You can not follow/unfollow yourself",
        success: false,
      });
    }
    const user = await User.findById(followKarneWala);
    const targetUser = await User.findById(jiskoFollowKarunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(jiskoFollowKarunga); //includes retuen boolean value if jiskoFollowKarunga exists in following array of my id

    //already following
    if (isFollowing) {
      //unfollow
      await Promise.all([
        //followKarneWala ki id mein jo following table hai usme jiskoFollowKarunga use remove kardiya
        User.updateOne(
          { _id: followKarneWala },
          { $pull: { following: jiskoFollowKarunga } }
        ),
        //jiskoFollowKarunga ki id mein jo follower table hai usme followKarneWala ko remove kardiya
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $pull: { follower: followKarneWala } }
        ),
      ]);
      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      });
    } else {
      //follow
      await Promise.all([
        //followKarneWala ki id mein jo following table hai usme jiskoFollowKarunga use push kardiya
        User.updateOne(
          { _id: followKarneWala },
          { $push: { following: jiskoFollowKarunga } }
        ),
        //jiskoFollowKarunga ki id mein jo follower table hai usme followKarneWala ko push kardiya
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $push: { follower: followKarneWala } }
        ),
      ]);
      return res.status(200).json({
        message: "Followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};