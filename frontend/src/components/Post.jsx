import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [opened, setOpened] = useState(false);
  const {user} = useSelector(store => store.auth);
  const {posts} = useSelector(store => store.post);
  const [liked , setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const dispatch = useDispatch();

  const changeEventHAndler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  const likeOrDislikeHandler = async () => {
    try{
      const action = liked ? "dislike" : "like";
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, {
        withCredentials: true,
      });
      if(res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes)
        setLiked(!liked);
        const updatedPosts = posts.map(p =>  p._id === post._id ? {
          ...p,
          likes : liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
        } : p);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message || `Post ${action}d successfully`);
      }
    } catch(error){
      console.log(error);
    }
  }

  const commentHandler = async () => {
    try{
      const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, {text}, {
        headers:{
          'Content-Type': 'application/json',
        },        withCredentials: true,
      })
      if(res.data.success) {
        const updatedCommentData = [...comments, res.data.comment];
        setComments(updatedCommentData);

        const updatedPostData = posts.map(p => p._id  === post._id ? {...p, comments: updatedCommentData} : p);

           dispatch(setPosts(updatedPostData));

        toast.success(res.data.message || "Comment added successfully");
        setText("");
      }
    } catch(error){
      console.log(error);
    }
  }

  const deletePostHandler = async () => {
    try{
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`, {
        withCredentials: true,
      });
      if(res.data.success) {
        const updatedPosts = posts.filter((postItem) => postItem?._id !== post._id);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message || "Post deleted successfully");
      }
    } catch(error) {
      console.log(error);  
      toast.error(error.response.data.message || "Something went wrong");
    }
  }

  return (
    <div className=' select-none my-8 w-full max-w-sm mx-auto'>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt='post_image' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className='select-text'>{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className='flex flex-col items-center text-sm text-center caret-transparent select-none'>

           {
             user && user._id !== post?.author._id && <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4596] font-bold'>Unfollow</Button>
          }
            <Button variant='ghost' className='cursor-pointer w-fit'>Add to favourites</Button>
            
            {
              user && user._id === post?.author._id &&
              <Button variant='ghost' 
              className='cursor-pointer w-fit'
              onClick={deletePostHandler}
              >Delete</Button>
            }
            
          </DialogContent>
        </Dialog>
      </div>
      <img className='rounded-sm my-2 w-full aspect-square object-cover' src={post.image} alt="post_img" />
      <div className='flex justify-between items-center my-2'>
        <div className=''>

          {liked ? <FaHeart onClick={likeOrDislikeHandler} className='inline cursor-pointer text-red-500' size={20} /> : 
          <FaRegHeart onClick={likeOrDislikeHandler} className='inline cursor-pointer' size={20} />}

          <MessageCircle onClick={() => setOpened(true)} className='inline ml-4 cursor-pointer' size={20} />
          <Send className='inline ml-4 cursor-pointer' size={20} />
        </div>
        <Bookmark className='inline float-right cursor-pointer' size={20} />
      </div>
      <span className='font-med block mb-2'>{postLike} likes</span>
      <p className='select-text'>
        <span className='font-medium mr-2'>{post.author?.username || "Unknown"}</span>
        {post.caption}
      </p>
      <span onClick={() => setOpened(true)}>View all {comments.length} comments</span>
      <CommentDialog open={opened} setOpen={setOpened} />
      <div className='mt-1 pt-2 flex items-center gap-2'>
        <input type="text" placeholder='Add a comment' value={text} onChange={changeEventHAndler} className='outline-none text-sm w-full' />
        {
          text && <span onClick={commentHandler} className='text-[#3BADF8]'>Post</span>
        }
      </div>
    </div>
  )
}

export default Post
