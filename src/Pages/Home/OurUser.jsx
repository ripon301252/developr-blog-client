import React, { useEffect, useState } from "react";
import useAxiosNormal from "../../Hooks/useAxiosNormal";
import Marquee from "react-fast-marquee";
import { Users } from "lucide-react";

const OurUser = () => {
  const axiosOurUser = useAxiosNormal();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosOurUser
      .get("/public/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, [axiosOurUser]);

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4">
      {/* Title */}
      <h2
        className="
      text-2xl md:text-3xl lg:text-4xl
      font-bold mb-10
      flex justify-center items-center gap-3

      bg-gradient-to-r from-green-400 via-emerald-400 to-green-600
      bg-clip-text text-transparent

      px-6 py-3 rounded-xl
      border border-green-400/20
      shadow-[0_0_20px_rgba(34,197,94,0.2)]

      w-fit mx-auto
    "
      >
        <span className="p-2 rounded-lg bg-green-500/10 border border-green-400/20">
          <Users size={28} className="text-green-400" />
        </span>

        <span className="tracking-wide">Our Users <span className=" text-xs">({users.length})</span> </span>
      </h2>

      {/* Marquee */}
      {users.length === 0 ? (
        <div className="text-center text-gray-400">
          <div className="flex justify-center items-center gap-2">
            <span className="loading loading-bars loading-xl"></span>
          </div>
        </div>
      ) : (
        <Marquee speed={25} pauseOnHover gradient={false} autoFill>
          {users.map((user) => (
            <div key={user._id} className="mx-4 min-w-[190px]">
              {/* Card */}
              <div
                className="
            bg-white/5 backdrop-blur-2xl
            border border-white/10
            rounded-2xl
            p-6 text-center

            shadow-[0_10px_30px_rgba(0,0,0,0.3)]
          "
              >
                {/* Image */}
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/100"}
                    alt={user.name}
                    className="
                w-20 h-20 rounded-full object-cover
                border-2 border-green-400
                shadow-[0_0_15px_rgba(34,197,94,0.3)]
              "
                  />

                  {/* Online Dot */}
                  <span
                    className="
                absolute bottom-1 right-1
                w-3 h-3 bg-green-400
                border-2 border-black
                rounded-full
              "
                  ></span>
                </div>

                {/* Name */}
                <h2 className="mt-4 text-white font-semibold text-sm tracking-wide">
                  {user.name}
                </h2>

                {/* Decorative Line */}
                <div className="mt-3 w-10 h-[2px] bg-gradient-to-r from-green-400 to-emerald-500 mx-auto opacity-70"></div>
              </div>
            </div>
          ))}
        </Marquee>
      )}
    </div>
  );
};

export default OurUser;
