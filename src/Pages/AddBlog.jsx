import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import logoImg from "../assets/logo.png";

const AddBlog = () => {
  const { user, loading, setLoading } = useAuth();
  const axiosAddBlog = useAxiosSecure();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  // 🔥 Auto set image
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      image:
        user?.photoURL ||
        "https://i.ibb.co/5Y3m33n/default-blog.jpg",
    }));
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login first!",
      });
    }

    if (!formData.title.trim()) {
      return Swal.fire("Error", "Title is required!", "error");
    }

    if (!formData.content.trim()) {
      return Swal.fire("Error", "Content is required!", "error");
    }

    const blogData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      image: formData.image,
      authorName: user?.displayName || "Anonymous",
      authorEmail: user?.email,
      likes: [],
      comments: [],
      createdAt: new Date(),
    };

    try {
      setLoading(true);

      const res = await axiosAddBlog.post("/blogs", blogData);

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "🎉 সফল!",
          text: "Blog Published Successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        setFormData({
          title: "",
          content: "",
          image:
            user?.photoURL ||
            "https://i.ibb.co/5Y3m33n/default-blog.jpg",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          err.response?.data?.error ||
          "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      <h2 className="text-3xl font-bold mb-8 text-green-400 text-center">
        ✍️ Create New Blog
      </h2>

      <div className="flex md:flex-row flex-col-reverse  justify-between items-center gap-5">
        
        {/* LEFT - FORM */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/20 flex-1">

          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                user?.photoURL ||
                "https://i.ibb.co/4pDNDk1/avatar.png"
              }
              className="w-14 h-14 rounded-lg border-2 border-green-400"
              alt="user"
            />
            <div>
              <p className="font-semibold text-lg">
                {user?.displayName || "Guest"}
              </p>
              <p className="text-sm text-gray-300">
                {user?.email || "Not logged in"}
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <input
              type="text"
              name="title"
              placeholder="📝 Blog Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 focus:outline-none focus:border-green-400 transition"
            />

            {/* Content */}
            <textarea
              name="content"
              placeholder="✍️ Write your blog..."
              value={formData.content}
              onChange={handleChange}
              rows="5"
              className="w-full p-3 rounded-lg bg-white/10 border border-gray-500 focus:outline-none focus:border-green-400 transition"
            />

            {/* Image */}
            <input
              type="text"
              name="image"
              value={formData.image}
              readOnly
              className="w-full p-2 rounded bg-white/5 border opacity-60 cursor-not-allowed"
            />

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 py-3 rounded-lg font-semibold hover:scale-[1.02] transition-all duration-200 flex justify-center items-center gap-2"
            >
              {loading ? "Publishing..." : "🚀 Publish Blog"}
            </button>
          </form>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="flex-[1.2] justify-center">
          <img
            src={logoImg}
            alt="logo"
            className="md:h-[500px] rounded-2xl object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default AddBlog;