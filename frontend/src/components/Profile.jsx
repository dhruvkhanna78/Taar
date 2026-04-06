import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // useDispatch add kiya
import { Button } from "./ui/button";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { setUserProfile } from "@/redux/authSlice"; // Import profile setter

const Profile = () => {
  const { id: userId } = useParams();
  const dispatch = useDispatch();

  // fetch profile logic
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);

  // FIX: Compare Logged-in User ID with URL Parameter ID instead of store profile ID
  // Isse hamesha accurate pata chalega ki aap apni profile par ho ya nahi
  const isLoggedInUserProfile = user?._id?.toString() === userId?.toString();

  const isFollowing =
    userProfile?.followers?.includes(user?._id) || false;

  // Cleanup effect: Jab user profile page se jaye ya dusre profile par jump kare, 
  // toh purana state clear ho jaye taaki wrong data na dikhe.
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

  // Loading state remains exactly as before
  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  const handleFollow = async () => {
    try {
      const followers = userProfile.followers || [];
      const following = user.following || [];

      const updatedFollowers = isFollowing
        ? followers.filter(id => id !== user._id)
        : [...followers, user._id];

      const updatedFollowing = isFollowing
        ? following.filter(id => id !== userProfile._id)
        : [...following, userProfile._id];

      // update profile followers instantly
      dispatch(
        setUserProfile({
          ...userProfile,
          followers: updatedFollowers,
        })
      );

      // update logged-in user following instantly
      dispatch({
        type: "auth/setAuthUser",
        payload: {
          ...user,
          following: updatedFollowing,
        },
      });

      await axios.post(
        `https://taar-server.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };
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
                {userProfile.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </section>

          {/* Info */}
          <section className="flex-1">
            <div className="flex flex-col gap-5">

              {/* Username + buttons */}
              <div className="flex items-center gap-4">
                <span className="text-xl font-semibold">
                  {userProfile.username}
                </span>

                {isLoggedInUserProfile ? (
                  <Link to="/profile/edit">
                    <Button variant="secondary">Edit profile</Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleFollow}
                    className={`px-4 py-1 text-sm font-semibold ${isFollowing
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
                    {userProfile.followers?.length || 0}
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
                  {userProfile.bio || "No bio yet..."}
                </span>

                <div className="flex items-center gap-1 bg-gray-100 w-fit px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                  <AtSign size={14} />
                  <span>{userProfile.username}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* TABS */}
        <div className="border-t border-t-gray-200 mt-4">

          <div className="flex items-center justify-center gap-12 text-xs font-semibold tracking-widest">

            <span
              className={`py-4 cursor-pointer border-t ${activeTab === "posts"
                ? "border-black text-black"
                : "border-transparent text-gray-400"
                }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>

            <span
              className={`py-4 cursor-pointer border-t ${activeTab === "saved"
                ? "border-black text-black"
                : "border-transparent text-gray-400"
                }`}
              onClick={() => handleTabChange("saved")}
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
                  className="relative group cursor-pointer aspect-square overflow-hidden bg-gray-100"
                >
                  <img
                    src={
                      Array.isArray(post.image)
                        ? post.image[0]
                        : post.image?.split(",")[0]
                    }
                    className="w-full h-full object-cover"
                    alt="post"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-6">

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