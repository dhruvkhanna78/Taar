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

const dispatch = useDispatch();
const navigate = useNavigate();

const [open, setOpen] = useState(false);

const logoutHandler = async () => {
const ok = window.confirm("Are you sure you want to logout?");
if (!ok) return;

try {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/v1/user/logout`,
    { withCredentials: true }
  );

  if (res.data.success) {
    // 🔥 CLEAR REDUX STATE COMPLETELY
    dispatch(setAuthUser(null));
    dispatch(setUserProfile(null));

    toast.success(res.data.message);

    navigate("/login");
  }
} catch (error) {
  toast.error(
    error.response?.data?.message ||
      "An error occurred during logout"
  );
  console.error("Logout error:", error);
}


};

const sidebarHandler = (textType) => {
if (textType === "Logout") {
logoutHandler();
} else if (textType === "Create") {
setOpen(true);
} else if (textType === "Profile") {
if (user?._id) {
navigate(`/profile/${user._id}`);
} else {
toast.error("User not logged in");
}
} else if (textType === "Home") {
navigate("/");
}
};

const sidebarItems = [
{ icon: <Home />, text: "Home" },
{ icon: <Search />, text: "Search" },
{ icon: <TrendingUp />, text: "Explore" },
{ icon: <MessageCircle />, text: "Messages" },
{ icon: <Heart />, text: "Notifications" },
{ icon: <PlusSquare />, text: "Create" },
{ icon: <PackageOpen />, text: "Category" },
{
icon: ( <Avatar>
<AvatarImage
src={
user?.profilePicture ||
"https://github.com/shadcn.png"
}
alt={user?.username}
/> </Avatar>
),
text: "Profile"
},
{ icon: <LogOut />, text: "Logout" }
];

return ( <div className="h-screen overflow-y-auto fixed flex flex-col gap-4 p-4 w-64 bg-white shadow-[0_0_10px_rgba(0,0,0,0.4)]"> <div className="flex flex-col"> <h1 className="my-3 pl-3 text-xl font-bold select-none">
Taar </h1>

    <div className="my-5 flex flex-col gap-5">
      {sidebarItems.map((item, index) => (
        <div
          key={index}
          onClick={() => sidebarHandler(item.text)}
          className="select-none flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
        >
          {item.icon}
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  </div>

  <CreatePost open={open} setOpen={setOpen} />
</div>


);
};

export default LeftSidebar;
