import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUsers } from "@/redux/userSlice";

const useSearchUsers = (query) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!query.trim()) {
      dispatch(setUsers([]));
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://taar-server.onrender.com/api/v1/user/search?q=${query}`,
          { withCredentials: true }
        );

        dispatch(setUsers(res.data.users || []));
      } catch (err) {
        console.log(err);
      }
    }, 400); // debounce

    return () => clearTimeout(timer);
  }, [query, dispatch]);
};

export default useSearchUsers;