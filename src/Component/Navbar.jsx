import React, { useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { NavLink, Link } from "react-router";
import Swal from "sweetalert2";
import Logo from "./Logo";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOutUser();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Logged out successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Add Blog", path: "/add-blog" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative font-medium transition ${
                  isActive
                    ? "text-sky-500"
                    : "text-gray-700 hover:text-sky-500"
                }`
              }
            >
              {link.name}

              {/* underline animation */}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-sky-500 transition-all duration-300 ${
                  location.pathname === link.path ? "w-full" : "w-0"
                }`}
              ></span>
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Avatar */}
          {user ? (
            <div className="relative group">
              <img
                src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-sky-400 hover:scale-105 transition"
              />

              {/* Dropdown */}
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200">
                <p className="px-4 py-2 text-sm text-gray-700 border-b">
                  {user.displayName || "User"}
                </p>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded-b-xl"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
            >
              Login
            </Link>
          )}

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
        <div className="px-4 pb-4 space-y-3 bg-white shadow">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 px-2 rounded ${
                  isActive
                    ? "bg-sky-100 text-sky-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {!user && (
            <Link
              to="/login"
              className="block text-center bg-sky-500 text-white py-2 rounded-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;