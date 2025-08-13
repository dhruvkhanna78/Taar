import React, { useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="ml-64 flex-1 bg-[#0f0f0f] min-h-screen text-white p-6 overflow-x-hidden">
      {/* Profile Header */}
      <div className="flex items-center gap-10 pb-10 border-b border-gray-700">
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">taar_user</h2>
            <button className="bg-gray-800 px-4 py-1 rounded-md text-sm hover:bg-gray-700">
              Edit profile
            </button>
            <button className="bg-gray-800 px-4 py-1 rounded-md text-sm hover:bg-gray-700">
              Share profile
            </button>
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <span>
              <b>112</b> posts
            </span>
            <span>
              <b>3,842</b> followers
            </span>
            <span>
              <b>521</b> following
            </span>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Taar</p>
            <p className="text-gray-400 text-sm">Building cool things on the internet 🛠✨</p>
            <a href="https://taar.app.link" className="text-blue-400 text-sm">
              taar.app.link
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-12 border-t border-gray-700 mt-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`py-3 uppercase tracking-wider text-sm font-semibold ${
            activeTab === "posts" ? "border-t-2 border-white" : "text-gray-400"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("reels")}
          className={`py-3 uppercase tracking-wider text-sm font-semibold ${
            activeTab === "reels" ? "border-t-2 border-white" : "text-gray-400"
          }`}
        >
          Reels
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-1 mt-1">
        {activeTab === "posts"
          ? [...Array(9)].map((_, i) => (
              <img
                key={i}
                src={`https://picsum.photos/500/500?random=${i}`}
                alt={`post-${i}`}
                className="w-full aspect-square object-cover"
              />
            ))
          : [...Array(6)].map((_, i) => (
              <video
                key={i}
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                className="w-full aspect-square object-cover"
                controls
              />
            ))}
      </div>
    </div>
  );
};

export default Profile;
