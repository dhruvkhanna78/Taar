import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import React, { useRef, useState } from 'react'
import { Avatar } from './ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const categories = [
  "Entertainment",
  "Sports",
  "Gaming",
  "Learning",
  "Coding",
  "Art & Literature",
];

const CreatePost = ({ open, setOpen }) => {
  const [file, setFile] = useState([]); // Array for multiple files
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState([]); // Array for previews
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector(store => store.post);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fileChangeHandler = async (e) => {
    // FIX: e.target.file ko e.target.files kiya aur Array.from lagaya
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 0) {
      setFile(selectedFiles);
      const previewPromises = selectedFiles.map((f) => readFileAsDataURL(f));
      const allPreviews = await Promise.all(previewPromises);
      setImagePreview(allPreviews); // Multiple previews set kiye
    }
  };

  const imageRef = useRef();

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (selectedCategory) formData.append("category", selectedCategory);

    // Multiple files append logic
    file.forEach((f) => {
      if (f.type.startsWith("image/")) {
        formData.append("images", f); // Match with backend upload.fields
      } else if (f.type.startsWith("video/")) {
        formData.append("video", f);
      }
    });

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        setOpen(false);
        toast.success(res.data.message || "Post created successfully");
        // Reset states
        setFile([]);
        setImagePreview([]);
        setCaption("");
        setSelectedCategory("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={() => { setOpen(false); setImagePreview([]); setFile([]); setCaption(""); }} className="sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">
              CN
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>

        <div>
          <div>Select Category</div>
          <div className="flex gap-5 justify-center my-1 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                className={`border-none bg-transparent shadow-none text-black hover:text-gray-500 ${selectedCategory === cat ? "bg-black text-white" : ""}`}
                onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Previews Loop */}
        {imagePreview.length > 0 && (
          <div className="w-full flex flex-col gap-2">
            {imagePreview.map((src, index) => (
              <div key={index} className="w-full h-64 flex items-center justify-center">
                <img
                  src={src}
                  alt="preview"
                  className="object-cover h-full w-full rounded-md"
                />
              </div>
            ))}
          </div>
        )}

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />

        {/* Hidden Input with Multiple/Video support */}
        <input
          ref={imageRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={fileChangeHandler}
        />

        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from computer
        </Button>

        {imagePreview.length > 0 && (
          loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} type="submit" className="w-full hover:text-gray-500">
              Post
            </Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;