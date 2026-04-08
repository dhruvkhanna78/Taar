import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import React, { useRef, useState, useCallback } from 'react'
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
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

const categories = [
  "Entertainment",
  "Sports",
  "Gaming",
  "Learning",
  "Coding",
  "Art & Literature",
];

const getCroppedImg = async (imageSrc, pixelCrop) => {
  if (!pixelCrop) return null;
  const image = new Image();
  image.src = imageSrc;
  await new Promise(resolve => image.onload = resolve);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), "image/jpeg");
  });
};

const CreatePost = ({ open, setOpen }) => {
  const [file, setFile] = useState([]);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);

  const dispatch = useDispatch();
  const imageRef = useRef();

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const fileChangeHandler = async (e) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (!selectedFiles.length) return;
    setFile(selectedFiles);
    const previews = await Promise.all(
      selectedFiles.map(f => readFileAsDataURL(f))
    );
    setImagePreview(previews);
    setCurrentIndex(0);
  };

  const createPostHandler = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      if (selectedCategory) formData.append("category", selectedCategory);

      for (let i = 0; i < file.length; i++) {
        const f = file[i];
        if (f.type.startsWith("image/")) {
          const blob = await getCroppedImg(imagePreview[i], croppedAreaPixels);
          if (blob) {
            formData.append("images", blob, `cropped_${i}.jpg`);
          } else {
            formData.append("images", f);
          }
        } else if (f.type.startsWith("video/")) {
          formData.append("video", f);
        }
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/addpost`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message || "Post created successfully");
        setOpen(false);
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
      <DialogContent 
        onInteractOutside={() => {
          setOpen(false);
          setImagePreview([]);
          setFile([]);
          setCaption("");
        }} 
        className="sm:max-w-[450px] max-h-[90vh] p-0 flex flex-col overflow-hidden"
      >
        {/* Fixed Header */}
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle className="text-center text-sm font-bold">Create New Post</DialogTitle>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* User Profile Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xs">{user?.username}</h1>
              <p className="text-gray-500 text-[10px] line-clamp-1">{user?.bio}</p>
            </div>
          </div>

          {/* Category Section */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight mb-2">Category</p>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                    selectedCategory === cat 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Media Preview / Cropper */}
          {imagePreview.length > 0 && (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
              {file[currentIndex]?.type.startsWith("image/") ? (
                <div className="relative w-full h-full">
                  <Cropper
                    image={imagePreview[currentIndex]}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  {/* Zoom Slider Overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 z-10 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm">
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-1 accent-black cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <video
                  src={imagePreview[currentIndex]}
                  controls
                  className="object-contain h-full w-full"
                />
              )}

              {/* Navigation Buttons */}
              {currentIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-md p-1.5 rounded-full z-20 hover:bg-white"
                >
                  <span className="text-xs">◀</span>
                </button>
              )}
              {currentIndex < imagePreview.length - 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-md p-1.5 rounded-full z-20 hover:bg-white"
                >
                  <span className="text-xs">▶</span>
                </button>
              )}
            </div>
          )}

          {/* Caption Area */}
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="focus-visible:ring-0 border-none p-0 min-h-[80px] text-sm resize-none"
            placeholder="What's on your mind?..."
          />
          
          <input
            ref={imageRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={fileChangeHandler}
          />
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t bg-gray-50/50 flex flex-col gap-2 shrink-0">
          <Button
            onClick={() => imageRef.current.click()}
            variant="outline"
            className="w-full text-xs font-semibold h-10 border-dashed border-2 hover:bg-white"
          >
            {imagePreview.length > 0 ? "Change Selection" : "Select from computer"}
          </Button>

          {imagePreview.length > 0 && (
            <Button
              onClick={createPostHandler}
              disabled={loading}
              className="w-full h-10 bg-black text-white hover:bg-gray-800 transition-colors font-bold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting...
                </span>
              ) : (
                "Share Post"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;