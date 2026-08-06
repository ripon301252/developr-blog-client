import React, { useState } from "react";
import GoogleLogin from "./GoogleLogin";
// import GithubLogin from "./GithubLogin";
import { useAuth } from "../Hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router";
import Logo from "../Component/Logo";
import loginImg from "../assets/register.png";

const Login = () => {
  const { signInUser, serUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    setError("");

    signInUser(email, password)
      .then(() => {
        e.target.reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Login successful",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(location?.state || "/");
      })
      .catch((err) => {
        console.log("ERROR CODE:", err.code);
        console.log("ERROR MESSAGE:", err.message);
        Swal.fire({
          icon: "error",
          title: err.message,
        });
      });
  };

  const handleTogglePasswordShow = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="lg:ml-10 mx-2 pt-3">
        <Logo />
      </div>
      <div className="flex lg:flex-row flex-col mx-2 justify-between items-center lg:gap-8 lg:max-w-[919.9px] lg:mx-auto lg:my-10">
        <div className="flex-[1.2]">
          <img
            src={loginImg}
            alt=""
            className="lg:h-[499.9px] object-cover mt-8 rounded-2xl drop-shadow-[0_0_12px_rgba(20,184,166,0.35)]"
          />
        </div>
        <div className="flex-1 bg-gradient-to-l from-cyan-500/10 to-cyan-400/10 lg:p-10 p-7 rounded-2xl shadow-xl mt-8 flex flex-col justify-center ">
          <h1 className="text-3xl font-bold text-center mb-3 text-white">
            Welcome Back
          </h1>
          <form onSubmit={handleSubmit} className="space-y-3  drop-shadow-[0_0_12px_rgba(20,184,166,0.35)]">
            {/* Email */}
            <div>
              <label className="label-all">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                required
                className="input input-class"
              />
            </div>
            {/* Password */}
            <div>
              <label className="label-all">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="input input-class"
                />

                <button
                  onClick={handleTogglePasswordShow}
                  className="absolute top-3 right-3 text-cyan-600/50 text-xl cursor-pointer"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div>
              <Link
                to={`/forgot`}
                className="text-sm font-semibold text-cyan-600/80 cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" className="btn-custom">
              Login
            </button>
            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="h-px w-16 bg-cyan-500/20"></div>
              <span className="text-cyan-500/20 text-sm">or</span>
              <div className="h-px w-16 bg-cyan-500/20"></div>
            </div>

            <GoogleLogin />

            {/* Divider */}
            {/* <div className="flex items-center justify-center gap-2 my-2">
          <div className="h-px w-16 bg-green-500/20"></div>
          <span className="text-green-500/20 text-sm">or</span>
          <div className="h-px w-16 bg-green-500/20"></div>
        </div> */}

            {/* <GithubLogin /> */}
          </form>

          <p className="text-center text-white/50 mt-4">
            Already have an account?
            <Link
              state={location.state}
              to={`/register`}
              className="text-cyan-600 font-semibold hover:underline ml-1"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
