import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import React, { useRef, useState } from 'react'
import { DialogClose } from './ui/dialog';
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
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const {posts} = useSelector(store => store.post);
  const [selectedCategory, setSelectedCategory] = useState("");


  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const imageRef = useRef();

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    if (selectedCategory) formData.append("category", selectedCategory);
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setPosts([ res.data.post, ...posts])); 
        setOpen(false);
        toast.success(res.data.message || "Post created successfully");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error creating post");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
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
          <div>Select Categort</div>
          <div className="flex gap-5 justify-center my-1 flex-wrap">

            <Button className={`border-none bg-transparent shadow-none text-black hover:text-white ${selectedCategory === "Entertainment" ? "bg-black text-white" : ""}`}
              onClick={() => setSelectedCategory(selectedCategory === "Entertainment" ? "" : "Entertainment")}>Entertainment</Button>

            <Button className={`border-none bg-transparent shadow-none text-black hover:text-white ${selectedCategory === "Sports" ? "bg-black text-white" : ""}`}
              onClick={() => setSelectedCategory(selectedCategory === "Sports" ? "" : "Sports")}>Sports</Button>

            <Button className={`border-none bg-transparent shadow-none text-black hover:text-white ${selectedCategory === "Gaming" ? "bg-black text-white" : ""}`}
              onClick={() => setSelectedCategory(selectedCategory === "Gaming" ? "" : "Gaming")}>
              Gaming
            </Button>

            <Button className={`border-none bg-transparent shadow-none text-black hover:text-white ${selectedCategory === "Learning" ? "bg-black text-white" : ""}`}
              onClick={() => setSelectedCategory(selectedCategory === "Learning" ? "" : "Learning")}>
              Learning
            </Button>

            <Button className={`border-none bg-transparent shadow-none text-black hover:text-white ${selectedCategory === "Coding" ? "bg-black text-white" : ""}`}
              onClick={() => setSelectedCategory(selectedCategory === "Coding" ? "" : "Coding")}>Coding</Button>

            <Button className={`border-none bg-transparent shadow-none text-black hover:text-white ${selectedCategory === "Art & Literature" ? "bg-black text-white" : ""}`}
              onClick={() => setSelectedCategory(selectedCategory === "Art & Literature" ? "" : "Art & Literature")}>Art & Literature</Button>
          </div>
        </div>

        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="img"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />


        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />

        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from computer
        </Button>
        {
          imagePreview && (
            loading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} type="submit" className="w-full">
                Post
              </Button>
            )
          )
        }

      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
