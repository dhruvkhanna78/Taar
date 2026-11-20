import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Inbox = () => {
  //   const [users, setUsers] = useState([]);

  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/message/conversations`,
          {
            withCredentials: true,
          },
        );

        console.log(res.data);
        setConversations(res.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSearchedUsers = async () => {
      if (!search.trim()) {
        setSearchedUsers([]);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/search?q=${search}`,
          {
            withCredentials: true,
          },
        );

        if (res.data.success) {
          setSearchedUsers(res.data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchedUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="w-full max-w-4xl px-6 py-5">
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Messages</h1>

      <div className="relative mb-5">
        <div className="flex items-center bg-white border border-zinc-200 rounded-2xl px-4 py-3 shadow-sm">
          <Search className="w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-3 w-full outline-none bg-transparent"
          />
        </div>

        {searchedUsers.length > 0 && (
          <div className="absolute top-16 left-0 w-full bg-white border rounded-2xl shadow-lg z-50 overflow-hidden">
            {searchedUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/chat/${user._id}`)}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={user.profilePicture}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <h1 className="font-semibold">{user.username}</h1>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {conversations
          .filter((conversation) => conversation?.user?._id)
          .map((conversation) => (
            <div
              key={conversation.user._id}
              onClick={() => navigate(`/chat/${conversation.user._id}`)}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-100 cursor-pointer transition-all duration-200"
            >
              <img
                src={conversation.user.profilePicture || "/default-avatar.png"}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <h1 className="font-semibold">
                  {conversation.user.username || "Unknown User"}
                </h1>

                <p className="text-sm text-zinc-500 truncate max-w-[300px]">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Inbox;
