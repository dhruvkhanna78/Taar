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
    <div className="w-full max-w-4xl px-6 py-5">

      <h2 className="text-3xl font-bold mb-6 tracking-tight">
        Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-zinc-400 text-center mt-24 text-lg">
          No notifications yet
        </p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif._id}
            className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-zinc-100 transition-all duration-200"
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={notif.senderId?.profilePicture}
                />
                <AvatarFallback>
                  {notif.senderId?.username
                    ?.slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <p className="text-sm text-zinc-700">

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
                  className="w-14 h-14 object-cover rounded-xl"
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
