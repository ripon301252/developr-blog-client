import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Send, MessageSquareText } from "lucide-react";
import { format } from "timeago.js";
import useAxiosNormal from "../../Hooks/useAxiosNormal";
import { useAuth } from "../../Hooks/useAuth";

const Chat = () => {
  const { user } = useAuth();
  const axiosApi = useAxiosNormal();

  const [users, setUsers] = useState([]);
  const [target, setTarget] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const bottomRef = useRef(null);

  // 🔌 socket connect
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // 👤 join
  useEffect(() => {
    if (socket && user?.email) {
      socket.emit("join", user.email);
    }
  }, [socket, user]);

  // 📥 receive
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.id === data.id ||
            (m.text === data.text &&
              m.senderEmail === data.senderEmail &&
              m.createdAt === data.createdAt),
        );

        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("receiveMessage", handler);

    return () => socket.off("receiveMessage", handler);
  }, [socket]);

  // 🔽 scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("chatTarget");
    if (saved) {
      setTarget(JSON.parse(saved));
    }
  }, []);

  // 👥 load users
  useEffect(() => {
    const load = async () => {
      setLoadingUsers(true);
      const res = await axiosApi.get("/users");
      setUsers(res.data.users);
      setLoadingUsers(false);
    };
    load();
  }, []);

  // 📩 load messages
  useEffect(() => {
    const load = async () => {
      if (!user?.email || !target?.email) return;

      try {
        const res = await axiosApi.get("/messages", {
          params: {
            email: user.email,
            chatWith: target.email,
          },
        });

        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, [user?.email, target?.email]); // 🔥 IMPORTANT CHANGE

  // ✉️ send
  const handleSend = async () => {
    if (!text.trim() || !target) return;

    const msg = {
      id: Date.now(),
      senderEmail: user.email,
      receiverEmail: target.email,
      text,
      createdAt: new Date(),
    };

    await axiosApi.post("/messages", msg);
    socket.emit("sendMessage", msg);

    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="h-screen max-w-7xl mx-auto flex bg-white/10 text-white md:p-8 md:m-10 rounded-2xl ">
      {/* LEFT */}
      <div
        className={`w-full md:w-1/3 ${target ? "hidden md:flex" : "flex"} flex-col bg-white/5 backdrop-blur-xl border-r border-white/10 md:rounded-l-2xl `}
      >
        {/* <h2 className="px-4 py-[22px] text-lg font-semibold border-b border-white/10 flex items-center gap-2 text-green-400">
          <MessageSquareText />
          Chats ({users.length})
        </h2> */}

        <h2
        className="
    text-2xl md:text-3xl lg:text-4xl
    font-bold mb-8 py-[14px]
    flex justify-center items-center gap-3

    text-green-300
    bg-gradient-to-r from-green-400 via-emerald-400 to-green-600
    bg-clip-text text-transparent

    backdrop-blur-md
    px-6 

    border-b 
    shadow-[0_0_25px_rgba(34,197,94,0.25)]

    w-full mx-auto
  "
      >
        <span className="p-2 rounded-lg bg-green-500/10 backdrop-blur-md border border-green-400/20">
          <MessageSquareText size={26} className="text-green-400" />
        </span>

        <span className="tracking-wide">
          Chats <span className=" text-xs">({users.length})</span>{" "}
        </span>
      </h2>

        <div className="overflow-y-auto flex-1 hide-scrollbar">
          {loadingUsers ? (
            <div className="flex justify-center items-center mt-10 ">
              <span className="loading loading-dots loading-xl"></span>
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u._id}
                onClick={() => {
                  setTarget(u);
                  localStorage.setItem("chatTarget", JSON.stringify(u));
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer transition hover:bg-green-500/10 ${
                  target?._id === u._id && "bg-green-500/20"
                }`}
              >
                <img src={u.photoURL} className="w-10 h-10 rounded-full" />
                <div>
                  <p>{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div
        className={`w-full md:w-2/3 flex-col ${!target && "hidden md:flex"} flex`}
      >
        {!target ? (
          <div className="flex h-full items-center justify-center text-gray-400 text-xl">
            Select a user to chat
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5 backdrop-blur-xl md:rounded-tr-2xl">
              <button onClick={() => setTarget(null)} className="md:hidden">
                ←
              </button>
              <img src={target.photoURL} className="w-10 h-10 rounded-full" />
              <div>
                <h3>{target.name}</h3>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/5 hide-scrollbar">
              {messages.map((msg) => {
                const mine = msg.senderEmail === user.email;

                return (
                  <div
                    key={msg._id || msg.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-3 py-2 rounded-2xl text-base max-w-xs shadow-md
                        ${
                          mine
                            ? "bg-green-500/20 text-white rounded-br-none"
                            : "bg-white/10 text-white rounded-bl-none"
                        }`}
                    >
                      {/* TEXT */}
                      <span className="whitespace-pre-wrap break-words">
                        {msg.text}
                      </span>

                      {/* TIME + FORMAT (same line) */}
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-gray-300">
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        <span className="text-gray-400">
                          • {format(msg.createdAt)}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}></div>
            </div>

            {/* INPUT */}
            <div className="p-3 border-t border-white/10 flex gap-2 bg-white/5 backdrop-blur-xl md:rounded-br-2xl">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 p-3 rounded-full bg-white/10 outline-none"
                placeholder="Type message..."
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-green-500 rounded-full hover:scale-105 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
