import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
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

// --- Helper function to get cropped image ---
const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

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

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg");
    });
};

const categories = [
    "Entertainment", "Sports", "Gaming", "Learning", "Coding", "Art & Literature",
];

const CreatePost = ({ open, setOpen }) => {
    const [file, setFile] = useState([]);
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const { posts } = useSelector(store => store.post);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Crop States
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const fileChangeHandler = async (e) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        if (selectedFiles.length > 0) {
            setFile(selectedFiles);
            const previewPromises = selectedFiles.map((f) => readFileAsDataURL(f));
            const allPreviews = await Promise.all(previewPromises);
            setImagePreview(allPreviews);
        }
    };

    const imageRef = useRef();

    const createPostHandler = async (e) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("caption", caption);
            if (selectedCategory) formData.append("category", selectedCategory);

            // Loop through files and handle cropping for images
            for (let i = 0; i < file.length; i++) {
                const f = file[i];
                if (f.type.startsWith("image/")) {
                    // Agar image hai toh cropped version banao
                    // Note: Abhi ye sirf current visible image ko crop karega logic simple rakhne ke liye
                    // Agar multiple images hain, toh sabko crop karne ka logic alag hoga
                    const croppedBlob = await getCroppedImg(imagePreview[i], croppedAreaPixels);
                    formData.append("images", croppedBlob, `cropped_${i}.jpg`);
                } else if (f.type.startsWith("video/")) {
                    formData.append("video", f);
                }
            }

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/post/addpost`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setPosts([res.data.post, ...posts]));
                setOpen(false);
                toast.success(res.data.message || "Post created successfully");
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
                        <AvatarFallback className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-semibold text-xs">{user?.username}</h1>
                        <span className="text-gray-600 text-xs">{user?.bio}</span>
                    </div>
                </div>

                <div>
                    <div className="font-medium mb-2">Select Category</div>
                    <div className="flex gap-2 justify-center my-1 flex-wrap">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant="outline"
                                className={`text-xs rounded-full ${selectedCategory === cat ? "bg-black text-white hover:bg-black" : "text-black"}`}
                                onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {imagePreview.length > 0 && (
                    <div className="relative w-full h-80 flex items-center justify-center overflow-hidden rounded-md bg-black">
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
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 z-10 px-4 py-2 bg-black/40 rounded-full">
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-1 cursor-pointer"
                                    />
                                </div>
                            </div>
                        ) : (
                            <video src={imagePreview[currentIndex]} controls className="object-contain h-full w-full" />
                        )}

                        {currentIndex > 0 && (
                            <button type="button" onClick={() => setCurrentIndex(prev => prev - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full z-20">◀</button>
                        )}
                        {currentIndex < imagePreview.length - 1 && (
                            <button type="button" onClick={() => setCurrentIndex(prev => prev + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full z-20">▶</button>
                        )}
                    </div>
                )}

                <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="focus-visible:ring-transparent border-none mt-2"
                    placeholder="Write a caption..."
                />

                <input ref={imageRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={fileChangeHandler} />

                <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] text-white">
                    Select from computer
                </Button>

                {imagePreview.length > 0 && (
                    <Button onClick={createPostHandler} disabled={loading} className="w-full hover:text-gray-500">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Post"}
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreatePost;