import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import useGetAllPost from "../hooks/useGetAllPost";

const Home = () => {
  useGetAllPost();

  return (
    <div className="w-full min-h-screen bg-gray-50 flex">

      {/* Feed */}
      <div className="w-full lg:max-w-2xl lg:mx-auto">
        <Feed />
        <Outlet />
      </div>

      {/* Sidebar (desktop only) */}
      <div className="hidden lg:block w-[320px] border-l border-gray-200">
        <RightSideBar />
      </div>

    </div>
  );
};

export default Home;