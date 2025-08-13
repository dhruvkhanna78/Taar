import React, { useState, useEffect } from "react";

const CommentDialog = ({ open, setOpen }) => {
  const [commentText, setCommentText] = useState("");

  const comments = [
    {
      id: 1,
      username: "username",
      text: "comments ayenge",
      avatar:
        "https://img.daisyui.com/images/profile/demo/3@94.webp",
    },
    {
      id: 2,
      username: "anotheruser",
      text: "Yeh ek aur comment hai, scroll test ke liye.",
      avatar:
        "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      username: "user3",
      text: "Aur bhi comments add kar sakte hain.",
      avatar:
        "https://randomuser.me/api/portraits/women/44.jpg",
    },
    // Aur comments add kar sakte ho...
  ];

  const sendMessageHandler = async() => {
    alert(text);
  }

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Prevent scroll propagation to parent (photo) when at scroll edges in comments
  const handleScroll = (e) => {
    const el = e.currentTarget;
    const isScrollTop = el.scrollTop === 0;
    const isScrollBottom = Math.ceil(el.scrollHeight - el.scrollTop) === el.clientHeight;

    if ((isScrollTop && e.deltaY < 0) || (isScrollBottom && e.deltaY > 0)) {
      e.preventDefault();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] flex overflow-hidden shadow-2xl">
        
        {/* Left side image */}
        <div className="w-1/2 bg-gray-900">
          <img
            src="https://imgs.search.brave.com/jipawE3yrZuBWa2fpLhNDx5tiqrUwRjKLhi9HVO5ZFg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9oYXBw/eS13b21hbi1zdW5z/ZXQtbmF0dXJlLWl3/aXRoLW9wZW4taGFu/ZHMtc3VtbWVyLTk1/MDM4NzAzLmpwZw"
            alt="post"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Right side comments and input */}
        <div className="w-1/2 flex flex-col bg-gray-800 text-white">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-semibold text-white text-lg select-none">
                CN
              </div>
              <span className="font-semibold text-white text-sm tracking-wide">username</span>
            </div>
            <button
              className="text-gray-400 font-bold text-3xl leading-none hover:text-white transition"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Comments list */}
          <div
            className="flex-1 overflow-y-auto px-6 py-4 space-y-5 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
            onWheel={handleScroll}
          >
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 items-start">
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <span className="font-semibold text-white text-sm">{comment.username}</span>
                  <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add comment input */}
          <div className="p-4 border-t border-gray-700 flex gap-3 bg-gray-800">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition"
              disabled={!commentText.trim()}
              onClick={() => {
                alert("Comment posted: " + commentText);
                setCommentText("");
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
