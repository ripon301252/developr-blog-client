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

    const handler = (data) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.id === data.id ||
            (m.text === data.text &&
              m.senderEmail === data.senderEmail &&
              m.createdAt === data.createdAt)
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

  // 💾 load saved target
  useEffect(() => {
    const saved = localStorage.getItem("chatTarget");
    if (saved) setTarget(JSON.parse(saved));
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

      const res = await axiosApi.get("/messages", {
        params: {
          email: user.email,
          chatWith: target.email,
        },
      });

      setMessages(Array.isArray(res.data) ? res.data : []);
    };

    load();
  }, [user?.email, target?.email]);

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
    <div className="min-h-screen  flex items-center justify-center">
      <div className="w-full max-w-7xl h-[90vh] flex text-white rounded-2xl overflow-hidden shadow-2xl ">

        {/* LEFT SIDEBAR */}
        <div className={`w-full md:w-1/3 ${target ? "hidden md:flex" : "flex"} flex-col 
        bg-white/5`}>

          {/* HEADER */}
          <h2 className="text-2xl font-bold py-[14.9px] flex justify-center items-center gap-3
          bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent border-b border-cyan-400/10">

            <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20 ">
              <MessageSquareText size={24} className="text-cyan-400" />
            </span>

            Chats <span className="text-sm mt-2">({users.length})</span>
          </h2>

          {/* USERS */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {loadingUsers ? (
              <div className="flex justify-center mt-10">
                <span className="loading loading-dots"></span>
              </div>
            ) : (
              users.map((u) => (
                <div
                  key={u._id}
                  onClick={() => {
                    setTarget(u);
                    localStorage.setItem("chatTarget", JSON.stringify(u));
                  }}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition
                  hover:bg-cyan-500/10
                  ${target?._id === u._id && "bg-cyan-500/20"}`}
                >
                  <img src={u.photoURL} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={`w-full md:w-2/3 flex-col ${!target && "hidden md:flex"} flex 
        bg-white/5 border-l border-cyan-500/10`}>

          {!target ? (
            <div className="flex h-full items-center justify-center text-gray-400">
              Select a user to chat
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="p-4 border-b border-cyan-400/10 flex items-center gap-3">
                <button onClick={() => setTarget(null)} className="md:hidden">←</button>
                <img src={target.photoURL} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold">{target.name}</h3>
                  <p className="text-xs text-cyan-400">Online</p>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
                {messages.map((msg) => {
                  const mine = msg.senderEmail === user.email;

                  return (
                    <div key={msg._id || msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`px-4 py-2 rounded-2xl max-w-xs shadow-lg
                      ${mine
                        ? "bg-gradient-to-r from-cyan-500/50 to-cyan-600/50 text-white rounded-br-none"
                        : "bg-white/10 text-white rounded-bl-none"}`}>

                        {msg.text}

                        <div className="text-[10px] mt-1 text-gray-300 flex gap-1">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>• {format(msg.createdAt)}</span>
                        </div>

                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef}></div>
              </div>

              {/* INPUT */}
              <div className="p-3 border-t border-cyan-400/10 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 p-3 rounded-full bg-white/10 outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Type message..."
                />

                <button
                  onClick={handleSend}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600
                  hover:scale-105 transition shadow-lg shadow-cyan-500/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;