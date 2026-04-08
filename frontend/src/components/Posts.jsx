import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post);
  return (
    // Max width set ki hai taaki posts desktop par bahut zyada fail na jayein
    <div className='max-w-md mx-auto px-2 md:px-0'>
      {
        posts.map((post) => <Post key={post._id} post={post}/>)
      }
    </div>
  )
}

export default Posts;