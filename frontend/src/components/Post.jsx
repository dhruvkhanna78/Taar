import { useRef, useState } from "react";
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

  const dispatch = useDispatch();

  if (!user) return null;

  const changeEventHAndler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  }

  const handleScroll = () => {
    const container = sliderRef.current;
    const scrollLeft = container.scrollLeft;
    const width = container.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  const likeOrDislikeHandler = async () => {
    const action = liked ? "dislike" : "like";

    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);

    const prevLiked = liked;
    const prevPostLike = postLike;

    const updatedLikes = liked ? postLike - 1 : postLike + 1;
    setPostLike(updatedLikes);
    setLiked(!liked);

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

    try {
      const res = await axios.get(
        `https://taar-server.onrender.com/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (!res.data.success) throw new Error();

    } catch (error) {
      setPostLike(prevPostLike);
      setLiked(prevLiked);

      const rollbackPosts = posts.map(p =>
        p._id === post._id
          ? {
            ...p,
            likes: prevLiked
              ? [...p.likes, user?._id]
              : p.likes.filter(id => id !== user?._id),
          }
          : p
      );

      dispatch(setPosts(rollbackPosts));
      toast.error("Something went wrong");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://taar-server.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comments, res.data.comment];
        setComments(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p?._id === post?._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message || "Comment added successfully");
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://taar-server.onrender.com/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = posts.filter(
          (postItem) => postItem?._id !== post._id
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message || "Post deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='select-none my-8 w-full max-w-sm mx-auto'>

      {/* Header */}
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
              user && user._id !== post?.author?._id &&
              <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4596] font-bold'>
                Unfollow
              </Button>
            }

            <Button variant='ghost' className='cursor-pointer w-fit'>
              Add to favourites
            </Button>

            {
              user && user._id === post?.author?._id &&
              <Button
                variant='ghost'
                className='cursor-pointer w-fit'
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            }
          </DialogContent>
        </Dialog>
      </div>

      {/* Image */}
      {post.image?.length > 0 && (
        <div className="relative">
          {/* Slider */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            {post.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="post_img"
                className="w-full aspect-square object-cover snap-center flex-shrink-0"
              />
            ))}
          </div>

          {/* Dots */}
          {post.image.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {post.image.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${activeIndex === index
                      ? "bg-white"
                      : "bg-white/40"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className='flex justify-between items-center my-2'>
        <div>
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              className={`inline cursor-pointer text-red-500 
transition-all duration-150 ease-out 
hover:scale-110 hover:-translate-y-0.5 
active:scale-90 active:translate-y-0 
${animateLike ? "scale-125" : "scale-100"}`}
              size={20}
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              className='inline cursor-pointer 
transition-all duration-150 ease-out 
hover:scale-110 hover:-translate-y-0.5 
active:scale-90 active:translate-y-0'
              size={20}
            />
          )}

          <MessageCircle
            onClick={() => setOpened(true)}
            className='inline ml-4 cursor-pointer'
            size={20}
          />

          <Send className='inline ml-4 cursor-pointer' size={20} />
        </div>

        <Bookmark className='inline float-right cursor-pointer' size={20} />
      </div>

      {/* Likes */}
      <span className='font-med block mb-2'>{postLike} likes</span>

      {/* Caption */}
      <p className='select-text'>
        <span className='font-medium mr-2'>
          {post.author?.username || "Unknown"}
        </span>
        {post.caption}
      </p>

      {/* Comments */}
      <span
        onClick={() => setOpened(true)}
        className='cursor-pointer'
      >
        View all {comments.length} comments
      </span>

      <CommentDialog open={opened} setOpen={setOpened} post={post} />

      {/* Add Comment */}
      <div className='mt-1 pt-2 flex items-center gap-2'>
        <input
          type="text"
          placeholder='Add a comment'
          value={text}
          onChange={changeEventHAndler}
          className='outline-none text-sm w-full'
        />
        {
          text && (
            <span
              onClick={commentHandler}
              className='text-[#3BADF8] cursor-pointer'
            >
              Post
            </span>
          )
        }
      </div>
    </div>
  );
};

export default Post;