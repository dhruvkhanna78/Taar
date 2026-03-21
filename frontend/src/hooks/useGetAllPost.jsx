import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function useGetAllPost() {
    const dispatch = useDispatch();
    // Hook implementation
    useEffect(() => {
        // Fetch all posts logic here
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/post/all`, { withCredentials: true });
                if (res.data.success) {
                    console.log("Fetched posts:", res.data);
                    dispatch(setPosts(res.data.posts));
                }
            }
            catch (error) {
                console.log("Error fetching posts:", error);
            }
        };
        fetchAllPost();
    }, [dispatch]);
}
export default useGetAllPost;