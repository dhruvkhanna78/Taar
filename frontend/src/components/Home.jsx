import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import useGetAllPost from "../hooks/useGetAllPost";

const Home = () => {
  useGetAllPost();

  return (
    // justify-center zaroori hai desktop centering ke liye
    <div className="w-full min-h-screen bg-gray-50 flex justify-center">

      {/* Feed Container: Mobile par w-full, desktop par max-width */}
      <div className="w-full md:max-w-2xl">
        <Feed />
        <Outlet />
      </div>

      {/* Right Sidebar (Desktop only) */}
      <div className="hidden lg:block w-[320px] border-l border-gray-200 bg-white">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;