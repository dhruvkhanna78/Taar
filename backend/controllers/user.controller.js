import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { sendOTPEmail } from "../services/emailServices.js";
import { otpGenerateAndSend } from "../utils/otpHelper.js";

// Register function
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 1. Basic Validation
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(401).json({
        message: "User or Email already exists",
        success: false,
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    // 3. OTP Generation & Sending (Iska fail hona handle karna zaroori hai)
    let otpData;
    try {
      otpData = await otpGenerateAndSend(email);
    } catch (mailError) {
      console.log("Mail service error:", mailError);
      return res.status(500).json({
        message: "Failed to send OTP. Please try again later.",
        success: false,
      });
    }

    // Double check if otp was actually generated
    if (!otpData || !otpData.otp) {
        return res.status(500).json({
          message: "OTP generation failed",
          success: false,
        });
    }

    // 4. Create User ONLY if OTP was sent
    await User.create({
      username,
      email,
      password: hashedpassword,
      isVerified: false,
      otp: otpData.otp,
      otpExpiry: otpData.otpExpiry,
    });

    return res.status(201).json({
      message: "OTP sent to email. Verify to activate account.",
      success: true,
    });

  } catch (error) {
    console.log("Global Register Error:", error);
    return res.status(500).json({
      message: "Server error, please try again",
      success: false,
    });
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

    // const populatedPosts = await Promise.all(
    //   user.posts.map(async (postId)=>{
    //     const post = await Post.findById(postId);
    //     if(post.author.equals(user._id)){
    //       return post;
    //     }
    //     return null;
    //   })
    // );

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
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user: user,
      });
  } catch (error) {
    console.log(error);
    // Yeh line add karein varna frontend fasa rahega
    return res.status(500).json({
      message: "Server error, please try again",
      success: false,
    });
  }
};

//Verification of user
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const { otp, otpExpiry } = await otpGenerateAndSend(email);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    return res.status(200).json({
      message: "OTP sent to your email",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error, please try again",
      success: false,
    });
  }
};

//OTP verification function
// OTP verification function (Complete & Fixed)
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Check Expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }

    // Check OTP (String conversion for safety)
    if (user.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    // Verify user and clear OTP fields
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate Token (Ticket) - Taaki signup ke baad login na karna pade
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // Essential User Data for Frontend
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      follower: user.follower,
      following: user.following,
      posts: user.posts,
    };

    // Set Cookie and Send Response
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "OTP verified & Logged in successfully!",
        success: true,
        user: userResponse, // Frontend Redux ke liye
      });
  } catch (error) {
    console.log("Verify OTP Error:", error);
    return res.status(500).json({
      message: "Server error, please try again",
      success: false,
    });
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
      "-password",
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

//Follow or Unfollow function
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
          { $pull: { following: jiskoFollowKarunga } },
        ),
        //jiskoFollowKarunga ki id mein jo follower table hai usme followKarneWala ko remove kardiya
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $pull: { follower: followKarneWala } },
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
          { $push: { following: jiskoFollowKarunga } },
        ),
        //jiskoFollowKarunga ki id mein jo follower table hai usme followKarneWala ko push kardiya
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $push: { follower: followKarneWala } },
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
