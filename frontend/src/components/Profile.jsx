import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { AtSign, Heart, MessageCircle, MoreHorizontal, LogOut } from "lucide-react";
import { setUserProfile, setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";

const Profile = () => {
  const { id: userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("posts");
  const [menuOpen, setMenuOpen] = useState(false);

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile =
    user?._id?.toString() === userId?.toString();

  const isFollowing =
  userProfile?.follower?.some(
    id => id.toString() === user?._id?.toString()
  ) || false;

  useEffect(() => {
    return () => {
      dispatch(setUserProfile(null));
    };
  }, [userId, dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts"
      ? userProfile?.posts
      : userProfile?.bookmarks;

  const logoutHandler = async () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/logout`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setUserProfile(null));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed"
      );
    }
  };

  const handleFollow = async () => {
  try {
    const followers = userProfile.follower || [];
    const following = user.following || [];

    const isAlreadyFollowing = followers.some(
      (id) => id.toString() === user._id.toString()
    );

    const updatedFollowers = isAlreadyFollowing
      ? followers.filter(
          (id) => id.toString() !== user._id.toString()
        )
      : [...followers, user._id];

    const updatedFollowing = isAlreadyFollowing
      ? following.filter(
          (id) =>
            id.toString() !== userProfile._id.toString()
        )
      : [...following, userProfile._id];

    dispatch(
      setUserProfile({
        ...userProfile,
        follower: updatedFollowers,
      })
    );

    dispatch(
      setAuthUser({
        ...user,
        following: updatedFollowing,
      })
    );

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/user/followorunfollow/${userProfile._id}`,
      {},
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
    toast.error("Follow update failed");
  }
};

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20">

          {/* Avatar */}
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border">
              <AvatarImage
                src={userProfile.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>
                {userProfile.username
                  ?.slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </section>

          {/* Info */}
          <section className="flex-1">
            <div className="flex flex-col gap-5">

              {/* Username row */}
              <div className="flex items-center gap-4 relative">

                <span className="text-xl font-semibold">
                  {userProfile.username}
                </span>

                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/profile/edit">
                      <Button variant="secondary">
                        Edit profile
                      </Button>
                    </Link>

                    {/* 3 dots menu */}
                    <div className="relative">
                      <MoreHorizontal
                        className="cursor-pointer"
                        onClick={() =>
                          setMenuOpen(!menuOpen)
                        }
                      />

                      {menuOpen && (
                        <div className="absolute right-0 top-7 bg-white shadow-lg border rounded-lg w-36 z-50">
                          <button
                            onClick={logoutHandler}
                            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-sm"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={handleFollow}
                    className={`px-4 py-1 text-sm font-semibold ${
                      isFollowing
                        ? "bg-gray-200 text-black"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 text-base">
                <p>
                  <span className="font-bold">
                    {userProfile.posts?.length || 0}
                  </span>{" "}
                  posts
                </p>

                <p>
                  <span className="font-bold">
                    {userProfile.follower?.length || 0}
                  </span>{" "}
                  followers
                </p>

                <p>
                  <span className="font-bold">
                    {userProfile.following?.length || 0}
                  </span>{" "}
                  following
                </p>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-bold">
                  {userProfile.bio ||
                    "No bio yet..."}
                </span>

                <div className="flex items-center gap-1 bg-gray-100 w-fit px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                  <AtSign size={14} />
                  <span>
                    {userProfile.username}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* TABS */}
        <div className="border-t border-gray-200 mt-4">

          <div className="flex justify-center gap-12 text-xs font-semibold tracking-widest">

            <span
              onClick={() =>
                handleTabChange("posts")
              }
              className={`py-4 cursor-pointer border-t ${
                activeTab === "posts"
                  ? "border-black text-black"
                  : "border-transparent text-gray-400"
              }`}
            >
              POSTS
            </span>

            <span
              onClick={() =>
                handleTabChange("saved")
              }
              className={`py-4 cursor-pointer border-t ${
                activeTab === "saved"
                  ? "border-black text-black"
                  : "border-transparent text-gray-400"
              }`}
            >
              SAVED
            </span>

          </div>

          {/* GRID */}
          <div className="grid grid-cols-3 gap-1 md:gap-4">

            {displayedPost?.length > 0 ? (
              displayedPost.map((post) => (
                <div
                  key={post._id}
                  className="relative group aspect-square overflow-hidden"
                >
                  <img
                    src={
                      Array.isArray(post.image)
                        ? post.image[0]
                        : post.image
                    }
                    className="w-full h-full object-cover"
                    alt="post"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <div className="flex items-center gap-6 text-white">

                      <div className="flex items-center gap-2 font-bold">
                        <Heart fill="white" />
                        {post.likes?.length || 0}
                      </div>

                      <div className="flex items-center gap-2 font-bold">
                        <MessageCircle fill="white" />
                        {post.comments?.length || 0}
                      </div>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-400 py-10">
                No posts yet
              </p>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;