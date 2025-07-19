import { useState } from "react";
import API, { BASE_URL } from "../../api"; // Use your API instance to keep consistent headers & baseURL

const CreatePost = ({ onClose }) => {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();

        if (!image) {
            setError("Please select an image");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("caption", caption);
            formData.append("image", image);

            // Use your API instance for consistent baseURL and auth headers
            const res = await API.post("/posts/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    // If your API instance already sets Authorization header, you can omit it here
                },
            });

            console.log("✅ Post created:", res.data);
            setCaption("");
            setImage(null);
            setPreview(null);
            onClose(); // Close modal or clear form

            alert("Post created successfully!");
        } catch (err) {
            console.error("❌ Error uploading post:", err.response || err.message);
            setError("Failed to upload post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                width: "100vw",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={onClose} // Close modal on background click
        >
            <div
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "500px",
                    position: "relative",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        fontSize: "20px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    ✕
                </button>

                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Create a Post</h2>

                <form onSubmit={handlePost} style={{ display: "flex", flexDirection: "column" }}>
                    <input
                        type="text"
                        placeholder="Write a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        style={{
                            marginBottom: "15px",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                        }}
                        disabled={loading}
                    />

                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            style={{
                                marginBottom: "15px",
                                maxHeight: "250px",
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ marginBottom: "20px" }}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "12px",
                            backgroundColor: loading ? "#8ecdf7" : "#0095f6",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Uploading..." : "Upload Post"}
                    </button>

                    {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
