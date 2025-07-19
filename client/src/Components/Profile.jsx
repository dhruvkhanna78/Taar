import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import './Profile.css';

const LAN_IP = '192.168.1.3'; // <-- Update this to your current LAN IP
const PORT = '5000';           // <-- Your backend port
const BASE_URL = `http://${LAN_IP}:${PORT}`;

const Profile = () => {
    const { id: userid } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);

    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            try {
                const userRes = await API.get(`/users/${userid}`);
                console.log("User data:", userRes.data.user);
                setUser(userRes.data.user);

                const postsRes = await API.get(`/posts/user/${userid}`);
                setPosts(postsRes.data.posts);

                if (currentUserId && userRes.data.user.followers) {
                    const followingStatus = userRes.data.user.followers.some(
                        (follower) => (typeof follower === 'object' ? follower._id === currentUserId : follower === currentUserId)
                    );
                    setIsFollowing(followingStatus);
                } else {
                    setIsFollowing(false);
                }
            } catch (err) {
                setError('Failed to load profile or posts');
            }
        };

        if (userid) fetchUserAndPosts();
        else setError('Invalid user ID');
    }, [userid, currentUserId]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const handleFollowToggle = async () => {
        if (loadingFollow) return;
        setLoadingFollow(true);

        try {
            await API.put(`/users/follow/${userid}`);

            setIsFollowing(!isFollowing);

            setUser((prevUser) => {
                let updatedFollowers = prevUser.followers || [];

                if (isFollowing) {
                    updatedFollowers = updatedFollowers.filter(follower => {
                        const followerId = typeof follower === 'object' ? follower._id.toString() : follower.toString();
                        return followerId !== currentUserId;
                    });
                } else {
                    const alreadyFollowing = updatedFollowers.some(follower => {
                        const followerId = typeof follower === 'object' ? follower._id.toString() : follower.toString();
                        return followerId === currentUserId;
                    });
                    if (!alreadyFollowing) updatedFollowers = [...updatedFollowers, { _id: currentUserId }];
                }

                return { ...prevUser, followers: updatedFollowers };
            });
        } catch (err) {
            console.error('Follow/unfollow failed', err);
            alert('Failed to update follow status');
        }
        setLoadingFollow(false);
    };

    if (error) return <p className="error-text">{error}</p>;
    if (!user) return <p className="loading-text">Loading profile...</p>;

    const isOwnProfile = currentUserId === userid;

    // Helper to get full image URL, replaces localhost with LAN IP, and adds fallback
    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            console.warn("Profile image missing, using fallback.");
            return "https://i.pravatar.cc/150?img=1"; // fallback placeholder
        }

        if (imagePath.startsWith('http')) {
            // Replace localhost or 127.0.0.1 with LAN IP for LAN access
            if (imagePath.includes('localhost') || imagePath.includes('127.0.0.1')) {
                return imagePath.replace(/localhost|127\.0\.0\.1/, LAN_IP);
            }
            return imagePath; // full URL already
        }

        // Construct full URL for relative path
        return `${BASE_URL}/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`;
    };

    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <img
                    className="profile-image-profilePage"
                    src={getImageUrl(user.image)}
                    alt="Profile"
                />
                <div className="profile-details">
                    <div className="username-row">
                        <h2>{user.username}</h2>

                        {!isOwnProfile && (
                            <button
                                onClick={handleFollowToggle}
                                disabled={loadingFollow}
                                className={`follow-button ${isFollowing ? 'unfollow' : 'follow'}`}
                            >
                                {loadingFollow ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}

                        {isOwnProfile && (
                            <div className="edit-container">
                                <button className="edit-button" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
                                {menuOpen && (
                                    <div className="edit-menu">
                                        <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
                                        <button onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {user.bio && <p className="profile-bio">{user.bio}</p>}

                    <div className="profile-stats">
                        <span><strong>{posts.length}</strong> posts</span>
                        <span><strong>{user.followers?.length || 0}</strong> followers</span>
                        <span><strong>{user.following?.length || 0}</strong> following</span>
                    </div>
                </div>
            </div>

            <div className="profile-posts">
                {posts.length === 0 ? (
                    <p>No posts yet.</p>
                ) : (
                    <div className="posts-grid">
                        {posts.map(post => {
                            const postOwnerId = typeof post.postedBy === 'object' ? post.postedBy._id : post.postedBy;
                            return (
                                <div key={post._id} className="post-card">
                                    <img
                                        src={getImageUrl(post.imageUrl)}
                                        alt="post"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/profile/${postOwnerId}`)}
                                    />
                                    {post.caption && <p className="post-caption">{post.caption}</p>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
