import React, { useState, useRef, useEffect } from 'react';
import ImageFallback from './ImageFallback';
import CommentDialog from './CommentDialog';

const Post = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleMenuClick = (option) => {
    alert(`${option} clicked`);
    setShowMenu(false);
  };

  return (
    <div className='my-20 w-full max-w-sm mx-auto relative' style={{ fontSize: '14px' }}>
      {/* User Header */}
      <div className='flex items-center gap-2 mb-2'>
        <ImageFallback
          src='https://img.daisyui.com/images/profile/demo/batperson@192.webp'
          fallbackSrc='https://t4.ftcdn.net/jpg/11/28/72/75/240_F_1128727502_ce2UdfqSn42Ia48OeSy7a6UBX590HZnJ.jpg'
          alt='Profile'
          className="w-8 h-8 rounded-full overflow-hidden"
        />
        <h1 className='font-semibold'>Yellow BAT-MAN</h1>
        <button className="btn btn-outline btn-success flex gap-2 items-center border-none">Follow</button>
      </div>

      {/* 3 dots menu icon top-right */}
      <div className="absolute top-2 right-2 cursor-pointer text-xl font-bold select-none" title="Options" onClick={() => setShowMenu(prev => !prev)}>
        &#x22EE; {/* Vertical ellipsis unicode */}
      </div>

      {/* Dropdown menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute top-8 right-2 bg-gray-800 text-white rounded shadow-lg w-40 z-50"
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition"
            onClick={() => handleMenuClick('Edit Post')}
          >
            Edit Post
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition"
            onClick={() => handleMenuClick('Delete Post')}
          >
            Delete Post
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition"
            onClick={() => handleMenuClick('Report Post')}
          >
            Report Post
          </button>
        </div>
      )}

      {/* Post Image */}
      <img
        className='rounded-sm my-2 w-full aspect-square object-cover'
        src="https://imgs.search.brave.com/LZVvz2m6dEdxABLGXG0gsI8DRnezcqYeh1zPBYF3tc4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA"
        alt="post_img"
      />

      {/* Action Icons */}
      <div className='relative flex my-5' style={{ width: '380px', height: '30px', fontSize: '24px' }}>
        <div className='flex gap-5 absolute left-0 top-0 px-3'>
          <i className="fi fi-rs-heart cursor-pointer"></i>
          <i className="fi fi-rr-comment-alt cursor-pointer" onClick={() => setOpen(true)}></i>
          <i className="fi fi-rs-paper-plane cursor-pointer"></i>
        </div>
        <div className='absolute right-0 top-0 px-3'>
          <i className="fi fi-rr-bookmark cursor-pointer"></i>
        </div>
      </div>

      {/* Likes & Caption */}
      <span className='font-medium mb-2 block -mt-3'>100k likes</span>
      <p>
        <span className='font-medium mr-2'>username</span>
        caption
      </p>

      {/* View Comments */}
      <span className="text-blue-500 cursor-pointer" onClick={() => setOpen(true)}>
        View all comments
      </span>

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add Comment */}
      <div className='flex mt-3'>
        <input
          type='text'
          placeholder='Add a comment!'
          value={text}
          onChange={changeEventHandler}
          className='outline-none text-sm w-full'
        />
        {text && <span className="text-blue-500 cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;
