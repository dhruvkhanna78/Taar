import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserSearch.css";

const UserSearch = ({ user }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profile/${user._id}`);
    };

    return (
        <div className="user-search-item" onClick={handleClick}>
            <img
                src={
                    user.image ||
                    "https://i.pinimg.com/736x/74/a3/b6/74a3b6a8856b004dfff824ae9668fe9b.jpg"
                }
                alt={user.username}
                className="user-search-pic"
            />
            <div className="user-search-info">
                <div className="user-search-username">{user.username}</div>
                <div className="user-search-name">{user.name}</div>
            </div>
        </div>
    );
};

export default UserSearch;
