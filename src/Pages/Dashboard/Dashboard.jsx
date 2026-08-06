import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  HandHelping,
  LogIn,
  LogOut,
  User,
  Users,
  UserPlus,
  FilePlus,
  Settings,
} from "lucide-react";
import useRole from "../../Hooks/useRole";
import { useAuth } from "../../Hooks/useAuth";
import Logo from "../../Component/Logo";
import { MdOutlineHome } from "react-icons/md";
import { HiOutlineCash } from "react-icons/hi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaHands } from "react-icons/fa6";

const Dashboard = () => {
  const axiosDashboard = useAxiosSecure();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef();

  const { role } = useRole();
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalBlogs: 0,
    totalComments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // 🔥 MUST

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosDashboard.get("/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]); // 🔥 dependency add

  const isDashboardHome = location.pathname === "/dashboard";

  const activeLinks = (isActive) =>
    `px-3 py-2 text-sm font-medium flex items-center gap-1 transition-all duration-300 ${
      isActive
        ? "text-cyan-500 text-sm rounded-lg font-semibold"
        : "text-xs hover:text-cyan-500 rounded-lg"
    }`;

  const handleLogout = () => {
    signOutUser()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logout Successful",
          text: "You have been logged out.",
          confirmButtonColor: "#22c55e", // green
        }).then(() => {
          navigate("/login"); // 👈 redirect after OK click
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: err.message,
        });
      });
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
          <nav className="navbar bg-cyan-900/95 backdrop-blur-3xl border-b border-cyan-950/50 sticky top-0 z-20 ">
            {/* MOBILE MENU BUTTON */}
            <label
              htmlFor="my-drawer-4"
              className="btn btn-square btn-ghost lg:hidden"
            >
              ☰
            </label>

            <div className="ml-auto flex items-center gap-3 px-4">
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
                      className="w-10 h-10 rounded-full border-2 border-cyan-400 cursor-pointer object-cover"
                    />

                    {avatarOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()} // inside click safe
                        className="absolute lg:-right-2 -right-1 lg:mt-13 mt-3 w-52 bg-cyan-900/95 backdrop-blur-3xl shadow-xl rounded-b-xl p-3 z-50"
                      >
                        <p className="font-semibold text-white ">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-white break-all">
                          {user?.email}
                        </p>

                        <span className="mt-2 text-xs bg-green-100 text-cyan-600 px-2 py-1 rounded-lg inline-block my-3">
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
                    <LogIn size={18} />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </nav>

          {/* HEADER CARD */}
          {isDashboardHome && (
            <div
              className=" bg-white/10 border border-cyan-400/10
    rounded-3xl p-6 md:p-10 shadow-[0_0_80px_rgba(34,197,94,0.15)] relative overflow-hidden m-5"
            >
              <div className="flex flex-col md:flex-row justify-between gap-8">
                {/* 🔥 Glow Effects */}
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-400/20 blur-[120px] rounded-full"></div>

                {/* LEFT */}
                <div className="relative z-10 flex-1">
                  <h2 className="text-xl md:text-3xl font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>Welcome back,</span>

                    <span className="text-cyan-400">
                      {user?.displayName || "User"}
                    </span>

                    <FaHands className="text-cyan-500/50 translate-y-[2px]" />
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Here's what's happening in your dashboard
                  </p>

                  {/* SUMMARY */}
                  <div className="mt-4 text-sm text-cyan-400">
                    {stats.totalUsers} Users • {stats.totalBlogs} Blogs
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
                    {[
                      { label: "Users", value: stats.totalUsers },
                      { label: "Admins", value: stats.totalAdmins },
                      { label: "Blogs", value: stats.totalBlogs },
                      { label: "Comments", value: stats.totalComments },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="
            group relative
            bg-white/5 backdrop-blur-lg
            border border-white/10
            rounded-2xl p-5
            transition-all duration-300
            hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/20
          "
                      >
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <h3 className="text-3xl font-bold text-cyan-400 mt-2">
                          {loading ? (
                            <span className="loading loading-dots loading-xs"></span>
                          ) : (
                            item.value
                          )}
                        </h3>

                        {/* hover glow */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-cyan-500/5 transition"></div>
                      </div>
                    ))}
                  </div>

                  {/* PROGRESS */}
                  <div className="mt-6">
                    <p className="text-xs text-gray-400 mb-1">Growth</p>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-2 w-[70%] rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs text-cyan-400 mt-2">
                      ↑ 70% this month
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="relative z-10 w-full md:w-[320px] flex flex-col gap-5">
                  {[
                    {
                      title: "Current Time",
                      value: new Date().toLocaleString(),
                    },
                    {
                      title: "System Status",
                      value: "All systems running ",
                    },
                    {
                      title: "Your Role",
                      value: role,
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="
          bg-white/5 backdrop-blur-lg
          border border-white/10
          rounded-2xl p-4
          hover:shadow-lg hover:shadow-green-500/10
          transition
        "
                    >
                      <p className="text-xs text-gray-400">{card.title}</p>
                      <p className="text-sm md:text-base text-cyan-300 mt-1 font-medium">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bottom */}
              <div className="flex md:flex-row flex-col items-center gap-3 pt-2 mt-5 ">
                {[
                  { label: "Add User", icon: UserPlus },
                  { label: "Create Blog", icon: FilePlus },
                  { label: "Manage Users", icon: Settings },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      className="flex items-center w-full justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10
      text-cyan-300 hover:bg-cyan-500/10 hover:text-white transition-all duration-300"
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={18} /> {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PAGE CONTENT */}
          <div className="lg:p-4 p-1">
            <Outlet />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="drawer-side">
          {/* OVERLAY (click to close) */}
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

          <div className="min-h-full w-64 bg-cyan-950 p-3">
            {/* LOGO */}
            <div className=" mb-4 px-1">
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
              <li>
                <NavLink
                  to="/dashboard/blogger-management"
                  onClick={closeDrawer}
                  className={({ isActive }) => activeLinks(isActive)}
                >
                  <Users size={18} />
                  Blogger Management
                </NavLink>
              </li>

              <button
                onClick={handleLogout}
                className="flex gap-2 items-center text-left px-3 py-2 round hover:bg-white/10 rounded-lg hover:text-red-400 text-sm cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
