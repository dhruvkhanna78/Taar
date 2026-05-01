import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const Post = ({ post, theme }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const [text, setText] = useState("");
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  // Local states for instant UI feedback
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [animateLike, setAnimateLike] = useState(false);
  const isFollowing = user?.following?.includes(post.author?._id);

  const dispatch = useDispatch();

  // Sync internal state when post prop changes
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

    // Optimistic UI Update
    const prevLiked = liked;
    const prevPostLike = postLike;
    setLiked(!liked);
    setPostLike(liked ? postLike - 1 : postLike + 1);

    try {
      const res = await axios.get(
        `https://taar-server.onrender.com/api/v1/post/${post._id}/${action}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id],
              }
            : p,
        );
        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      // Rollback on error
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
            ? user.following.filter((id) => id !== post.author._id)
            : [...user.following, post.author._id],
        },
      });

      await axios.post(
        `https://taar-server.onrender.com/api/v1/user/followorunfollow/${post.author._id}`,
        {},
        { withCredentials: true },
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
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p,
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
        { withCredentials: true },
      );
      if (res.data.success) {
        dispatch(setPosts(posts.filter((p) => p._id !== post._id)));
        toast.success("Post deleted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // Logic for media count
  const mediaItems = [];
  if (post.video) mediaItems.push({ type: "video", url: post.video });
  if (post.image)
    post.image.forEach((img) => mediaItems.push({ type: "image", url: img }));

  return (
    <div
      className={`select-none my-8 w-full max-w-sm mx-auto pb-4 rounded-xl transition`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-bold text-sm select-text">
            {post.author?.username}
          </h1>
          {user._id !== post.author?._id &&
            (!isFollowing ? (
              <Button
                onClick={followHandler}
                variant="ghost"
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold ml-5 active:scale-95 transition-transform"
              >
                Follow
              </Button>
            ) : (
              <Button
                onClick={followHandler}
                variant="ghost"
                className="bg-black/20 text-gray px-3 py-1 rounded text-xs font-semibold ml-5 active:scale-95 transition-transform"
              >
                Unfollow
              </Button>
            ))}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {user._id !== post.author?._id && (
              <Button
                onClick={followHandler}
                variant="ghost"
                className="w-full text-[#ED4596] font-bold"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
            <Button variant="ghost" className="w-full">
              Add to favourites
            </Button>
            {user._id === post.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="w-full text-red-500"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Media Slider */}
      {mediaItems.length > 0 && (
        <div className="relative group">
          {theme?.icon && (
            <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-1 rounded-full shadow">
              <theme.icon className={`w-4 h-4 ${theme.accent}`} />
            </div>
          )}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded bg-black aspect-square items-center"
          >
            {mediaItems.map((item, idx) => (
              <div
                key={idx}
                className="w-full h-full flex-shrink-0 snap-center"
              >
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {mediaItems.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {mediaItems.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    activeIndex === idx ? "bg-white scale-110" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions Section */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-4">
          <div
            onClick={likeOrDislikeHandler}
            className={`cursor-pointer transition-transform active:scale-90 ${animateLike ? "scale-125" : ""}`}
          >
            {liked ? (
              // Agar like hai toh theme ka accent color use hoga (e.g., Purple for Entertainment)
              <FaHeart
                className={`${theme?.accent || "text-red-500"}`}
                size={22}
              />
            ) : (
              // Border waala heart bhi thoda theme ke hisaab se subtle dikh sakta hai
              <FaRegHeart className="text-gray-600" size={22} />
            )}
          </div>

          {/* Message aur Send icon ko bhi theme touch de sakte hain */}
          <MessageCircle
            onClick={() => setOpened(true)}
            className={`cursor-pointer text-gray-600`}
            size={22}
          />
          <Send className="cursor-pointer text-gray-600" size={22} />
        </div>
        <Bookmark className="cursor-pointer text-gray-600" size={22} />
      </div>

      {/* Comment Input Section (Post Button color change) */}
      <div className="flex items-center justify-between mt-2 border-t pt-2 border-gray-100/20">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHAndler}
          className="outline-none text-sm w-full bg-transparent placeholder:opacity-50"
        />
        {text.trim() && (
          <button
            onClick={commentHandler}
            className={`font-semibold text-sm ml-2 ${theme?.accent || "text-[#3BADF8]"}`}
          >
            Post
          </button>
        )}
      </div>

      {/* Post Info */}
      <div className="mt-2">
        <span className="font-bold text-sm block">{postLike} likes</span>
          <p className="text-sm mt-1">
            <span className="font-bold mr-2">{post.author?.username}</span>

            <span className="select-text">
              {expanded || post.caption.length <= 120
                ? post.caption
                : post.caption.slice(0, 120) + "..."}
            </span>

            {post.caption.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-2 text-gray-500 font-semibold"
              >
                {expanded ? "See less" : "See more"}
              </button>
            )}
          </p>
        {comments.length > 0 && (
          <span
            onClick={() => setOpened(true)}
            className="text-gray-500 text-sm cursor-pointer mt-1 block"
          >
            View all {comments.length} comments
          </span>
        )}
      </div>

      <CommentDialog
        open={opened}
        setOpen={setOpened}
        post={{ ...post, comments }}
        commentHandler={commentHandler}
        text={text}
        setText={setText}
      />

      {comments.length > 0 && (
        <div className="text-sm mt-1">
          <span className="font-bold mr-2">{comments[0].author?.username}</span>
          {comments[0].text}
        </div>
      )}

      {/* Comment Input */}
      <div className="flex items-center justify-between mt-2 border-t pt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHAndler}
          className="outline-none text-sm w-full bg-transparent"
        />
        {text.trim() && (
          <button
            onClick={commentHandler}
            className="text-[#3BADF8] font-semibold text-sm ml-2"
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
