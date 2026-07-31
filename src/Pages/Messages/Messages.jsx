import React, { useEffect, useRef, useState } from "react";

import { useAuth } from "../../Hooks/useAuth";
import useAxiosNormal from "../../Hooks/useAxiosNormal";

const Messages = ({ target, socket }) => {
  const axiosMessage = useAxiosNormal();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  // 👤 join user room
  useEffect(() => {
    if (socket && user?.email) {
      socket.emit("join", user.email);
    }
  }, [socket, user]);

  // 📥 receive message
  useEffect(() => {
    if (!socket) return;

    console.log("Socket Connected ✅"); // 👈 DEBUG

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.id === data.id ||
            (msg.text === data.text &&
              msg.senderEmail === data.senderEmail &&
              msg.receiverEmail === data.receiverEmail),
        );

        if (exists) return prev;
        return [...prev, data];
      });
    });

    return () => socket.off("receiveMessage");
  }, [socket]);

  // 🔽 auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !socket || !user?.email || !target) return;

    const messageData = {
      id: Date.now(),
      senderEmail: user.email,
      receiverEmail: target.email,
      text,
    };

    console.log("SENDING 👉", messageData);

    try {
      // ✅ 1. DATABASE E SAVE
      await axiosMessage.post("/messages", messageData);

      // ✅ 2. REALTIME SEND
      socket.emit("sendMessage", messageData);

      // ✅ 3. UI UPDATE
      setMessages((prev) => [...prev, messageData]);
      setText("");
    } catch (err) {
      console.error("SEND ERROR ❌", err);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      if (!user?.email || !target?.email) return;

      const res = await axiosMessage.get("/messages", {
        params: {
          email: user.email,
          chatWith: target.email,
        },
      });

      console.log("MESSAGES 👉", res.data);

      setMessages(res.data);
    };

    loadMessages();
  }, [user, target]);

  // ❗ no user selected
  if (!target) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a user to start chatting 💬
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-full relative rounded-tr-2xl">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white/5 hide-scrollbar">
        {messages
          .filter(
            (msg) =>
              (msg.senderEmail === user.email &&
                msg.receiverEmail === target.email) ||
              (msg.senderEmail === target.email &&
                msg.receiverEmail === user.email),
          )
          .map((msg) => (
            <div
              key={msg._id || msg.id}
              className={`flex ${
                msg.senderEmail === user.email ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-xs shadow-lg backdrop-blur-md border 
              ${
                msg.senderEmail === user.email
                  ? "bg-green-500/80 border-green-300/30 text-white rounded-br-none"
                  : "bg-white/10 border-white/20 text-white rounded-bl-none"
              }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT (🔥 FIXED FOOTER STYLE) */}
      <div className="sticky bottom-0 p-2 md:p-3 border-t border-white/10 bg-black/30 backdrop-blur-xl flex items-center gap-2 rounded-br-2xl">
        {/* INPUT */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 min-w-0 p-2 md:p-3 rounded-full bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400 text-sm md:text-base"
          placeholder="Type a message..."
        />

        {/* BUTTON */}
        <button
          onClick={handleSend}
          className="shrink-0 px-3 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 transition rounded-full shadow-lg text-sm md:text-base"
        >
          <span className="hidden sm:inline">🚀 Send</span>
          <span className="sm:hidden">➤</span>
        </button>
      </div>
    </div>
  );
};

export default Messages;
