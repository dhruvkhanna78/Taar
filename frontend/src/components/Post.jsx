import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';

const Post = ({ post, theme }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const [text, setText] = useState("");
  const [opened, setOpened] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);

  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [animateLike, setAnimateLike] = useState(false);
  const isFollowing = user?.following?.includes(post.author?._id);

  const dispatch = useDispatch();

  useEffect(() => {
    setLiked(post.likes.includes(user?._id));
    setPostLike(post.likes.length);
    setComments(post.comments);
  }, [post, user?._id]);

  if (!user) return null;

  const changeEventHAndler = (e) => {
    setText(e.target.value);
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, offsetWidth } = sliderRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveIndex(index);
    }
  };

  const likeOrDislikeHandler = async () => {
    const action = liked ? "dislike" : "like";
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);

    const prevLiked = liked;
    const prevPostLike = postLike;
    setLiked(!liked);
    setPostLike(liked ? postLike - 1 : postLike + 1);

    try {
      const res = await axios.get(
        `https://taar-server.onrender.com/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = posts.map(p =>
          p._id === post._id
            ? {
              ...p,
              likes: liked
                ? p.likes.filter(id => id !== user?._id)
                : [...p.likes, user?._id],
            }
            : p
        );
        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      setLiked(prevLiked);
      setPostLike(prevPostLike);
      toast.error("Failed to update like");
    }
  };

  const followHandler = async () => {
    try {
      dispatch({
        type: "auth/setAuthUser",
        payload: {
          ...user,
          following: isFollowing
            ? user.following.filter(id => id !== post.author._id)
            : [...user.following, post.author._id],
        },
      });

      await axios.post(
        `https://taar-server.onrender.com/api/v1/user/followorunfollow/${post.author._id}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const commentHandler = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `https://taar-server.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);
        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success("Comment added");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://taar-server.onrender.com/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setPosts(posts.filter(p => p._id !== post._id)));
        toast.success("Post deleted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const mediaItems = [];
  if (post.video) mediaItems.push({ type: 'video', url: post.video });
  if (post.image) post.image.forEach(img => mediaItems.push({ type: 'image', url: img }));

  return (
    <div className="select-none my-6 w-full max-w-md mx-auto pb-4 bg-white border-b border-gray-100 md:rounded-xl md:border md:shadow-sm transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border">
            <AvatarImage src={post.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className='font-bold text-sm select-text'>{post.author?.username}</h1>
          {user._id !== post.author?._id && (
            <Button
              onClick={followHandler}
              variant="ghost"
              className={`px-3 py-1 h-7 rounded-full text-xs font-bold ml-2 transition-all ${isFollowing ? 'bg-gray-100 text-black' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer text-gray-500 hover:text-black transition' />
          </DialogTrigger>
          <DialogContent className='flex flex-col items-center text-sm text-center p-4 rounded-xl'>
            {user._id !== post.author?._id && (
              <Button onClick={followHandler} variant="ghost" className="w-full text-[#ED4596] font-bold">
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
            <Button variant='ghost' className='w-full'>Add to favourites</Button>
            {user._id === post.author?._id && (
              <Button onClick={deletePostHandler} variant='ghost' className='w-full text-red-500 font-bold'>Delete</Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Media Slider */}
      {mediaItems.length > 0 && (
        <div className="relative aspect-square w-full bg-black overflow-hidden md:rounded-lg">
          {theme?.icon && (
            <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-sm">
              <theme.icon className={`w-4 h-4 ${theme.accent}`} />
            </div>
          )}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full h-full items-center"
          >
            {mediaItems.map((item, idx) => (
              <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center">
                {item.type === 'video' ? (
                  <video src={item.url} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>

          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
              {mediaItems.map((_, idx) => (
                <div key={idx} className={`h-1.5 w-1.5 rounded-full transition-all ${activeIndex === idx ? "bg-white scale-125" : "bg-white/40"}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions Section */}
      <div className="px-3">
        <div className='flex justify-between items-center mt-3'>
          <div className='flex items-center gap-4'>
            <div onClick={likeOrDislikeHandler} className={`cursor-pointer transition-transform active:scale-90 ${animateLike ? 'scale-125' : ''}`}>
              {liked ? <FaHeart className={`${theme?.accent || 'text-red-500'}`} size={24} /> : <FaRegHeart className="text-gray-700" size={24} />}
            </div>
            <MessageCircle onClick={() => setOpened(true)} className='cursor-pointer text-gray-700 hover:text-black transition' size={24} />
            <Send className='cursor-pointer text-gray-700 hover:text-black transition' size={24} />
          </div>
          <Bookmark className='cursor-pointer text-gray-700 hover:text-black transition' size={24} />
        </div>

        {/* Post Info */}
        <div className='mt-2'>
          <span className='font-bold text-sm block'>{postLike.toLocaleString()} likes</span>
          <p className='text-sm mt-1 leading-snug'>
            <span className='font-bold mr-2'>{post.author?.username}</span>
            <span className='select-text text-gray-800'>{post.caption}</span>
          </p>
          {comments.length > 0 && (
            <button onClick={() => setOpened(true)} className='text-gray-500 text-sm font-medium mt-1 block hover:underline'>
              View all {comments.length} comments
            </button>
          )}
        </div>

        {/* Smallest Comment Preview */}
        {comments.length > 0 && (
          <div className="text-sm mt-1 flex gap-2">
            <span className="font-bold">{comments[0].author?.username}</span>
            <span className="text-gray-700 truncate">{comments[0].text}</span>
          </div>
        )}

        {/* Inline Comment Input - Hidden on very small screens or optimized for focus */}
        <div className='flex items-center justify-between mt-3 border-t border-gray-50 pt-3'>
          <input
            type="text"
            placeholder='Add a comment...'
            value={text}
            onChange={changeEventHAndler}
            className='outline-none text-sm w-full bg-transparent placeholder:text-gray-400'
          />
          {text.trim() && (
            <button 
              onClick={commentHandler} 
              className={`font-bold text-sm ml-2 transition-colors ${theme?.accent || 'text-blue-500'}`}
            >
              Post
            </button>
          )}
        </div>
      </div>

      <CommentDialog
        open={opened}
        setOpen={setOpened}
        post={{ ...post, comments }}
        commentHandler={commentHandler}
        text={text}
        setText={setText}
      />
    </div>
  );
};

export default Post;