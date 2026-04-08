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
  PackageOpen,
  ChevronDown
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
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  if (!user) return null;

  // Aapki image wali categories
  const categories = [
    "Entertainment",
    "Sports",
    "Gaming",
    "Learning",
    "Coding",
    "Art & Literature"
  ];

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
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const sidebarHandler = (textType) => {
    // Agar Category ke alawa kahin click ho to dropdown band kar do
    if (textType !== "Category") setShowCategoryDropdown(false);

    switch (textType) {
      case "Logout": logoutHandler(); break;
      case "Create": setOpen(true); break;
      case "Home": navigate("/"); break;
      case "Search": navigate("/search"); break;
      case "Profile": navigate(`/profile/${user?._id}`); break;
      case "Category": setShowCategoryDropdown(!showCategoryDropdown); break;
      default: break;
    }
  };

  const handleCategoryClick = (cat) => {
    setShowCategoryDropdown(false);
    // URL encode kar rahe hain taaki "Art & Literature" jaise names sahi se jayein
    navigate(`/category/${cat.toLowerCase()}`);
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
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture || "https://github.com/shadcn.png"} />
        </Avatar>
      ),
      text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen overflow-y-auto fixed flex-col gap-4 p-4 w-64 bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)]">
        <h1 className="my-3 pl-3 text-2xl font-bold tracking-tighter text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
          Taar
        </h1>

        <div className="flex flex-col gap-2">
          {sidebarItems.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => sidebarHandler(item.text)}
                className={`flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer rounded-xl transition-all ${showCategoryDropdown && item.text === "Category" ? "bg-gray-100 font-semibold" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
                {item.text === "Category" && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCategoryDropdown ? "rotate-180" : ""}`} />
                )}
              </div>

              {/* Desktop Dropdown Content */}
              {item.text === "Category" && showCategoryDropdown && (
                <div className="ml-9 mt-1 flex flex-col border-l-2 border-gray-100 animate-in slide-in-from-top-2 duration-200">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="text-left px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-r-lg transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t flex justify-around items-center py-3 z-50 px-2">
        {/* Home, Search, Category (Left Side) */}
        <button onClick={() => navigate("/")}><Home className="w-6 h-6" /></button>
        <button onClick={() => navigate("/search")}><Search className="w-6 h-6" /></button>

        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={`${showCategoryDropdown ? "text-blue-600" : "text-gray-600"}`}
          >
            <PackageOpen className="w-6 h-6" />
          </button>

          {showCategoryDropdown && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white border shadow-2xl rounded-2xl w-48 p-2 animate-in zoom-in-95 duration-200">
              <p className="text-[10px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">Select Category</p>
              {categories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="p-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-sm font-medium transition-colors"
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center Create Button */}
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-2xl -mt-10 shadow-lg shadow-blue-200 active:scale-95 transition-transform"
        >
          <PlusSquare className="w-6 h-6" />
        </button>

        {/* Profile & Logout (Right Side) */}
        <button onClick={() => navigate(`/profile/${user?._id}`)}>
          <Avatar className="w-6 h-6">
            <AvatarImage src={user?.profilePicture} />
          </Avatar>
        </button>
        <button onClick={logoutHandler}><LogOut className="w-6 h-6 text-red-500" /></button>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;