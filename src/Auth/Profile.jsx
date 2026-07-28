import React, { useState, useEffect } from "react";
import { useAuth } from "../Hooks/useAuth";
import Swal from "sweetalert2";
import Logo from "../Component/Logo";

const Profile = () => {
  const { user, setUser, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  // input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // save system
  const handleSave = async () => {
    const confirm = await Swal.fire({
      title: "Update Profile?",
      text: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      // firebase update
      await updateUserProfile(
        formData.displayName,
        formData.photoURL
      );

      // 🔥 instant UI update (IMPORTANT)
      setUser({
        ...user,
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      Swal.fire("Success!", "Profile updated 🚀", "success");
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
    <div className="">
      <div className="lg:ml-10 mx-2 mt-3">
        <Logo />
      </div>

      <div className="min-h-screen  flex items-center justify-center p-4 text-white">
        
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">

          {/* Avatar */}
          <div className="text-center">
            <img
              src={
                formData.photoURL ||
                "https://i.ibb.co/4pDNDk1/avatar.png"
              }
              className="w-28 h-28 mx-auto rounded-full border-4 border-green-400 mb-4"
            />
            <p className="text-sm text-gray-300">{user.email}</p>
          </div>

          {/* Inputs */}
          <div className="mt-6 space-y-3">
            <input
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 rounded-lg bg-black/30 border border-white/20"
            />

            <input
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              placeholder="Photo URL"
              className="w-full p-3 rounded-lg bg-black/30 border border-white/20"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full mt-5 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;