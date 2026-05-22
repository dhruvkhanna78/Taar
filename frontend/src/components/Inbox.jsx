import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Inbox = () => {
  //   const [users, setUsers] = useState([]);

  const [conversations, setConversations] = useState([]);
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-5">Messages</h1>

      <div className="space-y-3">
        {conversations.map((conversation) => (
          <div
            key={conversation.user._id}
            onClick={() => navigate(`/chat/${conversation.user._id}`)}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-100 cursor-pointer transition"
          >
            <img
              src={conversation.user.profilePicture}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <h1 className="font-semibold">{conversation.user.username}</h1>

              <p className="text-sm text-zinc-500">{conversation.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
