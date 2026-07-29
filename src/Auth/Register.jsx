import React, { useState } from "react";
import GoogleLogin from "./GoogleLogin";
// import GithubLogin from "./GithubLogin";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAuth } from "../Hooks/useAuth";
import useAxiosNormal from "../Hooks/useAxiosNormal";
import Logo from "../Component/Logo";
import registerImg from "../assets/login.png";

const Register = () => {
  const { registerUser, setUser, updateUserProfile, setLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const axiosRegister = useAxiosNormal();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    // 🔴 Image check
    if (!image) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a photo",
        confirmButtonColor: "#10b981",
      });
    }

    // 🔴 Password validation
    if (password.length < 6) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Password",
        text: "Password must be at least 6 characters",
        confirmButtonColor: "#10b981",
      });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Must include uppercase & lowercase letters",
        confirmButtonColor: "#10b981",
      });
    }

    setLoading(true);

    try {
      // 🟢 Register user
      const result = await registerUser(email, password);
      const user = result.user;

      let photoURL = "";

      // 🟢 Upload image
      const formData = new FormData();
      formData.append("image", image);

      const image_hosting_url = `${import.meta.env.VITE_img_url}=${import.meta.env.VITE_image_host_key}`;
      const res = await axiosRegister.post(image_hosting_url, formData);
      const data = res.data;
      console.log(data);

      if (!data.success) {
        return Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Image upload failed",
        });
      }

      photoURL = data.data.url;

      // 🟢 Save user in DB
      const userInfo = {
        email: user.email,
        name,
        photoURL,
      };

      const dbRes = await axiosRegister.post("/users", userInfo);

      if (!dbRes.data.success) {
        return Swal.fire({
          icon: "error",
          title: "Database Error",
          text: "User not saved",
        });
      }

      // 🟢 Update profile
      await updateUserProfile({
        displayName: name,
        photoURL,
      });

      setUser({ ...user, displayName: name, photoURL });

      // ✅ Final success
      await Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "Welcome to the platform!",
        confirmButtonColor: "#10b981",
      });

      form.reset();
      setImage(null);
      navigate(location.state || "/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordShow = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="pb-10">
      <div className="lg:ml-10 mx-2 pt-3">
        <Logo />
      </div>
      <div className="flex lg:flex-row flex-col-reverse mx-2 justify-between items-center gap-5 lg:gap-8 lg:max-w-[1060.9px] lg:mx-auto lg:my-10 my-5">
        <div className="flex-1 bg-gradient-to-l from-[#021d10] to-[#062e17] lg:p-10 p-5 rounded-2xl shadow-xl border border-green-600/10">
          <h1 className="text-3xl font-bold text-center mb-3 text-white">
            Create Account
          </h1>
          <p className="text-center text-white mb-5">
            Join{" "}
            <span className="font-semibold text-green-600">Developer Blog</span>{" "}
            today!
          </p>
          <form onSubmit={handleSignUp} className="space-y-3 drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]">
            {/* Name */}
            <div>
              <label className="lable-all">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="input input-class"
              />
            </div>
            {/* Photo */}
            <div>
              <label className="label-all">Photo</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="file-input file-choose input-class"
              />
            </div>
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
            <div className="mb-5">
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
                  className="absolute top-3 right-3 text-green-600/50 text-xl cursor-pointer"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>
            {/* Register Button */}
            <button type="submit" className="btn-custom">
              Register
            </button>
            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="h-px w-16 bg-green-500/20"></div>
              <span className="text-green-500/20 text-sm">or</span>
              <div className="h-px w-16 bg-green-500/20"></div>
            </div>
            {/* Google Login */}
            <GoogleLogin />
            {/* Divider */}
            {/* <div className="flex items-center justify-center gap-2 my-2">
          <div className="h-px w-16 bg-green-500/20"></div>
          <span className="text-green-500/20 text-sm">or</span>
          <div className="h-px w-16 bg-green-500/20"></div>
        </div> */}
            {/* Git */}
            {/* <GithubLogin /> */}
          </form>
          {/* Login Link */}
          <p className="text-center text-white/50 mt-4">
            Already have an account?
            <Link
              state={location.state}
              to={`/login`}
              className="text-green-600 font-semibold hover:underline ml-1"
            >
              Login
            </Link>
          </p>
        </div>
        <div className="flex-[1.2]">
          <img
            src={registerImg}
            alt=""
            className="lg:h-[672.9px] object-center rounded-2xl drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
