import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post);
  return (
    // Mobile par w-full (zero margins), tablet/desktop par centering
    <div className="w-full sm:max-w-xl sm:mx-auto">
      {
        posts.map((post) => <Post key={post._id} post={post}/>)
      }
    </div>
  )
}

export default Posts;