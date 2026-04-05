import React from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/profile/${user._id}`)}
      className="w-full sm:w-[80%] lg:w-[60%] h-[220px] relative overflow-hidden group cursor-pointer rounded-md"
    >
      {/* profile image */}
      <img
        src={user.profilePicture}
        alt={user.username}
        className="w-full h-full object-cover group-hover:scale-[1.1] transition-all duration-700"
      />

      {/* overlay text */}
      <div className="absolute top-[50%] transform group-hover:translate-y-[-50%] transition-all duration-500 w-full h-full left-0 z-20 flex items-center justify-center flex-col">

        <h1 className="text-[1.3rem] font-bold text-white text-center capitalize">
          {user.username}
        </h1>

        <p className="text-center opacity-0 group-hover:opacity-100 transition-all duration-700 text-white text-[0.9rem]">
          {user.fullName}
        </p>

        <button className="bg-gray-400 opacity-0 group-hover:opacity-100 px-3 py-2 mt-3 hover:bg-gray-500 transition-all duration-500 text-white rounded-md text-[0.9rem]">
          View Profile
        </button>

      </div>

      {/* bottom shadow */}
      <div className="w-full opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-b from-[rgba(0,0,0,0.001)] to-[rgba(0,0,0,0.5)] h-full absolute bottom-0 left-0 right-0"></div>
    </div>
  );
};

export default UserCard;