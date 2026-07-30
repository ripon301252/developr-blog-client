import React, { useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { NavLink, Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import Logo from "./Logo";
import { HiMenu, HiX } from "react-icons/hi";
// import useRole from "../Hooks/useRole";

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
    { name: "Home", path: "/" },
    { name: "Add Blog", path: "/add-blog" },
    ...(user ? [{ name: "All Blogs", path: "/all-blogs" }] : []),
    // { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-gradient-to-l from-[#021d10] via-[#094222] to-[#021d10] backdrop-blur-lg border-b border-green-500/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="-ml-2">
          <Logo />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative font-medium transition ${
                  isActive
                    ? "text-green-500 border-b-2"
                    : "text-white hover:text-green-500"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
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
                    border-2 border-green-400/60 
                    shadow-md shadow-green-300/30
                    hover:scale-110 hover:shadow-green-400/40 
                    transition duration-300"
                />

                {/* Dropdown */}
                <div
                  className="
                    absolute right-0 top-full w-56 pt-4 mt-[14.9px] bg-gradient-to-l from-[#021d10] via-[#094222] to-[#021d10] rounded-b-2xl
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
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                    >
                      👤 Profile
                    </Link>

                
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                      >
                        📊 Dashboard
                      </Link>
                    

                    <button
                      onClick={handleSignOut}
                      className="
                          w-full text-left px-4 py-2 text-sm font-semibold
                          text-red-400 hover:bg-red-500/20 cursor-pointer
                          transition rounded-b-2xl
                        "
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="
        px-4 py-1.5 
        bg-gradient-to-r from-green-500/20 to-emerald-500/20
        text-white rounded-lg 
        shadow-md shadow-green-300/30
        hover:scale-105 hover:shadow-green-400/40
        transition duration-300
      "
              >
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
        <div className="space-y-3 bg-green-400/20 shadow rounded-b-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 px-2 rounded ${
                  isActive
                    ? "bg-green-100 text-green-500 font-semibold "
                    : "text-white hover:bg-green-100"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          
            <Link
              to="/dashboard"
              className="block px-2 py-2 text-sm text-white hover:bg-white/10 transition"
            >
            Dashboard
            </Link>
          

          {!user ? (
            <Link
              to="/login"
              className=" block text-center bg-green-500/50 font-semibold text-white py-2 rounded-lg"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleSignOut}
              className="w-full text-center px-2 py-2 font-semibold text-red-500 bg-red-100 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
