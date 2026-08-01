import { useEffect, useState } from "react";
import Messages from "./Messages";
import useAxiosNormal from "../../Hooks/useAxiosNormal";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { MessageSquareText } from "lucide-react";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [target, setTarget] = useState(null);
  const axiosChat = useAxiosNormal();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const savedTarget = localStorage.getItem("chatTarget");

    if (savedTarget) {
      setTarget(JSON.parse(savedTarget));
    }
  }, []);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.close(); // 🔥 use close instead of disconnect
    };
  }, []);

  useEffect(() => {
    axiosChat
      .get("/users")
      .then((res) => {
        console.log("API DATA 👉", res.data);

        // 🔥 correct way
        setUsers(res.data.users);
      })
      .catch((err) => console.log("ERROR:", err));
  }, [axiosChat]);
  console.log(users);

  return (
    <div className="h-screen flex bg-white/5 text-white max-w-7xl mx-auto md:p-20 p-2 md:m-24 m-0 rounded-2xl">
      {/* LEFT SIDEBAR */}
      <div
        className={`${target ? "hidden md:flex" : "flex"} w-full md:w-1/3 border-r border-white/10 backdrop-blur-xl bg-white/5 flex flex-col lg:rounded-l-2xl rounded-2xl`}
      >
        <h2 className="text-xl font-semibold p-[21.8px] border-b border-white/10 rounded-tl-selector backdrop-blur-md sticky top-0 z-10 flex items-center gap-2 ">
          <MessageSquareText size={24} />
           Chat List
        </h2>

        <div className="overflow-y-auto flex-1 hide-scrollbar">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setTarget(user);
                localStorage.setItem("chatTarget", JSON.stringify(user));
              }}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-300
              hover:bg-green-500/10 hover:scale-[1.02]
              ${target?._id === user._id ? "bg-green-500/20" : ""}
            `}
            >
              <img
                src={user.photoURL}
                className="w-12 h-12 rounded-full border-2 border-green-400/40"
              />

              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>

              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className={`
    ${!target ? "hidden md:flex" : "flex"}
    w-full md:w-2/3 flex-col
  `}
      >
        {!target ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            👉 Select a user to start chatting
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center gap-3 sticky top-0 z-10 rounded-tr-2xl">
              <button
                onClick={() => {
                  setTarget(null);
                  localStorage.removeItem("chatTarget");
                }}
                className="md:hidden text-xl mr-2"
              >
                ←
              </button>

              <img
                src={target.photoURL}
                className="w-10 h-10 rounded-full border border-green-400"
              />
              <div>
                <h3 className="font-semibold">{target.name}</h3>
                <p className="text-xs text-green-400">● Online</p>
              </div>
            </div>

            <Messages target={target} socket={socket} />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
