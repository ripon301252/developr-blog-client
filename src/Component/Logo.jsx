import React from "react";
import logoImg from "../assets/logo.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        className="w-8 h-8 rounded-lg"
        src={logoImg}
        alt="logo"
      />

      <h3
        className="
          text-xl md:text-2xl font-bold
          bg-gradient-to-r from-green-400 via-emerald-300 to-green-600
          bg-clip-text text-transparent
          drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]
        "
      >
        Developer Blog
      </h3>
    </Link>
  );
};

export default Logo;