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
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";

const LeftSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  if (!user) return null;

  const categories = ["Entertainment", "Sports", "Gaming", "Learning", "Coding", "Art & Literature"];

  const isActive = (path) => location.pathname === path;

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

  const sidebarHandler = (textType, path) => {
    if (textType !== "Category") setShowCategoryDropdown(false);

    switch (textType) {
      case "Logout": logoutHandler(); break;
      case "Create": setOpen(true); break;
      case "Category": setShowCategoryDropdown(!showCategoryDropdown); break;
      default: if (path) navigate(path); break;
    }
  };

  const handleCategoryClick = (cat) => {
    setShowCategoryDropdown(false);
    navigate(`/category/${cat.toLowerCase()}`);
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home", path: "/" },
    { icon: <Search />, text: "Search", path: "/search" },
    { icon: <TrendingUp />, text: "Explore", path: "/explore" },
    { icon: <MessageCircle />, text: "Messages", path: "/chat" },
    { icon: <Heart />, text: "Notifications", path: "/notifications" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <PackageOpen />, text: "Category" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture || "https://github.com/shadcn.png"} />
        </Avatar>
      ),
      text: "Profile",
      path: `/profile/${user?._id}`
    },
    { icon: <LogOut />, text: "Logout" }
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Restored & Minimal) --- */}
      <div className="hidden md:flex h-screen overflow-y-auto fixed flex-col gap-4 p-4 w-64 bg-white border-r border-gray-100">
        <h1 
          className="my-4 pl-3 text-2xl font-black tracking-tighter text-black cursor-pointer" 
          onClick={() => navigate("/")}
        >
          Taar
        </h1>

        <div className="flex flex-col gap-1">
          {sidebarItems.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => sidebarHandler(item.text, item.path)}
                className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-xl transition-all duration-200 
                ${(isActive(item.path) || (item.text === "Category" && showCategoryDropdown)) 
                  ? "bg-gray-100 font-bold text-black" 
                  : "text-gray-600"}`}
              >
                <div className="flex items-center gap-3">
                  {/* Active state mein icon ko thoda highlight karne ke liye */}
                  <span className={isActive(item.path) ? "[&>svg]:stroke-[2.5px]" : ""}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.text}</span>
                </div>
                {item.text === "Category" && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
                )}
              </div>

              {/* Desktop Category Dropdown */}
              {item.text === "Category" && showCategoryDropdown && (
                <div className="ml-9 mt-1 flex flex-col border-l-2 border-gray-100 animate-in slide-in-from-top-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="text-left px-4 py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-50 rounded-r-lg transition-colors"
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

      {/* --- MOBILE NAVBAR (No Logout, 5 Items) --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center py-2 z-50 px-2 pb-6">
        
        <button onClick={() => navigate("/")} className={`p-2 ${isActive("/") ? "text-black" : "text-gray-400"}`}>
          <Home className={`w-6 h-6 ${isActive("/") ? "fill-black" : ""}`} />
        </button>

        <button onClick={() => navigate("/search")} className={`p-2 ${isActive("/search") ? "text-black" : "text-gray-400"}`}>
          <Search className={`w-6 h-6 ${isActive("/search") ? "stroke-[3px]" : ""}`} />
        </button>

        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white p-3.5 rounded-2xl -mt-10 shadow-xl active:scale-90 transition-transform border-4 border-white"
        >
          <PlusSquare className="w-6 h-6" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={`p-2 ${showCategoryDropdown ? "text-black" : "text-gray-400"}`}
          >
            <PackageOpen className="w-6 h-6" />
          </button>

          {showCategoryDropdown && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-2xl rounded-2xl w-48 p-2 animate-in slide-in-from-bottom-2">
              <p className="text-[10px] font-bold text-gray-400 px-3 py-1 uppercase tracking-widest">Categories</p>
              {categories.map((cat) => (
                <div key={cat} onClick={() => handleCategoryClick(cat)} className="p-3 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700">
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => navigate(`/profile/${user?._id}`)}
          className={`p-0.5 rounded-full border-2 transition-all ${isActive(`/profile/${user?._id}`) ? "border-black" : "border-transparent grayscale"}`}
        >
          <Avatar className="w-7 h-7">
            <AvatarImage src={user?.profilePicture} />
          </Avatar>
        </button>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;