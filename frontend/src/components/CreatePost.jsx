// CreatePost.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const categoryTagsMap = {
  Entertainment: ["Memes", "Personal"],
  Learning: ["Tutorials", "Facts", "News"],
  Coding: ["DSA", "Dev", "Tech News"],
  "Art & Literature": ["Artworks", "Poems", "Stories"],
};

const CreatePost = ({ open, setOpen }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [postText, setPostText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const resetForm = () => {
    setStep(1);
    setCategory("");
    setPostText("");
    setImagePreview(null);
    setImageFile(null);
    setTags([]);
  };

  if (!open) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("caption", postText);
      formData.append("category", category);
      formData.append("tag", tags[0] || "");
      formData.append("image", imageFile);

     const response = await fetch("http://localhost:8000/api/v1/post/addpost", {
      method: "POST",
      credentials: "include", // ← ye important hai cookie bhejne ke liye
      body: formData,
    });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create post");

      console.log("Post created:", data);
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const availableTags = category ? categoryTagsMap[category] : [];

  // Use Portal to render modal at root
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/70 backdrop-blur-sm px-4"
      onClick={() => setOpen(false)} // close on overlay click
    >
      <div
        className="bg-gray-900 rounded-xl max-w-5xl w-full max-h-[85vh] flex overflow-hidden shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Left preview */}
        <div className="w-1/2 bg-gray-950 flex items-center justify-center p-4">
          {step === 2 && imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover rounded-lg shadow-md max-h-full max-w-full"
            />
          ) : (
            <div className="text-gray-500 text-center px-4">
              {step === 1 ? (
                <p className="text-lg font-medium">Select a category to start your post</p>
              ) : (
                <p className="mb-2 text-sm italic">No image selected</p>
              )}
            </div>
          )}
        </div>

        {/* Right input */}
        <div className="w-1/2 flex flex-col bg-gray-900 text-white">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <h2 className="font-semibold text-xl">{step === 1 ? "Select Category" : "Create Post"}</h2>
            <button
              className="text-gray-400 font-bold text-3xl leading-none hover:text-red-500 transition"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {step === 1 ? (
            <div className="grid grid-cols-1 gap-3 px-6 py-6">
              {Object.keys(categoryTagsMap).map((cat) => (
                <button
                  key={cat}
                  className="bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition border border-gray-700 hover:border-blue-500 hover:shadow-md"
                  onClick={() => {
                    setCategory(cat);
                    setStep(2);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : (
            <>
              {/* Image upload */}
              <div className="p-4 border-b border-gray-800">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-white file:bg-blue-600 file:hover:bg-blue-700 file:text-white file:rounded-full file:px-4 file:py-1 file:border-none file:cursor-pointer transition"
                />
              </div>

              {/* Tags */}
              {availableTags.length > 0 && (
                <div className="px-6 py-3 flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <label
                      key={tag}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm cursor-pointer transition border ${
                        tags.includes(tag)
                          ? "bg-blue-600 border-blue-500"
                          : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={tags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) setTags([tag]);
                          else setTags([]);
                        }}
                        className="hidden"
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              )}

              {/* Caption */}
              <div className="flex-1 overflow-y-auto px-6 py-5 mt-2">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full resize-y bg-gray-700 border border-gray-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-blue-500 min-h-28 max-h-48 overflow-y-auto"
                />
              </div>

              {/* Post button */}
              <div className="px-6 py-4 border-t border-gray-800">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition"
                  disabled={!imageFile || tags.length === 0}
                  onClick={handlePost}
                >
                  Post
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreatePost;
