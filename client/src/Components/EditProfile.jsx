import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [userId, setUserId] = useState(null); // for redirect
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔃 Fetch current user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/users/me");
                const user = res.data.user;
                setUserId(user._id);
                setUsername(user.username || "");
                setBio(user.bio || "");
                setPreview(user.image || null);
            } catch (err) {
                setError("⚠️ Failed to load user data.");
            }
        };
        fetchUser();
    }, []);

    // 📸 Image preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // ✅ Submit updated profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("bio", bio);
            if (image) formData.append("image", image);

            const res = await API.patch("/users/edit-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const updatedUser = res.data.user; // assuming updated user data is returned here
            if (updatedUser?.image) {
                localStorage.setItem("profilePic", updatedUser.image);
                setPreview(updatedUser.image);
            }

            alert("✅ Profile updated successfully!");
            navigate(`/profile/${userId}`);
        } catch (err) {
            const msg = err.response?.data?.error || "❌ Failed to update profile.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>

            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleSubmit} className="edit-profile-form">
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label>Bio:</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="4"
                    maxLength={200}
                />

                <label>Profile Image:</label>
                {preview && (
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className="profile-image-preview"
                    />
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} />

                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
