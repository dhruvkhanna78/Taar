import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/notification`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">

      <h2 className="text-xl font-bold mb-4">
        Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          No notifications yet
        </p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif._id}
            className="flex items-center justify-between gap-4 py-3 border-b"
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">

              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={notif.senderId?.profilePicture}
                />
                <AvatarFallback>
                  {notif.senderId?.username
                    ?.slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <p className="text-sm">

                <span className="font-semibold">
                  {notif.senderId?.username}
                </span>

                {notif.type === "like" &&
                  " liked your post ❤️"}

                {notif.type === "follow" &&
                  " started following you"}
              </p>
            </div>

            {/* RIGHT SIDE POST PREVIEW */}
            {notif.postId?.image && (
              <Link
                to={`/post/${notif.postId._id}`}
              >
                <img
                  src={
                    Array.isArray(notif.postId.image)
                      ? notif.postId.image[0]
                      : notif.postId.image
                  }
                  className="w-12 h-12 object-cover rounded"
                />
              </Link>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
