import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useSearchUsers = (query) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!query) return;

    const fetchUsers = async () => {
      const res = await axios.get(
        `https://taar-server.onrender.com/api/v1/user/search?q=${query}`,
        { withCredentials: true }
      );

      dispatch(setUsers(res.data.users));
    };

    fetchUsers();
  }, [query]);
};

export default useSearchUsers;