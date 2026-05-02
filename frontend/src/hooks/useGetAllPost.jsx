import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function useGetAllPost(page = 1) {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(
                    `https://taar-server.onrender.com/api/v1/post/all?page=${page}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log("Error fetching posts:", error);
            }
        };

        fetchAllPost();
    }, [dispatch, page]);
}

export default useGetAllPost;