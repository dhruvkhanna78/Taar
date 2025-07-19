import React, { useEffect, useState } from 'react';
import Suggestions from '../Suggestions';
import Post from '../Post/Post';
import API, { BASE_URL } from '../../api';
import { useNavigate } from 'react-router-dom';
import './Feed.css';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await API.get('/posts/all');
                setPosts(res.data.posts || []);
                setError('');
            } catch (err) {
                console.error('❌ Error fetching posts:', err);
                setError('Failed to load posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDeletePostFromFeed = (deletedPostId) => {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
    };

    // Replace localhost with local IP so images load on phone too
    const getImageUrl = (url) => {
        if (!url) return "https://i.pravatar.cc/150?img=1"; // fallback image

        // If URL contains localhost, replace with your PC IP
        if (url.startsWith('http')) {
            return url.replace('localhost:5000', '192.168.1.9:5000');
        }

        return `${BASE_URL}/${url.replace(/^\/+/, '')}`;
    };

    return (
        <div className="main-container">
            <div className="feed-section">
                {loading ? (
                    <p>Loading posts...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    posts.map(post => (
                        <Post
                            key={post._id}
                            user={{
                                _id: post.postedBy?._id?.toString() || '',
                                username: post.postedBy?.username,
                                image: getImageUrl(post.postedBy?.image),
                            }}
                            image={getImageUrl(post.imageUrl)}
                            caption={post.caption}
                            postId={post._id}
                            likes={post.likes}
                            onDelete={handleDeletePostFromFeed}
                        />
                    ))
                )}
            </div>

            <div className="suggestions-section">
                <Suggestions />
            </div>
        </div>
    );
};

export default Feed;
