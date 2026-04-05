import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import useSearchUsers from "@/hooks/useSearchUsers";
import Post from "./Post";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  useSearchUsers(query);

  const users = useSelector((state) => state.user.users);
  const posts = useSelector((state) => state.post.posts);

  const filteredPosts = posts.filter((post) =>
    post.caption?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-10 my-10 max-w-md"> {/* Container width control karne ke liye */}
      <div className="relative flex items-center group">
        {/* Search Icon - Left side par fixed */}
        <IoSearch className="absolute left-3 text-gray-400 group-focus-within:text-blue-500 transition-colors text-[1.2rem]" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-[#e5eaf2] absolute top-[2px] left-[3px] h-[90%] w-[85%] py-3 px-4 outline-none rounded-full"
        />

        <IoSearch className="text-[1.3rem] text-white ml-auto" />
      </div>

      {/* Results */}
      {query.trim() !== "" && (
        <div className="w-full md:w-[80%]">

          {/* Profiles */}
          {users.length > 0 && (
            <>
              <h2 className="font-semibold mb-2">Profiles</h2>

              {users.map((user) => (
                <div key={user._id}>
                  {user.username}
                </div>
              ))}
            </>
          )}

          {/* Posts */}
          {filteredPosts.length > 0 && (
            <>
              <h2 className="font-semibold mt-4 mb-2">Posts</h2>

              {filteredPosts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;