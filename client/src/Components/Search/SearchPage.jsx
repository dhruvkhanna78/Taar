import React, { useState, useEffect } from "react";
import API, { BASE_URL } from "../../api";  // Axios instance with baseURL & token
import UserSearch from "../UserSearch";
import "./SearchPage.css";

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Helper to get full image URL
    const getUserImage = (img) => {
        if (!img) return "https://i.pravatar.cc/150?img=1";
        return img.startsWith("http") ? img : `${BASE_URL}/${img.startsWith('/') ? img.slice(1) : img}`;
    };

    useEffect(() => {
        if (query.trim() === "") {
            setUsers([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            setLoading(true);
            API.get(`/users/search?username=${query}`)
                .then((res) => {
                    // Map users to include full image URL
                    const updatedUsers = res.data.users.map(user => ({
                        ...user,
                        image: getUserImage(user.image),
                    }));
                    setUsers(updatedUsers);
                    setError("");
                })
                .catch(() => {
                    setError("Failed to fetch users");
                    setUsers([]);
                })
                .finally(() => setLoading(false));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="search-page-container">
            <input
                type="text"
                placeholder="Search users by username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />
            {loading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-text">{error}</p>}
            <div className="search-results">
                {users.length > 0 ? (
                    users.map((user) => <UserSearch key={user._id} user={user} />)
                ) : (
                    query && !loading && <p>No users found</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
