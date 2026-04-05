import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getprofile,
  getSuggestedUsers,
  login,
  logout,
  register,
  resendOTP,
  searchUsers,
  verifyOtp,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/edit").post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.route("/:id/profile").get(isAuthenticated, getprofile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow);
router.route("/send-otp").post(resendOTP);
router.route("/verify-otp").post(verifyOtp);
router.route("/search").get(searchUsers)

export default router;
