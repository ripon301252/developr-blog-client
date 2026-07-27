import React from "react";
import { useAuth } from "../Hooks/useAuth";
import useAxiosNormal from "../Hooks/useAxiosNormal";
import { useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";

const GoogleLogin = () => {
  const axiosGoogleLogin = useAxiosNormal();
  const { signInGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

 const handleGoogleLogin = async () => {
  try {
    const res = await signInGoogle();
    const user = res.user;

    const userInfo = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    // 🔥 same API
    await axiosGoogleLogin.post("/users", userInfo);

    Swal.fire({
      icon: "success",
      title: "Login successful",
      timer: 1500,
      showConfirmButton: false,
    });

    navigate(location?.state || "/");
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: err.message,
    });
  }
};

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`google-btn ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
};

export default GoogleLogin;