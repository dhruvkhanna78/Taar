import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Post.css';
import API, { BASE_URL } from '../../api';

const Post = ({ user, image, caption, postId, likes = [], onDelete }) => {
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem("userId")?.toString();

    const [likeCount, setLikeCount] = useState(likes.length);
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newCaption, setNewCaption] = useState(caption);
    const [localCaption, setLocalCaption] = useState(caption);

    useEffect(() => {
        const hasLiked = likes.some(id => id.toString() === currentUserId);
        setLiked(hasLiked);
    }, [likes, currentUserId]);

    const handleLike = async () => {
        try {
            const res = await API.put(`/posts/like/${postId}`);
            const updatedLikes = res.data.likes;
            setLikeCount(updatedLikes.length);
            setLiked(updatedLikes.some(id => id.toString() === currentUserId));
        } catch (err) {
            console.error("❌ Error liking post:", err.message);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await API.get(`/posts/${postId}/comments`);
            setComments(res.data.comments);
        } catch (err) {
            console.error("❌ Error fetching comments:", err.message);
        }
    };

    const toggleComments = () => {
        if (!showComments) fetchComments();
        setShowComments(prev => !prev);
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        try {
            await API.post(`/posts/${postId}/comments`, { text: commentText.trim() });
            setCommentText("");
            fetchComments();
        } catch (err) {
            console.error("❌ Error adding comment:", err.message);
        }
    };

    const handleProfileClick = () => {
        const userId = user._id || user.id;
        if (userId) navigate(`/profile/${userId}`);
    };

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await API.delete(`/posts/${postId}`);
            if (onDelete) onDelete(postId);
        } catch (err) {
            console.error("❌ Error deleting post:", err.message);
            alert("Failed to delete post");
        }
    };

    const handleEditCaption = async () => {
        if (newCaption.trim() === "") {
            alert("Caption cannot be empty.");
            return;
        }
        try {
            await API.put(`/posts/update/${postId}`, { caption: newCaption.trim() });
            setLocalCaption(newCaption.trim());
            setIsEditing(false);
        } catch (err) {
            console.error("❌ Failed to update caption", err.message);
            alert("Failed to update caption");
        }
    };

    const normalizeURL = (imgPath) => {
        if (!imgPath) return "";
        const sanitized = imgPath
            .replace(/^\/+/, "")
            .replace("localhost", "192.168.1.3")
            .replace("192.168.1.9", "192.168.1.3"); // ✅ force correct IP
        return sanitized.startsWith("http") ? sanitized : `${BASE_URL}/${sanitized}`;
    };

    const getUserImage = (img) => {
        return normalizeURL(img) || "https://i.pravatar.cc/150?img=1";
    };

    const getPostImage = (img) => {
        return normalizeURL(img) || "https://via.placeholder.com/500x300?text=No+Image";
    };

    const isOwner = user._id && currentUserId && user._id.toString() === currentUserId;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.post-menu-wrapper')) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="feed-post-card">
            {/* User Info */}
            <div className="feed-post-header" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                <img
                    src={getUserImage(user.image || user.profilePic)}
                    alt={user.username || user.name || "user"}
                    className="feed-post-user-pic"
                />
                <span className="feed-post-username" style={{ marginLeft: '8px' }}>
                    {user.username || user.name}
                </span>

                {isOwner && (
                    <div className="post-menu-wrapper" onClick={e => e.stopPropagation()}>
                        <button
                            className="post-menu-button"
                            onClick={() => setMenuOpen(prev => !prev)}
                            aria-label="Post options"
                        >
                            ⋮
                        </button>
                        {menuOpen && (
                            <div className="post-dropdown-menu" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setMenuOpen(false);
                                    }}
                                >
                                    Edit Caption
                                </button>
                                <button onClick={handleDeletePost}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Post Image */}
            <img src={getPostImage(image)} alt="post" className="feed-post-image" />

            {/* Action Icons */}
            <div className="feed-post-actions">
                <i
                    className={liked ? "fi fi-ss-heart" : "fi fi-rs-heart"}
                    onClick={handleLike}
                    style={{
                        cursor: 'pointer',
                        color: liked ? '#e0245e' : '#000',
                        fontSize: '24px',
                        transition: 'color 0.3s ease',
                    }}
                    aria-label={liked ? "Unlike post" : "Like post"}
                ></i>

                <i
                    className={showComments ? "fi fi-sr-comment-alt" : "fi fi-rr-comment-alt"}
                    onClick={toggleComments}
                    style={{ cursor: 'pointer' }}
                    aria-label={showComments ? "Hide comments" : "Show comments"}
                ></i>

                <i className="fi fi-rr-paper-plane" style={{ fontSize: '24px' }} title="Share"></i>
            </div>

            <div className="feed-post-likes">
                Liked by {likeCount} {likeCount === 1 ? 'person' : 'people'}
            </div>

            <div className="feed-post-caption">
                <span
                    className="feed-post-username"
                    onClick={handleProfileClick}
                    style={{ cursor: 'pointer' }}
                >
                    {user.username || user.name}
                </span>
                {isEditing ? (
                    <div className="edit-caption-wrapper">
                        <input
                            type="text"
                            value={newCaption}
                            onChange={(e) => setNewCaption(e.target.value)}
                            autoFocus
                        />
                        <button onClick={handleEditCaption}>Save</button>
                        <button onClick={() => {
                            setNewCaption(localCaption);
                            setIsEditing(false);
                        }}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    ` ${localCaption}`
                )}
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="feed-post-comments">
                    <div className="feed-post-add-comment">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                        />
                        <button onClick={handleAddComment}>Post</button>
                    </div>
                    <div className="feed-post-comments-list">
                        {comments.length === 0 ? (
                            <p>No comments yet.</p>
                        ) : (
                            comments.map(c => (
                                <div key={c._id} className="feed-post-comment-item">
                                    <img
                                        src={getUserImage(c.user.image || c.user.profilePic)}
                                        alt={c.user.username}
                                        className="feed-post-comment-user-pic"
                                    />
                                    <b>{c.user.username}</b>: {c.text}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
