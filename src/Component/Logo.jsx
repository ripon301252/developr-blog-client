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
          bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-600
          bg-clip-text text-transparent
          drop-shadow-[0_0_12px_rgba(20,184,166,0.35)]
        "
      >
        Developer Blog
      </h3>
    </Link>
  );
};

export default Logo;