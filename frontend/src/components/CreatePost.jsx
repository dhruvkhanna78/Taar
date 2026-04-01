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

const getCroppedImg = async (imageSrc, crop) => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
};

const CreatePost = ({ open, setOpen }) => {

  const [file, setFile] = useState([]);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const [cropStates, setCropStates] = useState([]);
  const [zoomStates, setZoomStates] = useState([]);
  const [croppedAreas, setCroppedAreas] = useState([]);

  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const imageRef = useRef();

  const fileChangeHandler = async (e) => {

    const selectedFiles = e.target.files
      ? Array.from(e.target.files)
      : [];

    if (!selectedFiles.length) return;

    const previews = await Promise.all(
      selectedFiles.map(f => readFileAsDataURL(f))
    );

    setFile(selectedFiles);
    setImagePreview(previews);

    setCropStates(
      selectedFiles.map(() => ({ x: 0, y: 0 }))
    );

    setZoomStates(
      selectedFiles.map(() => 1)
    );

    setCroppedAreas(
      selectedFiles.map(() => null)
    );

    setCurrentIndex(0);
  };

  const createPostHandler = async () => {

    const formData = new FormData();

    formData.append("caption", caption);

    if (selectedCategory)
      formData.append("category", selectedCategory);

    for (let i = 0; i < file.length; i++) {

      const f = file[i];

      if (f.type.startsWith("image/")) {

        if (croppedAreas[i]) {

          const blob = await getCroppedImg(
            imagePreview[i],
            croppedAreas[i]
          );

          formData.append("images", blob, `cropped-${i}.jpg`);

        } else {

          formData.append("images", f);
        }

      } else if (f.type.startsWith("video/")) {

        formData.append("video", f);
      }
    }

    try {

      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {

        dispatch(setPosts([res.data.post, ...posts]));

        toast.success(res.data.message || "Post created");

        setOpen(false);

        setFile([]);
        setImagePreview([]);
        setCaption("");
        setSelectedCategory("");

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Error creating post"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="sm:max-h-[90vh] overflow-y-auto">

        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>

        <div className="flex items-center gap-4">

          <Avatar className="w-10 h-10">

            <AvatarImage src={user?.profilePicture} />

            <AvatarFallback>
              CN
            </AvatarFallback>

          </Avatar>

          <div>

            <h1 className="font-semibold text-xs">
              {user?.username}
            </h1>

            <span className="text-gray-600 text-xs">
              {user?.bio}
            </span>

          </div>

        </div>

        {imagePreview.length > 0 && (

          <div className="relative w-full h-80 overflow-hidden rounded-xl bg-black shadow-md">

            {file[currentIndex]?.type.startsWith("image/") ? (

              <div className="absolute inset-0">

                <Cropper
                  image={imagePreview[currentIndex]}
                  crop={cropStates[currentIndex]}
                  zoom={zoomStates[currentIndex]}
                  aspect={1}
                  onCropChange={(crop) => {

                    const updated = [...cropStates];
                    updated[currentIndex] = crop;
                    setCropStates(updated);

                  }}
                  onZoomChange={(zoom) => {

                    const updated = [...zoomStates];
                    updated[currentIndex] = zoom;
                    setZoomStates(updated);

                  }}
                  onCropComplete={(_, croppedPixels) => {

                    const updated = [...croppedAreas];
                    updated[currentIndex] = croppedPixels;
                    setCroppedAreas(updated);

                  }}
                />

              </div>

            ) : (

              <video
                src={imagePreview[currentIndex]}
                controls
                className="absolute inset-0 w-full h-full object-cover"
              />

            )}

            {currentIndex > 0 && (

              <button
                onClick={() =>
                  setCurrentIndex(currentIndex - 1)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
              >
                ◀
              </button>

            )}

            {currentIndex < imagePreview.length - 1 && (

              <button
                onClick={() =>
                  setCurrentIndex(currentIndex + 1)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
              >
                ▶
              </button>

            )}

          </div>

        )}

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
        />

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

            <Button onClick={createPostHandler}>
              Post
            </Button>

          )

        )}

      </DialogContent>

    </Dialog>
  );
};

export default CreatePost;