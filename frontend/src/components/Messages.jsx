import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket.js";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const Messages = () => {
  const { id } = useParams();

  const { user: loggedInUser } = useSelector((store) => store.auth);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const scrollRef = useRef();

  // fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://taar-server.onrender.com/api/v1/message/all/${id}`,
          {
            withCredentials: true,
          },
        );

        setMessages(res.data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [id]);

  // realtime receive
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  // auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `https://taar-server.onrender.com/api/v1/message/send/${id}`,
        {
          message: text,
        },
        {
          withCredentials: true,
        },
      );

      setMessages((prev) => [...prev, res.data.newMessage]);

      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f10] text-white">
      {/* top */}
      <div className="p-4 border-b border-zinc-800 text-xl font-bold">Chat</div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isOwnMessage = msg.senderId === loggedInUser?._id;

          return (
            <div
              key={msg._id}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
          relative px-4 py-3 rounded-3xl
          max-w-[75%] break-words
          shadow-sm
          ${
            isOwnMessage
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-zinc-800 text-white rounded-bl-md"
          }
        `}
              >
                <p className="text-[15px] leading-relaxed">{msg.message}</p>

                <p
                  className={`
            text-[10px] mt-1 text-right
            ${isOwnMessage ? "text-blue-100" : "text-zinc-400"}
          `}
                >
                  {msg.createdAt
                    ? format(new Date(msg.createdAt), "hh:mm a")
                    : ""}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={scrollRef}></div>
      </div>

      {/* input */}
      <div className="p-4 border-t border-zinc-800 flex gap-3 bg-[#0f0f10]">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-zinc-900 px-5 py-3 rounded-full outline-none text-white"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 transition text-white px-6 rounded-full font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
