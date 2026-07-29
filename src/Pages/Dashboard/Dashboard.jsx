import React, { useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  AudioLines,
  BadgeDollarSign,
  ChartArea,
  Cuboid,
  HandHelping,
  LogOut,
  Motorbike,
  User,
  Users,
  UserStar,
} from "lucide-react";
import useRole from "../../Hooks/useRole";
import { useAuth } from "../../Hooks/useAuth";
import Logo from "../../Component/Logo";
import { MdOutlineHome } from "react-icons/md";
import { HiOutlineCash } from "react-icons/hi";

const DashboardLayout = () => {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef();

  const { role } = useRole();
  const { user, signOutUser } = useAuth();
  // const location = useLocation();

  const activeLinks = (isActive) =>
    `px-3 py-2 text-sm font-medium flex items-center gap-1 transition-all duration-300 ${
      isActive
        ? "text-gray-800 text-xs rounded-lg text-green-500"
        : "text-xs hover:text-green-500 rounded-lg"
    }`;

  const handleLogout = () => {
    signOutUser()
      .then(() => alert.success("Logout successful"))
      .catch((err) => alert.error(err.message));
  };

  // 👉 sidebar auto close (mobile UX)
  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer-4");
    if (drawer) drawer.checked = false;
  };

  return (
    <div className="min-h-screen">
      <div className="drawer lg:drawer-open">
        {/* TOGGLE CONTROL */}
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        {/* MAIN CONTENT */}
        <div className="drawer-content">
          {/* TOP NAVBAR */}
          <nav className="navbar bg-green-950 border-b border-green-900 sticky top-0 z-10 ">
            {/* MOBILE MENU BUTTON */}
            <label
              htmlFor="my-drawer-4"
              className="btn btn-square btn-ghost lg:hidden"
            >
              ☰
            </label>

            <div className="ml-auto flex items-center gap-3 px-4">
              {/* <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                {role}
              </span> */}

              {/* Avatar */}
              <div
                className="relative lg:inline-flex"
                ref={avatarRef}
                onClick={() => setAvatarOpen(false)} // outside click = close
              >
                {user ? (
                  <>
                    <img
                      onClick={(e) => {
                        e.stopPropagation(); // prevent parent click
                        setAvatarOpen(!avatarOpen);
                      }}
                      src={
                        user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"
                      }
                      alt="avatar"
                      className="w-10 h-10 rounded-full border-2 border-green-400 cursor-pointer object-cover"
                    />

                    {avatarOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()} // inside click safe
                        className="absolute lg:-right-2 -right-1 lg:mt-13 mt-3 w-52 bg-green-950 shadow-xl rounded-b-xl p-3 z-50"
                      >
                        <p className="font-semibold text-white ">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-white break-all">
                          {user?.email}
                        </p>

                        <span className="mt-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          {role}
                        </span>

                        <hr className="my-2" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex gap-2 items-center text-left px-3 py-2 round hover:bg-white/10 rounded-lg hover:text-red-400 text-sm cursor-pointer"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/login" className="btn btn-sm rounded-full">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </nav>

          {/* HEADER CARD */}
          <div className="lg:p-4 p-1">
            <div className="bg-green-500/10 rounded-xl p-4 shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Welcome back 👋 Manage everything from here
                </p>
              </div>

              <div className="hidden md:block stats shadow">
                <div className="stat">
                  <div className="stat-title">Status</div>
                  <div className="stat-value text-green-500 text-lg">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div className="lg:p-4 p-1">
            <Outlet />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="drawer-side">
          {/* OVERLAY (click to close) */}
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

          <div className="min-h-full w-64 bg-green-950 p-3">
            {/* LOGO */}
            <div className=" mb-4 px-1">
              {/* <img src={logoImg} className="w-8" />
              <h2 className="font-bold text-lg">ParcelX</h2> */}
              <Logo></Logo>
            </div>

            <ul className="menu gap-1">
              {/* HOME */}
              <li>
                <NavLink
                  to="/"
                  onClick={closeDrawer}
                  className={({ isActive }) => activeLinks(isActive)}
                >
                  <MdOutlineHome size={18} />
                  Home
                </NavLink>
              </li>

              {/* ADMIN MENU */}
              {role === "admin" && (
                <>
                  <li className="menu-title">Admin Panel</li>

                  <li>
                    <NavLink
                      to="/dashboard/profile"
                      onClick={closeDrawer}
                      className={({ isActive }) => activeLinks(isActive)}
                    >
                      <User size={18} />
                      User Profile
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/dashboard/user-management"
                      onClick={closeDrawer}
                      className={({ isActive }) => activeLinks(isActive)}
                    >
                      <Users size={18} />
                      User Management
                    </NavLink>
                  </li>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex gap-2 items-center text-left px-3 py-2 round hover:bg-white/10 rounded-lg hover:text-red-400 text-sm cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>

              {/* SETTINGS */}
              <li className="mt-6">
                <button className="flex gap-2 items-center hover:text-green-300">
                  ⚙️ Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
