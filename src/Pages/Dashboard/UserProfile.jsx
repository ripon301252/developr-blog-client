import React, { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useAuth";
import Swal from "sweetalert2";

import { Link, useNavigate } from "react-router";
import { FaLongArrowAltLeft } from "react-icons/fa";

const UserProfile = () => {
  const { user, setUser, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    // 🔍 check if anything changed
    const isChanged =
      formData.displayName !== (user.displayName || "") ||
      formData.photoURL !== (user.photoURL || "");

    if (!isChanged) {
      return Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "You didn't change anything ",
      });
    }

    const confirm = await Swal.fire({
      title: "Update Profile?",
      text: "Do you want to save changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      await updateUserProfile(formData.displayName, formData.photoURL);

      setUser({
        ...user,
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Profile updated successfully ",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen text-white">
      <div className="flex justify-center items-center px-4 mt-10">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-green-400/30 to-green-600/30"></div>

          {/* Profile Info */}
          <div className="p-6 text-center ">
            <div
              onClick={() => navigate(-1)}
              className="text-left -mt-36 cursor-pointer font-semibold flex items-center gap-2"
            >
              <FaLongArrowAltLeft />
              Go Back
            </div>
            {/* Avatar */}
            <div className="mt-12">
              <img
                src={formData.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                className="w-32 h-32 mx-auto rounded-full border-4 border-green-500/50 shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-bold mt-3">
              {formData.displayName || "Your Name"}
            </h2>

            <p className="text-gray-300 text-sm">{user.email}</p>

            {/* Inputs */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <input
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Your Name"
                className="p-3 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:border-green-400"
              />

              <input
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="Photo URL"
                className="p-3 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:border-green-400"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
