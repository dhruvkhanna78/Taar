import { Avatar, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  PackageOpen
} from "lucide-react";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";

const LeftSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  if (!user) return null;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setUserProfile(null));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") logoutHandler();
    else if (textType === "Create") setOpen(true);
    else if (textType === "Profile") user?._id ? navigate(`/profile/${user._id}`) : toast.error("User not logged in");
    else if (textType === "Home") navigate("/");
    // Baki items ke liye bhi navigation add kar sakte ho
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore", desktopOnly: true }, // Mobile pe space bachane ke liye hide kar sakte ho
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <Heart />, text: "Notifications", desktopOnly: true },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture || "https://github.com/shadcn.png"} />
        </Avatar>
      ),
      text: "Profile"
    },
    { icon: <LogOut />, text: "Logout", desktopOnly: true }
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Visible on md and up) --- */}
      <div className="hidden md:flex h-screen overflow-y-auto fixed flex-col gap-4 p-4 w-64 bg-white shadow-[0_0_10px_rgba(0,0,0,0.4)]">
        <h1 className="my-3 pl-3 text-xl font-bold select-none">Taar</h1>
        <div className="my-5 flex flex-col gap-5">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="select-none flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
          {/* Mobile pe sidebar hidden hai isliye logout yahan must hai */}
          <div onClick={() => logoutHandler()} className="md:hidden flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
              <LogOut /> <span>Logout</span>
          </div>
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION (Visible only on small screens) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 z-50">
        {sidebarItems.filter(item => !item.desktopOnly).map((item, index) => (
          <div key={index} onClick={() => sidebarHandler(item.text)} className="cursor-pointer">
            {item.icon}
          </div>
        ))}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;