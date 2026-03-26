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
  console.log("📥 Payload received:", req.body);
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({ message: "Something is missing", success: false });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(401).json({
        message: "User already exists and is verified. Please login.",
        success: false,
      });
    }

    // OTP Generate and Send
    let otpData = await otpGenerateAndSend(email);
    const hashedpassword = await bcrypt.hash(password, 10);

    if (user && !user.isVerified) {
      // AGAR USER HAI PAR VERIFIED NAHI HAI: Toh purana data update karo
      user.username = username;
      user.password = hashedpassword;
      user.otp = otpData.otp;
      user.otpExpiry = otpData.otpExpiry;
      await user.save();
    } else {
      // AGAR USER BILKUL NAYA HAI: Toh create karo
      await User.create({
        username,
        email,
        password: hashedpassword,
        isVerified: false,
        otp: otpData.otp,
        otpExpiry: otpData.otpExpiry,
      });
    }

    return res.status(201).json({
      message: "OTP sent to email. Please verify.",
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

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email with OTP before logging in.",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

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
        sameSite: "lax",
        secure: false,
        path: "/", // IMPORTANT FIX
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
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

// OTP verification function
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

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }

    if (user.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

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

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/", // IMPORTANT FIX
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "OTP verified & Logged in successfully!",
        success: true,
        user: userResponse,
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
//Logout function
export const logout = async (_, res) => {
  try {
    return res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/", // CRITICAL FIX
      })
      .json({
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

    // Check agar userId undefined ya null toh nahi
    if (!userId || userId === "undefined") {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    const user = await User.findById(userId)
      .populate({ path: "posts", options: { sort: { createdAt: -1 } } })
      .populate("bookmarks");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

//Edit profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;

    // safe file handling
    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse = await cloudinary.uploader.upload(fileUri);

      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("EDIT PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      success: false,
    });
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
