import React, { useState, useEffect, useRef } from 'react';
import Post from './Post';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const fetchedRef = useRef(false); // prevent double fetch

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/v1/post/all?category=entertainment",
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="my-20 w-full max-w-sm mx-auto">
      {posts.length > 0 ? (
        posts.map(post => <Post key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">No posts found</p>
      )}
    </div>
  );
};

export default Posts;
