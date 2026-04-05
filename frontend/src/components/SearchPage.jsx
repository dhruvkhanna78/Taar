import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { useSelector } from 'react-redux';

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const posts = useSelector((store) => store.post.posts);
    const filteredPosts = posts.filter((post) => post.caption?.toLowerCase().includes(query.toLowerCase()));
    return (
        <div className="mx-10 my-10 max-w-md"> {/* Container width control karne ke liye */}
            <div className="relative flex items-center group">
                {/* Search Icon - Left side par fixed */}
                <IoSearch className="absolute left-3 text-gray-400 group-focus-within:text-blue-500 transition-colors text-[1.2rem]" />

                <input
                    type="text"
                    name='query'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search everything..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                       focus:bg-white transition-all duration-300 text-sm shadow-sm"
                />
            </div>

            {/* Search results section */}
            <div className="w-full md:w-[80%]">
                {query && filteredPosts.length === 0 && (
                    <p className="text-gray-500 mt-4 text-center">No results found for "{query}"</p>
                )}

                {query.trim() !== "" && filteredPosts.map((post) => {
                    return (
                        <div key={post._id} className="border rounded p-4 mb-3">

                            <p className="font-semibold">{post.author?.username}</p>

                            <img
                                src={post.image}
                                alt="post"
                                className="w-full rounded my-2"
                            />

                            <p>{post.caption}</p>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SearchPage