import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;

    const notifications = await Notification.find({
      receiverId: userId,
    })
      .populate("senderId", "username profilePicture")
      .populate("postId", "image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};