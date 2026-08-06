import React, { useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { NavLink, Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import Logo from "./Logo";
import { HiMenu, HiX } from "react-icons/hi";
// import useRole from "../Hooks/useRole";
import { MdOutlineHome } from "react-icons/md";
import { TbBrandBlogger } from "react-icons/tb";
import {
  LogIn,
  LogOut,
  LayoutDashboard,
  User,
  MessageCircleMore,
} from "lucide-react";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  // const { role, roleLoading } = useRole();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Logged out successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/login");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // const handleSignOut = () => {
  //   signOutUser();
  //   Swal.fire({
  //     position: "center",
  //     icon: "success",
  //     title: "Logged out successfully",
  //     showConfirmButton: false,
  //     timer: 1500,
  //   });
  // };

  const navLinks = [
    { name: "Home", icon: MdOutlineHome, path: "/" },
    { name: "Add Blog", icon: TbBrandBlogger, path: "/add-blog" },
    ...(user
      ? [{ name: "All Blogs", icon: TbBrandBlogger, path: "/all-blogs" }]
      : []),
    { name: "Chats", icon: MessageCircleMore, path: "/chats" },
  ];

  return (
    <nav className="bg-gradient-to-l from-cyan-950 via-cyan-800 to-cyan-950 backdrop-blur-lg border-b border-cyan-500/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="-ml-2">
          <Logo />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const Icon = link.icon; // 🔥 important

            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-1 relative font-medium transition ${
                    isActive
                      ? "text-cyan-500 "
                      : "text-white hover:text-cyan-500"
                  }`
                }
              >
                {Icon && <Icon size={18} />} {/* 🔥 icon show */}
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Avatar / Login */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative inline-block group">
                {/* Avatar */}
                <img
                  src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full cursor-pointer 
                    border-2 border-teal-400/60 
                    shadow-md shadow-teal-300/30
                    hover:scale-110 hover:shadow-teal-400/40 
                    transition duration-300"
                />

                {/* Dropdown */}
                <div
                  className="
                    absolute right-0 top-full w-56 pt-4 mt-[18.9px] bg-gradient-to-l from-cyan-950 via-cyan-800 to-cyan-950 rounded-b-2xl
                    opacity-0 scale-95 translate-y-2 invisible
                    group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:visible
                    transition-all duration-300
                  "
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-white/20">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-200 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-1 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                    >
                      <User size={18} />
                      Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-1 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className=" flex items-center gap-1
                          w-full text-left px-4 py-2 text-sm font-semibold
                          text-red-400 hover:bg-red-500/20 cursor-pointer
                          transition rounded-b-2xl
                        "
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="
        px-4 py-1.5 btn 
        bg-gradient-to-r from-cyan-500/20 to-cyan-500/50
        text-white rounded-lg 
      "
              >
                <LogIn size={18} />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <HiX size={26} /> : <HiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="space-y-3 bg-teal-400/20 shadow rounded-b-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-2 px-2 rounded ${
                    isActive
                      ? "bg-green-100 text-teal-500 font-semibold"
                      : "text-white hover:bg-green-100"
                  }`
                }
              >
                {Icon && <Icon size={18} />}
                {link.name}
              </NavLink>
            ); // ✅ semicolon এখানে থাকবে
          })}

          {!user ? (
            <Link
              to="/login"
              className=" flex justify-center items-center gap-1 bg-green-500/50 font-semibold text-white py-2 rounded-lg"
            >
              <LogIn size={18} />
              Login
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-2 py-2 text-sm text-white hover:bg-white/10 transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex justify-center items-center gap-1  px-2 py-2 font-semibold text-red-700 bg-red-300 rounded-lg"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
