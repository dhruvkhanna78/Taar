import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    if (!userId || userId === "undefined" || userId === "edit") return;

// useGetUserProfile.js mein useEffect ke andar:

useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            // Naya fetch shuru hone se pehle purana clear kar sakte ho (Optional but safe)
            // dispatch(setUserProfile(null)); 

            const res = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`, { withCredentials: true });
            if (res.data.success) { 
                dispatch(setUserProfile(res.data.user));
            }
        } catch (error) {
            console.log("Error fetching profile:", error);
        }
    }
    if(userId) fetchUserProfile();
}, [userId, dispatch]);
};

export default useGetUserProfile;