import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CreatePost from './Feed/CreatePost';
import './Nav.css';
import { UserContext } from '../context/UserContext';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { profilePic, userId } = useContext(UserContext);
    const isLoggedIn = !!localStorage.getItem("token");

    const toggleSidebar = () => setIsOpen(!isOpen);

    const BASE_URL = "http://192.168.1.3:5000"; // Update this to your backend IP and port

    const getValidImageUrl = (url) => {
        if (!url) return "https://i.pravatar.cc/150?img=1"; // fallback image
        if (url.startsWith('http')) {
            return url.replace('localhost:5000', '192.168.1.3:5000');
        }
        return `${BASE_URL}/${url.replace(/^\/+/, '')}`;
    };

    const menuItems = [
        {
            label: "Home",
            path: "/feed",
            icon: {
                active: "fi fi-ss-home",
                inactive: "fi fi-rr-home"
            }
        },
        {
            label: "Search",
            path: "/search",
            icon: {
                active: "fi fi-br-search",
                inactive: "fi fi-rr-search"
            }
        },
        {
            label: "Post",
            path: "/create",
            icon: {
                active: "fi fi-ss-plus",
                inactive: "fi fi-rr-plus"
            }
        },
        {
            label: "Notification",
            path: "/notifications",
            icon: {
                active: "fi fi-ss-bell",
                inactive: "fi fi-rr-bell"
            }
        },
        {
            label: "Profile",
            path: `/profile/${userId}`,
            icon: {
                active: "fi fi-ss-user",
                inactive: "fi fi-rr-user"
            }
        }
    ];

    const handleMenuClick = (label, path) => {
        if (label === "Post") {
            setShowCreatePost(true);
        } else {
            navigate(path);
        }
    };

    return (
        <>
            {/* Top Navbar */}
            <nav className='topNavbar'>
                <div className="topleft">
                    <div className="icon-wrapper" onClick={toggleSidebar}>
                        <i className="fi fi-rr-menu-burger"></i>
                    </div>
                    <div className="icon-wrapper">
                        <i className="fi fi-brands-instagram"></i>
                    </div>
                </div>
                <div className="topright icon-wrapper">
                    <i className="fi fi-rr-messages"></i>
                </div>
            </nav>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
                {menuItems.map((item, index) => {
                    const isActive =
                        item.label === "Profile"
                            ? location.pathname.startsWith("/profile")
                            : location.pathname === item.path;

                    return (
                        <div
                            key={index}
                            className={`menuItemStyle ${isActive ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item.label, item.path)}
                        >
                            <div className="icon-wrapper">
                                {item.label === "Profile" && isLoggedIn && profilePic ? (
                                    <img
                                        src={getValidImageUrl(profilePic)}
                                        alt="Profile"
                                        className="nav-profile-pic"
                                        style={isActive ? { border: "2px solid black" } : {}}
                                    />
                                ) : (
                                    <i className={isActive ? item.icon.active : item.icon.inactive}></i>
                                )}
                            </div>
                            <div className={`menu-text-wrapper ${isOpen ? 'show' : 'hide'}`}>
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CreatePost Modal */}
            {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} />}
        </>
    );
};

export default Nav;
