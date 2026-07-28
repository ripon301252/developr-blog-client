import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../Hooks/useAuth";
import useAxiosNormal from "../Hooks/useAxiosNormal";

const AddBlog = () => {
  const { user, loading, setLoading } = useAuth();
  const axiosAddBlog = useAxiosNormal();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  // 🔥 Auto set image from user
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      image: user?.photoURL || "https://i.ibb.co/5Y3m33n/default-blog.jpg",
    }));
  }, [user]);

  // 🔥 Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return Swal.fire("Error", "Please login first!", "error");
    }

    // 🔥 Validation
    if (!formData.title.trim()) {
      return Swal.fire("Error", "Title is required!", "error");
    }

    if (!formData.content.trim()) {
      return Swal.fire("Error", "Content is required!", "error");
    }

    const blogData = {
      title: formData.title.trim(),
      content: formData.content.trim(),

      image: formData.image || "default-url",

      authorName: user?.displayName || "Anonymous",
      authorEmail: user?.email,

      likes: [],
      comments: [],

      createdAt: new Date(),
    };

    try {
      setLoading(true);
      const res = await axiosAddBlog.post("/blogs", blogData);

      if (res.status === 201 || res.status === 200) {
        Swal.fire("Success", "Blog Published Successfully!", "success");

        // 🔥 Reset form
        setFormData({
          title: "",
          content: "",
          image: user?.photoURL || "https://i.ibb.co/5Y3m33n/default-blog.jpg",
        });
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Failed to publish blog",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-green-900/30 rounded-xl text-white">
      <h2 className="text-2xl font-bold mb-6 text-green-400">✍️ Add Blog</h2>

      {/* 🔥 User Info */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
          className="w-12 h-12 rounded-full border"
          alt="user"
        />
        <div>
          <p className="font-semibold">{user?.displayName || "Guest"}</p>
          <p className="text-sm text-gray-300">
            {user?.email || "Not logged in"}
          </p>
        </div>
      </div>

      {/* 🔥 Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/10 border"
        />

        {/* Content */}
        <textarea
          name="content"
          placeholder="Blog Content"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/10 border"
          rows="5"
        />

        {/* Image */}
        <input
          type="text"
          name="image"
          value={formData.image}
          readOnly
          className="w-full p-2 rounded bg-white/10 border opacity-70 cursor-not-allowed"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 py-2 rounded font-semibold flex justify-center items-center gap-2"
        >
          {loading ? "Publishing..." : "🚀 Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
