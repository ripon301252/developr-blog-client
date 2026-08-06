import React, { useRef } from "react";
import { useAuth } from "../Hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import loginImg from "../assets/register.png";
import Logo from "../Component/Logo";

const ForgotPassword = () => {
  const { passwordReset } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef();
  const location = useLocation();

  const prefilledEmail = location.state?.email || "";

  const handleReset = () => {
    const email = emailRef.current.value;

    // ❌ Empty email validation
    if (!email) {
      return Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address!",
        confirmButtonColor: "#0ea5e9",
      });
    }

    passwordReset(email)
      .then(() => {
        // ✅ Success alert
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "Check your inbox for reset link.",
          confirmButtonColor: "#0ea5e9",
        }).then(() => {
          navigate("/login");
        });
      })
      .catch((err) => {
        // ❌ Error alert
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: err.message,
          confirmButtonColor: "#ef4444",
        });
      });
  };

  return (
    <div className="min-h-screen">
      <title>Developer Blog - Reset Password</title>

      <div className="lg:ml-10 mx-2 pt-3">
        <Logo />
      </div>

      <div className="flex lg:flex-row flex-col mx-2 justify-center items-center lg:max-w-4xl lg:mx-auto lg:my-10 my-5">
        <div className="flex-[1.2]">
          <img
            src={loginImg}
            alt=""
            className="w-[420px]  rounded-2xl drop-shadow-[0_0_12px_rgba(20,184,166,0.35)]"
          />
        </div>

        <div className="flex-1 bg-gradient-to-l  from-cyan-500/10 to-cyan-400/10 px-6 py-18 space-y-4 rounded-xl ">
          <h2 className="text-3xl font-bold text-white text-center">
            Reset Your Password
          </h2>

          <p className="text-sm text-white text-center mb-10">
            Enter your email and we’ll send a reset link
          </p>

          <div className="drop-shadow-[0_0_12px_rgba(20,184,166,0.35)]">
            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                ref={emailRef}
                defaultValue={prefilledEmail}
                type="email"
                className="input input-class mb-5"
                placeholder="Enter your email"
              />
            </div>

            {/* Button */}
            <button onClick={handleReset} className="btn-custom">
              Send Reset Link
            </button>
          </div>

          {/* Back */}
          <div className="text-sm text-white/50 text-center">
            Remembered your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-cyan-600 hover:underline font-semibold cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
