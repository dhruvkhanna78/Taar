import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket.js";

const Messages = () => {
  const { id } = useParams();

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
          }
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
        }
      );

      setMessages((prev) => [...prev, res.data.newMessage]);

      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">

      {/* top */}
      <div className="p-4 border-b border-zinc-800 text-xl font-bold">
        Chat
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-zinc-800 px-4 py-2 rounded-2xl w-fit max-w-[70%]"
          >
            {msg.message}
          </div>
        ))}

        <div ref={scrollRef}></div>
      </div>

      {/* input */}
      <div className="p-4 border-t border-zinc-800 flex gap-2">

        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-zinc-900 px-4 py-2 rounded-xl outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-white text-black px-5 rounded-xl"
        >
          Send
        </button>

      </div>
    </div>
  );
};

export default Messages;